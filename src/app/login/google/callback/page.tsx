"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exchangeGoogleCode } from "@/lib/auth/google/exchangeGoogleCode";
import { PAGE_ROUTES } from "@/utils/routes";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"waiting" | "error">("waiting");
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      const desc = searchParams.get("error_description") ?? error;
      console.error("[Google Callback] OAuth error:", error, desc);
      setErrorCode(`oauth: ${error}`);
      setStatus("error");
      setTimeout(() => router.replace(PAGE_ROUTES.WEB_AUTH), 2000);
      return;
    }

    if (!code) {
      setErrorCode("no_code");
      setStatus("error");
      setTimeout(() => router.replace(PAGE_ROUTES.WEB_AUTH), 2000);
      return;
    }

    exchangeGoogleCode(code)
      .then((data) => {
        if (data.success) {
          window.location.replace(PAGE_ROUTES.HOME);
        } else {
          const errMsg = data.error ?? "unknown";
          console.error("[Google Callback] exchangeGoogleCode failed:", errMsg);
          setErrorCode(errMsg);
          setStatus("error");
          setTimeout(() => router.replace(PAGE_ROUTES.WEB_AUTH), 2000);
        }
      })
      .catch((err) => {
        console.error("[Google Callback] exchangeGoogleCode threw:", err);
        setErrorCode(err instanceof Error ? err.message : "server_error");
        setStatus("error");
        setTimeout(() => router.replace(PAGE_ROUTES.WEB_AUTH), 2000);
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-white/20 p-8 max-w-sm w-full text-center">
        {status === "waiting" ? (
          <>
            <div className="animate-spin w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-700">Ожидание авторизации...</p>
            <p className="text-sm text-gray-500 mt-2">Завершаем вход через Google</p>
          </>
        ) : (
          <>
            <p className="text-red-600">Ошибка авторизации</p>
            {errorCode && (
              <p className="text-xs text-gray-500 mt-1 font-mono" title="Код ошибки для отладки">
                {errorCode}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2">Перенаправление на страницу входа</p>
          </>
        )}
      </div>
    </div>
  );
}

function CallbackFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-white/20 p-8 max-w-sm w-full text-center">
        <div className="animate-spin w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-700">Загрузка...</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <GoogleCallbackContent />
    </Suspense>
  );
}

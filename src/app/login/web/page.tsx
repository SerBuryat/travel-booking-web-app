"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useVkIdAuth } from "@/hooks/auth/vk/useVkIdAuth";
import { useYandexIdAuth } from "@/hooks/auth/yandex/useYandexIdAuth";
import { useGoogleIdAuth } from "@/hooks/auth/google/useGoogleIdAuth";
import { useAuth } from "@/contexts/AuthContext";
import { vkidToUserAuthRequest } from "@/lib/auth/authDataWrapper";
import { PAGE_ROUTES } from "@/utils/routes";

export default function WebLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const startYandexAuth = useYandexIdAuth();
  const startGoogleAuth = useGoogleIdAuth();

  const handleVKLogin = () => {
    useVkIdAuth()
      .then((userInfoResult) => {
        const userAuthRequest = vkidToUserAuthRequest(userInfoResult);
        return login(userAuthRequest);
      })
      .then(() => router.push(PAGE_ROUTES.HOME))
      .catch(console.error);
  };

  const handleYandexLogin = () => {
    startYandexAuth();
  };

  const handleGoogleLogin = () => {
    startGoogleAuth();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 space-y-3">
          <button
            type="button"
            onClick={handleVKLogin}
            className="w-full bg-[#0077FF] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#0066DD] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Войти через VK ID
          </button>

          <button
            type="button"
            onClick={handleYandexLogin}
            className="w-full bg-[#FC3F1D] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#E63514] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Войти через Yandex ID
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white text-gray-800 px-6 py-3 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Войти через Google
          </button>
        </div>
      </div>
    </div>
  );
}

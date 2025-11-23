'use client';

import { useEffect } from 'react';

/**
 * Клиентский компонент для инициализации Yandex Metrica
 * Используется в Next.js app directory для корректной работы
 */
export function YandexMetricaScript() {
  useEffect(() => {
    const metricaId = parseInt(process.env.NEXT_PUBLIC_YANDEX_METRICA_ID || '0');
    
    if (metricaId > 0 && typeof window !== 'undefined') {
      // Проверяем, не загружен ли уже скрипт
      if (document.getElementById('yandex-metrica-script')) {
        return;
      }

      // Создаем и добавляем скрипт Yandex Metrica
      const script = document.createElement('script');
      script.id = 'yandex-metrica-script';
      script.type = 'text/javascript';
      script.innerHTML = `
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(${metricaId}, "init", {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
          trackHash: true
        });
      `;
      document.head.appendChild(script);

      // Создаем noscript для пользователей без JavaScript
      const noscript = document.createElement('noscript');
      noscript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${metricaId}" style="position:absolute; left:-9999px;" alt="" /></div>`;
      document.body.appendChild(noscript);
    }
  }, []);

  return null;
}


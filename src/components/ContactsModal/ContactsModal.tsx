'use client';

import React from 'react';
import { ContactsType } from '@/model/ContactsType';
import { PhoneIcon, TelegramIcon, WhatsAppIcon, WebsiteIcon } from './icons';

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: ContactsType[];
}

/**
 * Компонент модального окна с контактной информацией сервиса.
 * 
 * Отображает контакты с кликабельными ссылками и иконками:
 * - Телефон: tel: ссылка для вызова
 * - Telegram: ссылка на профиль в Telegram
 * - WhatsApp: ссылка для отправки сообщения в WhatsApp
 * - Сайт: ссылка на веб-сайт
 */
export default function ContactsModal({ isOpen, onClose, contacts }: ContactsModalProps) {
  if (!isOpen) return null;

  /**
   * Форматирует номер телефона для tel: ссылки
   * Удаляет все символы кроме цифр и +
   */
  const formatPhoneForTel = (phone: string): string => {
    // Удаляем все символы кроме цифр, + и пробелов
    let cleaned = phone.replace(/[^\d+\s]/g, '');
    // Если номер не начинается с +, добавляем +7 для российских номеров
    if (!cleaned.startsWith('+')) {
      // Удаляем первую 8, если есть, и заменяем на +7
      cleaned = cleaned.replace(/^8/, '7');
      if (!cleaned.startsWith('7')) {
        cleaned = '7' + cleaned;
      }
      cleaned = '+' + cleaned;
    }
    // Удаляем все пробелы и дефисы
    return cleaned.replace(/[\s-]/g, '');
  };

  /**
   * Форматирует номер телефона для WhatsApp
   * Удаляет все символы кроме цифр
   */
  const formatPhoneForWhatsApp = (phone: string): string => {
    let cleaned = phone.replace(/[^\d]/g, '');
    // Если номер начинается с 8, заменяем на 7
    if (cleaned.startsWith('8')) {
      cleaned = '7' + cleaned.substring(1);
    }
    // Если номер не начинается с 7, добавляем 7
    if (!cleaned.startsWith('7')) {
      cleaned = '7' + cleaned;
    }
    return cleaned;
  };

  /**
   * Очищает username от @ символа для Telegram
   */
  const cleanTelegramUsername = (username: string): string => {
    return username.replace(/^@/, '');
  };

  /**
   * Проверяет, является ли URL валидным и добавляет https:// если нужно
   */
  const formatWebsiteUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return 'https://' + url;
  };

  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center" style={{ zIndex: 60 }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 m-0 sm:m-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Контакты</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        
        {contacts && contacts.length > 0 ? (
          <div className="space-y-3">
            {contacts.map((c) => (
              <div key={c.id} className="rounded-lg border border-gray-100 p-4 space-y-3">
                {/* Телефон */}
                {c.phone && (
                  <a
                    href={`tel:${formatPhoneForTel(c.phone)}`}
                    className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <PhoneIcon />
                    <span className="font-medium">Телефон:</span>
                    <span>{c.phone}</span>
                  </a>
                )}

                {/* Telegram */}
                {c.tg_username && (
                  <a
                    href={`https://t.me/${cleanTelegramUsername(c.tg_username)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <TelegramIcon />
                    <span className="font-medium">Telegram:</span>
                    <span>@{cleanTelegramUsername(c.tg_username)}</span>
                  </a>
                )}

                {/* WhatsApp */}
                {c.whatsap && (
                  <a
                    href={`https://wa.me/${formatPhoneForWhatsApp(c.whatsap)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-700 hover:text-green-600 transition-colors"
                  >
                    <WhatsAppIcon />
                    <span className="font-medium">WhatsApp:</span>
                    <span>{c.whatsap}</span>
                  </a>
                )}

                {/* Сайт */}
                {c.website && (
                  <a
                    href={formatWebsiteUrl(c.website)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <WebsiteIcon />
                    <span className="font-medium">Сайт:</span>
                    <span className="underline">{c.website}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">Контактная информация недоступна</div>
        )}
        
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}


'use client';

import React, { useState, useRef } from 'react';
import { saveServicePhoto } from '@/lib/service/media';

interface PhotoItem {
  id: string;
  file: File;
  previewUrl: string;
  isPrimary: boolean;
}

const MAX_PHOTOS = 10;

export const ServicePhotoUpload: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [primaryPhotoId, setPrimaryPhotoId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Хардкод serviceId для тестирования
  const SERVICE_ID = 32;

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newPhotos: PhotoItem[] = [];
    const remainingSlots = MAX_PHOTOS - photos.length;

    if (remainingSlots <= 0) {
      setError(`Максимальное количество фото: ${MAX_PHOTOS}`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    const isFirstUpload = photos.length === 0;
    let firstValidPhotoId: string | null = null;

    for (const file of filesToProcess) {
      // Проверяем, что это изображение
      if (!file.type.startsWith('image/')) {
        setError(`Файл "${file.name}" не является изображением`);
        continue;
      }

      const id = `${Date.now()}-${Math.random()}`;
      
      // Если это первое фото и еще нет обложки, запоминаем его ID
      if (isFirstUpload && firstValidPhotoId === null) {
        firstValidPhotoId = id;
      }
      
      // Определяем, будет ли это фото обложкой
      const willBePrimary = isFirstUpload && firstValidPhotoId === id;
      
      // Создаем превью
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setPhotos(prev => {
          const existing = prev.find(p => p.id === id);
          if (existing) {
            return prev.map(p => p.id === id ? { ...p, previewUrl } : p);
          }
          return [...prev, { id, file, previewUrl, isPrimary: willBePrimary }];
        });
      };
      reader.readAsDataURL(file);

      // Временно добавляем без previewUrl
      newPhotos.push({ id, file, previewUrl: '', isPrimary: willBePrimary });
    }

    // Устанавливаем обложку на первое загруженное фото (если это первая загрузка)
    if (isFirstUpload && firstValidPhotoId && primaryPhotoId === null) {
      setPrimaryPhotoId(firstValidPhotoId);
    }

    setPhotos(prev => [...prev, ...newPhotos]);
    setError(null);
    setUploadSuccess(new Set());
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // Сбрасываем значение input для возможности повторной загрузки того же файла
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveFile = (id: string) => {
    // Если удаляем primary фото, выбираем первое из оставшихся
    const wasPrimary = primaryPhotoId === id;
    
    setPhotos(prev => {
      const filtered = prev.filter(p => p.id !== id);
      
      // Если удалили обложку, устанавливаем первую оставшуюся как обложку
      if (wasPrimary && filtered.length > 0) {
        const newPrimaryId = filtered[0].id;
        setPrimaryPhotoId(newPrimaryId);
        return filtered.map(p => ({ ...p, isPrimary: p.id === newPrimaryId }));
      }
      
      return filtered;
    });
    
    if (wasPrimary && photos.filter(p => p.id !== id).length === 0) {
      setPrimaryPhotoId(null);
    }
    
    setUploadSuccess(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setError(null);
  };

  const handleSetPrimary = (id: string) => {
    setPrimaryPhotoId(id);
    setPhotos(prev => prev.map(p => ({ ...p, isPrimary: p.id === id })));
  };

  const handleClearAll = () => {
    setPhotos([]);
    setPrimaryPhotoId(null);
    setUploadSuccess(new Set());
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (photos.length === 0) {
      setError('Пожалуйста, выберите хотя бы одно фото для загрузки');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadSuccess(new Set());

    try {
      // Сохраняем все фото параллельно
      const uploadPromises = photos.map(async (photo) => {
        await saveServicePhoto(SERVICE_ID, photo.file);
        return photo.id;
      });

      const uploadedIds = await Promise.all(uploadPromises);
      
      setUploadSuccess(new Set(uploadedIds));
      
      // Скрываем анимации успеха через 3 секунды
      setTimeout(() => {
        setUploadSuccess(new Set());
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке фото');
      console.error('[ServicePhotoUpload] Error saving photos:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const canAddMore = photos.length < MAX_PHOTOS;

  return (
    <div className="space-y-4">
      {/* Счетчик фото */}
      {photos.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-700">
            Загружено: {photos.length} / {MAX_PHOTOS} фото
          </p>
          <button
            type="button"
            onClick={handleClearAll}
            disabled={isUploading}
            className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Очистить
          </button>
        </div>
      )}

      {/* Сетка с загруженными фото */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo) => {
            const isPrimary = photo.isPrimary;
            const isSuccess = uploadSuccess.has(photo.id);
            
            return (
              <div key={photo.id} className="relative group">
                {/* Превью фото */}
                <div className="relative rounded-xl overflow-hidden border-2 aspect-square">
                  {photo.previewUrl ? (
                    <img
                      src={photo.previewUrl}
                      alt="Превью"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  )}

                  {/* Overlay при наведении */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex flex-col gap-2">
                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(photo.id)}
                          className="px-3 py-1.5 bg-white text-black rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
                          disabled={isUploading}
                        >
                          Сделать обложкой
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(photo.id)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
                        disabled={isUploading}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>

                  {/* Бейдж обложки */}
                  {isPrimary && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 z-10">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Обложка
                    </div>
                  )}

                  {/* Индикатор для выбора обложки (для не-обложек) */}
                  {!isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(photo.id)}
                      className="absolute top-2 left-2 w-6 h-6 bg-gray-400 bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all duration-200 cursor-pointer z-10 border border-gray-300 border-opacity-50"
                      disabled={isUploading}
                      title="Нажмите, чтобы сделать обложкой"
                    >
                    </button>
                  )}

                  {/* Анимация успешной загрузки */}
                  {isSuccess && (
                    <div
                      className="absolute inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center"
                      style={{
                        animation: 'fadeIn 0.3s ease-in-out',
                      }}
                    >
                      <svg
                        className="w-12 h-12 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{
                          animation: 'scaleIn 0.4s ease-out',
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Кнопка удаления (всегда видимая) */}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(photo.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 bg-opacity-50 hover:bg-opacity-80 rounded-full transition-all duration-200 z-10"
                    disabled={isUploading}
                    title="Удалить фото"
                  >
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Информация о файле */}
                <div className="mt-1 px-1 space-y-1">
                  <p className="text-xs text-gray-600 truncate" title={photo.file.name}>
                    {photo.file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(photo.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Область загрузки */}
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative p-8 bg-gray-50 rounded-2xl border-2 border-dashed cursor-pointer
            transition-all duration-200 hover:bg-gray-100
            ${isDragging ? 'border-green-400 bg-green-50' : 'border-gray-300'}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <svg
                className={`w-12 h-12 transition-colors duration-200 ${
                  isDragging ? 'text-green-500' : 'text-gray-400'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-gray-600 font-medium mb-1">
              {isDragging ? 'Отпустите для загрузки' : 'Нажмите или перетащите фото'}
            </p>
            <p className="text-sm text-gray-400">
              Можно загрузить до {MAX_PHOTOS - photos.length} фото. Форматы: JPG, PNG, WEBP
            </p>
          </div>
        </div>
      )}

      {/* Сообщение о лимите */}
      {!canAddMore && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            Достигнут лимит в {MAX_PHOTOS} фото. Удалите фото, чтобы добавить новые.
          </p>
        </div>
      )}

      {/* Кнопка сохранения всех фото */}
      {photos.length > 0 && (
        <button
          type="button"
          onClick={handleSave}
          disabled={isUploading || uploadSuccess.size > 0}
          className="mt-4 w-full py-3 px-4 rounded-full font-medium text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: '#95E59D',
            color: '#000000',
          }}
        >
          {isUploading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Сохранение {photos.length} фото...
            </span>
          ) : uploadSuccess.size > 0 ? (
            `Сохранено ${uploadSuccess.size} из ${photos.length} фото!`
          ) : (
            `Сохранить ${photos.length} фото`
          )}
        </button>
      )}

      {/* Сообщение об ошибке */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};


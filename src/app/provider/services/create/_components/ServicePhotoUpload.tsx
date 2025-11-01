'use client';

import React, { useState, useRef } from 'react';
import { PhotoItem } from '@/lib/service/hooks/useServicePhotos';

const MAX_PHOTOS = 10;

interface ServicePhotoUploadProps {
  photos: PhotoItem[];
  onAddPhotos: (files: FileList | null) => void;
  onRemovePhoto: (id: string) => void;
  onSetPrimary: (id: string) => void;
  onClearPhotos: () => void;
  error?: string | null;
}

export const ServicePhotoUpload: React.FC<ServicePhotoUploadProps> = ({
  photos,
  onAddPhotos,
  onRemovePhoto,
  onSetPrimary,
  onClearPhotos,
  error: externalError
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAddPhotos(e.target.files);
    // Сбрасываем значение input для возможности повторной загрузки того же файла
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    onAddPhotos(e.dataTransfer.files);
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
    onRemovePhoto(id);
  };

  const handleSetPrimary = (id: string) => {
    onSetPrimary(id);
  };

  const handleClearAll = () => {
    onClearPhotos();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
            className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
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
                        >
                          Сделать обложкой
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(photo.id)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
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
                      title="Нажмите, чтобы сделать обложкой"
                    >
                    </button>
                  )}

                  {/* Кнопка удаления (всегда видимая) */}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(photo.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 bg-opacity-50 hover:bg-opacity-80 rounded-full transition-all duration-200 z-10"
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

      {/* Сообщение об ошибке */}
      {externalError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{externalError}</p>
        </div>
      )}
    </div>
  );
};


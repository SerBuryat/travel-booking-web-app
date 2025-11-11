'use client';

import { useState, useEffect, useCallback } from 'react';

export interface PhotoItem {
  id: string;
  file: File | null;  // null для существующих фото из БД
  previewUrl: string;
  isPrimary: boolean;
  isExisting?: boolean;  // флаг для различия существующих и новых фото
  dbId?: number;  // ID фото в БД (для существующих)
}

const MAX_PHOTOS = 10;
const MAX_FILE_SIZE_MB = 10; // Максимальный размер файла в MB

interface UseServicePhotosOptions {
  initialPhotos?: PhotoItem[];
  maxPhotos?: number;
}

interface UseServicePhotosReturn {
  photos: PhotoItem[];
  primaryPhotoId: string | null;
  error: string | null;
  setPhotos: (photos: PhotoItem[]) => void;
  addPhotos: (files: FileList | null) => void;
  removePhoto: (id: string) => void;
  setPrimaryPhoto: (id: string) => void;
  clearPhotos: () => void;
  getPrimaryPhoto: () => PhotoItem | null;
  validatePhotos: () => { isValid: boolean; errors: string[] };
  getPhotosForSubmit: () => { existing: Array<{ id: number; fileName: string; isPrimary: boolean }>; new: Array<{ file: File; isPrimary: boolean }> };
}

/**
 * Custom hook для управления фото сервиса.
 * 
 * @param {UseServicePhotosOptions} options - Опции хука
 * @param {PhotoItem[]} [options.initialPhotos] - Начальные фото (для редактирования)
 * @param {number} [options.maxPhotos=10] - Максимальное количество фото
 * @returns {UseServicePhotosReturn} Объект с состоянием и методами управления
 */
export const useServicePhotos = (options: UseServicePhotosOptions = {}): UseServicePhotosReturn => {
  const { initialPhotos = [], maxPhotos = MAX_PHOTOS } = options;

  const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos);
  const [primaryPhotoId, setPrimaryPhotoId] = useState<string | null>(
    initialPhotos.find(p => p.isPrimary)?.id || null
  );
  const [error, setError] = useState<string | null>(null);

  // Инициализация при изменении initialPhotos
  useEffect(() => {
    if (initialPhotos.length > 0 && photos.length === 0) {
      setPhotos(initialPhotos);
      const primary = initialPhotos.find(p => p.isPrimary);
      setPrimaryPhotoId(primary?.id || null);
    }
  }, [initialPhotos]);

  /**
   * Валидация типа файла (изображение)
   */
  const validateFileType = useCallback((file: File): boolean => {
    return file.type.startsWith('image/');
  }, []);

  /**
   * Валидация размера файла
   */
  const validateFileSize = useCallback((file: File): boolean => {
    const fileSizeMB = file.size / 1024 / 1024;
    return fileSizeMB <= MAX_FILE_SIZE_MB;
  }, []);

  /**
   * Валидация имени файла на дубликаты
   */
  const validateFileNameDuplicate = useCallback((fileName: string, existingPhotos: PhotoItem[]): boolean => {
    return !existingPhotos.some(photo => photo.file?.name === fileName);
  }, []);

  /**
   * Извлечение имени файла из URL (для существующих фото)
   */
  const extractFileNameFromUrl = useCallback((url: string): string => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }, []);

  /**
   * Валидация всех загруженных фото
   * Возвращает результат валидации с массивом ошибок
   */
  const validatePhotos = useCallback((): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (photos.length === 0) {
      errors.push('Необходимо загрузить хотя бы одно фото');
    }

    if (!primaryPhotoId) {
      errors.push('Необходимо выбрать обложку');
    }

    // Валидация новых фото (не существующих)
    photos.filter(p => !p.isExisting && p.file).forEach((photo) => {
      if (photo.file && !validateFileSize(photo.file)) {
        errors.push(`Фото "${photo.file.name}" превышает максимальный размер ${MAX_FILE_SIZE_MB}MB`);
      }
      if (photo.file && !validateFileType(photo.file)) {
        errors.push(`Файл "${photo.file.name}" не является изображением`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [photos, primaryPhotoId, validateFileSize, validateFileType]);

  /**
   * Добавление новых фото
   */
  const addPhotos = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) {
      setError('Не выбраны файлы для загрузки');
      return;
    }

    const remainingSlots = maxPhotos - photos.length;

    if (remainingSlots <= 0) {
      setError(`Максимальное количество фото: ${maxPhotos}`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    const isFirstUpload = photos.length === 0;
    let firstValidPhotoId: string | null = null;
    const newPhotos: PhotoItem[] = [];
    const processedFileNames = new Set<string>();

    for (const file of filesToProcess) {
      // Валидация типа файла
      if (!validateFileType(file)) {
        setError(`Файл "${file.name}" не является изображением`);
        continue;
      }

      // Валидация размера файла
      if (!validateFileSize(file)) {
        setError(`Файл "${file.name}" превышает максимальный размер ${MAX_FILE_SIZE_MB}MB`);
        continue;
      }

      // Валидация дубликатов: проверка с уже существующими фото
      if (!validateFileNameDuplicate(file.name, photos)) {
        setError(`Фото с именем "${file.name}" уже существует`);
        continue;
      }

      // Валидация дубликатов: проверка внутри добавляемых файлов
      if (processedFileNames.has(file.name)) {
        setError(`Фото с именем "${file.name}" уже выбрано для загрузки`);
        continue;
      }

      processedFileNames.add(file.name);

      const id = `${Date.now()}-${Math.random()}`;

      // Если это первое фото и еще нет обложки, запоминаем его ID
      if (isFirstUpload && firstValidPhotoId === null) {
        firstValidPhotoId = id;
      }

      // Определяем, будет ли это фото обложкой
      const willBePrimary = isFirstUpload && firstValidPhotoId === id;

      // Создаем превью через FileReader
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
  }, [photos, maxPhotos, primaryPhotoId, validateFileType, validateFileSize, validateFileNameDuplicate]);

  /**
   * Удаление фото
   */
  const removePhoto = useCallback((id: string) => {
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

    setError(null);
  }, [photos, primaryPhotoId]);

  /**
   * Установка обложки
   */
  const setPrimaryPhoto = useCallback((id: string) => {
    if (!photos.find(p => p.id === id)) {
      setError('Фото с указанным ID не найдено');
      return;
    }

    setPrimaryPhotoId(id);
    setPhotos(prev => prev.map(p => ({ ...p, isPrimary: p.id === id })));
    setError(null);
  }, [photos]);

  /**
   * Очистка всех фото
   */
  const clearPhotos = useCallback(() => {
    setPhotos([]);
    setPrimaryPhotoId(null);
    setError(null);
  }, []);

  /**
   * Получение обложки
   */
  const getPrimaryPhoto = useCallback((): PhotoItem | null => {
    if (!primaryPhotoId) return null;
    return photos.find(p => p.id === primaryPhotoId) || null;
  }, [photos, primaryPhotoId]);

  /**
   * Получение данных для отправки (разделение на существующие и новые фото)
   * Используется при редактировании сервиса
   */
  const getPhotosForSubmit = useCallback(() => {
    const existing = photos
      .filter(p => p.isExisting && p.dbId)
      .map(p => ({
        id: p.dbId!,
        fileName: extractFileNameFromUrl(p.previewUrl),
        isPrimary: p.isPrimary
      }));

    const newPhotos = photos
      .filter(p => !p.isExisting && p.file)
      .map(p => ({
        file: p.file!,
        isPrimary: p.isPrimary
      }));

    return { existing, new: newPhotos };
  }, [photos, extractFileNameFromUrl]);

  return {
    photos,
    primaryPhotoId,
    error,
    setPhotos,
    addPhotos,
    removePhoto,
    setPrimaryPhoto,
    clearPhotos,
    getPrimaryPhoto,
    validatePhotos,
    getPhotosForSubmit
  };
};


"use server";

import { putObject, deleteObject } from "@/lib/s3storage/s3-storage";
import { PutObjectCommandOutput, DeleteObjectCommandOutput } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import {log} from '@/lib/utils/logger';

/**
 * Результат загрузки фото в S3
 */
export interface S3UploadResult {
  result: PutObjectCommandOutput;
  fileName: string; // UUID.extension
}

/**
 * Сохранение фото сервиса в S3 хранилище.
 * 
 * @param {number} serviceId Идентификатор сервиса
 * @param {File} file Файл для загрузки
 * @returns {Promise<S3UploadResult>} Результат операции загрузки с именем файла
 */
export async function loadServicePhotoToS3Storage(
  serviceId: number,
  file: File
): Promise<S3UploadResult> {
  const fileName = file.name;
  const fileSize = file.size;
  const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);
  const fileType = file.type;

  if (!serviceId) {
    log(
      'loadServicePhotoToS3Storage',
      'Ошибка валидации: serviceId не указан',
      'error',
      { fileName, fileSizeMB, fileType }
    );
    throw new Error("[loadServicePhotoToS3Storage]: 'serviceId' is required!");
  }

  if (!file) {
    log(
      'loadServicePhotoToS3Storage',
      'Ошибка валидации: file не указан',
      'error',
      { serviceId }
    );
    throw new Error("[loadServicePhotoToS3Storage]: 'file' is required!");
  }

  const bucketName = process.env.OBJECT_STORAGE_BUCKET_NAME;
  if (!bucketName) {
    log(
      'loadServicePhotoToS3Storage',
      'Ошибка конфигурации: OBJECT_STORAGE_BUCKET_NAME не установлен',
      'error',
      { serviceId, fileName, fileSizeMB }
    );
    throw new Error("[loadServicePhotoToS3Storage]: 'OBJECT_STORAGE_BUCKET_NAME' environment variable is not set!");
  }

  // Генерируем UUID для имени файла
  const uuid = randomUUID();
  
  // Получаем только расширение из оригинального файла
  const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

  // Имя файла с UUID
  const fileNameWithUuid = `${uuid}.${fileExtension}`;
  
  // Формируем полный путь для S3: services/<serviceId>/<uuid>.<extension>
  const fullPath = `services/${serviceId}/${fileNameWithUuid}`;

  log(
    'loadServicePhotoToS3Storage',
    'Начало загрузки фото в S3',
    'info',
    {
      serviceId,
      originalFileName: fileName,
      s3FileName: fileNameWithUuid,
      s3Path: fullPath,
      fileSizeMB,
      fileType,
      fileExtension
    }
  );

  // Конвертируем File в Buffer
  let buffer: Buffer;
  try {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } catch (error) {
    log(
      'loadServicePhotoToS3Storage',
      'Ошибка конвертации File в Buffer',
      'error',
      {
        serviceId,
        fileName,
        fileSizeMB,
        fileType
      },
      error
    );
    throw error;
  }

  // Получаем content type из файла, если доступен
  const contentType = file.type || undefined;

  // Загружаем в S3
  try {
    const result = await putObject({
      bucketName,
      fileName: fullPath,
      content: buffer,
      contentType,
    });

    log(
      'loadServicePhotoToS3Storage',
      'Фото успешно загружено в S3',
      'info',
      {
        serviceId,
        originalFileName: fileName,
        s3FileName: fileNameWithUuid,
        s3Path: fullPath,
        fileSizeMB,
        httpStatusCode: result.$metadata.httpStatusCode,
        eTag: result.ETag
      }
    );

    return {
      result,
      fileName: fileNameWithUuid
    };
  } catch (error) {
    // Определяем тип ошибки S3
    const s3ErrorCode = error && typeof error === 'object' && 'Code' in error 
      ? (error as any).Code 
      : error instanceof Error 
        ? error.constructor.name 
        : 'Unknown';

    log(
      'loadServicePhotoToS3Storage',
      'Ошибка загрузки фото в S3',
      'error',
      {
        serviceId,
        originalFileName: fileName,
        s3FileName: fileNameWithUuid,
        s3Path: fullPath,
        fileSizeMB,
        fileType,
        bucketName,
        s3ErrorCode
      },
      error
    );
    throw error;
  }
}

/**
 * Удаление фото сервиса из S3 хранилища.
 * 
 * @param {string} photoUrl Полный URL фото (например, https://bucket.endpoint/services/123/uuid.jpg)
 * @returns {Promise<DeleteObjectCommandOutput>} Результат операции удаления
 */
export async function deleteServicePhotoFromS3Storage(
  photoUrl: string
): Promise<DeleteObjectCommandOutput> {
  if (!photoUrl) {
    log(
      'deleteServicePhotoFromS3Storage',
      'Ошибка валидации: photoUrl не указан',
      'error'
    );
    throw new Error("[deleteServicePhotoFromS3Storage]: 'photoUrl' is required!");
  }

  const bucketName = process.env.OBJECT_STORAGE_BUCKET_NAME;
  if (!bucketName) {
    log(
      'deleteServicePhotoFromS3Storage',
      'Ошибка конфигурации: OBJECT_STORAGE_BUCKET_NAME не установлен',
      'error',
      { photoUrl }
    );
    throw new Error("[deleteServicePhotoFromS3Storage]: 'OBJECT_STORAGE_BUCKET_NAME' environment variable is not set!");
  }

  // Извлекаем путь к файлу из URL
  // Например: https://bucket.endpoint/services/123/uuid.jpg -> services/123/uuid.jpg
  const urlParts = photoUrl.split('/');
  const servicesIndex = urlParts.indexOf('services');
  
  if (servicesIndex === -1) {
    log(
      'deleteServicePhotoFromS3Storage',
      'Ошибка парсинга URL: неверный формат',
      'error',
      { photoUrl }
    );
    throw new Error("[deleteServicePhotoFromS3Storage]: Invalid photo URL format!");
  }

  // Формируем путь файла: services/<serviceId>/<fileName>
  const fileName = urlParts.slice(servicesIndex).join('/');

  log(
    'deleteServicePhotoFromS3Storage',
    'Удаление фото из S3',
    'info',
    { photoUrl, s3Path: fileName, bucketName }
  );

  try {
    const result = await deleteObject(bucketName, fileName);
    log(
      'deleteServicePhotoFromS3Storage',
      'Фото успешно удалено из S3',
      'info',
      { photoUrl, s3Path: fileName, httpStatusCode: result.$metadata.httpStatusCode }
    );
    return result;
  } catch (error) {
    const s3ErrorCode = error && typeof error === 'object' && 'Code' in error 
      ? (error as any).Code 
      : error instanceof Error 
        ? error.constructor.name 
        : 'Unknown';

    log(
      'deleteServicePhotoFromS3Storage',
      'Ошибка удаления фото из S3',
      'error',
      { photoUrl, s3Path: fileName, bucketName, s3ErrorCode },
      error
    );
    throw error;
  }
}


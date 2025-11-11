"use server";

import { putObject, deleteObject } from "@/lib/s3storage/s3-storage";
import { PutObjectCommandOutput, DeleteObjectCommandOutput } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

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
  if (!serviceId) {
    throw new Error("[saveServicePhoto]: 'serviceId' is required!");
  }

  if (!file) {
    throw new Error("[saveServicePhoto]: 'file' is required!");
  }

  const bucketName = process.env.OBJECT_STORAGE_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("[saveServicePhoto]: 'OBJECT_STORAGE_BUCKET_NAME' environment variable is not set!");
  }

  // Генерируем UUID для имени файла
  const uuid = randomUUID();
  
  // Получаем только расширение из оригинального файла
  const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

  // Имя файла с UUID
  const fileNameWithUuid = `${uuid}.${fileExtension}`;
  
  // Формируем полный путь для S3: services/<serviceId>/<uuid>.<extension>
  const fullPath = `services/${serviceId}/${fileNameWithUuid}`;

  // Конвертируем File в Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Получаем content type из файла, если доступен
  const contentType = file.type || undefined;

  // Загружаем в S3
  const result = await putObject({
    bucketName,
    fileName: fullPath,
    content: buffer,
    contentType,
  });

  return {
    result,
    fileName: fileNameWithUuid
  };
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
    throw new Error("[deleteServicePhoto]: 'photoUrl' is required!");
  }

  const bucketName = process.env.OBJECT_STORAGE_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("[deleteServicePhoto]: 'OBJECT_STORAGE_BUCKET_NAME' environment variable is not set!");
  }

  // Извлекаем путь к файлу из URL
  // Например: https://bucket.endpoint/services/123/uuid.jpg -> services/123/uuid.jpg
  const urlParts = photoUrl.split('/');
  const servicesIndex = urlParts.indexOf('services');
  
  if (servicesIndex === -1) {
    throw new Error("[deleteServicePhoto]: Invalid photo URL format!");
  }

  // Формируем путь файла: services/<serviceId>/<fileName>
  const fileName = urlParts.slice(servicesIndex).join('/');

  // Удаляем из S3
  return await deleteObject(bucketName, fileName);
}


"use server";

import { putObject } from "@/lib/s3storage/s3-storage";
import { PutObjectCommandOutput } from "@aws-sdk/client-s3";

/**
 * Сохранение фото сервиса в S3 хранилище.
 * 
 * @param {number} serviceId Идентификатор сервиса
 * @param {File} file Файл для загрузки
 * @returns {Promise<PutObjectCommandOutput>} Результат операции загрузки
 */
export async function saveServicePhoto(
  serviceId: number,
  file: File
): Promise<PutObjectCommandOutput> {
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

  // Получаем имя файла и расширение
  const originalFileName = file.name;
  const fileNameWithoutExtension = originalFileName.replace(/\.[^/.]+$/, "");
  const fileExtension = originalFileName.split(".").pop() || "";

  // Формируем путь для S3: services/<serviceId>/<fileName>.<extension>
  const fileName = `services/${serviceId}/${fileNameWithoutExtension}.${fileExtension}`;

  // Конвертируем File в Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Получаем content type из файла, если доступен
  const contentType = file.type || undefined;

  // Загружаем в S3
  return await putObject({
    bucketName,
    fileName,
    content: buffer,
    contentType,
  });
}


Release 1.0

Версия с полным соответствием [дизайну](https://www.figma.com/design/GoX9RvpU6aiEkJUziDcWgJ/%D0%9E%D0%BB%D1%8C%D1%85%D0%BE%D0%BD?node-id=1-2&p=f&t=lbcd8kmMIKFGCoUm-0) 

Планируемая дата наката: **до 15.11.2025**

Необходимые доработки:
- для nginx проставить `client_max_body_size = 10M` (т.к. по `default` ограничение на `1MB` и появлялась ошибка `413 (Request Entity Too Large)`)
- для cloud.ru создать `Object Storage`, проставить `.env` переменные:`OBJECT_STORAGE_REGION`, 
  `OBJECT_STORAGE_ENDPOINT` , `OBJECT_STORAGE_BUCKET_NAME`, `OBJECT_STORAGE_BUCKET_ENDPOINT`, `OBJECT_STORAGE_TENANT_ID`
- *ВОЗМОЖНО* будут проблемы с созданным в ручную хранилищем (проблемы с доступом извне), создать через `[run-s3-test.ts](..%2Fsrc%2Flib%2Fs3storage%2Frun-s3-test.ts)`
- логирование и мониторинг, два варика: `online` [PostHog](https://eu.posthog.com/project/98401) или `on-promise` 
  [LogBull](https://github.com/logbull/logbull)
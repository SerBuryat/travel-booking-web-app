-- SQL запрос для обновления view_count в tservices на основе количества кликов из tservices_clicks
-- 
-- Вариант 1: Обновляет все сервисы (для сервисов без кликов устанавливает 0)
-- Рекомендуемый вариант для полной синхронизации данных

UPDATE tservices
SET view_count = COALESCE((
    SELECT COUNT(*)
    FROM tservices_clicks
    WHERE tservices_clicks.tservices_id = tservices.id
), 0);

-- Вариант 2: Обновляет только те сервисы, у которых есть клики
-- Используйте этот вариант, если нужно сохранить текущие значения view_count для сервисов без кликов

-- UPDATE tservices
-- SET view_count = (
--     SELECT COUNT(*)
--     FROM tservices_clicks
--     WHERE tservices_clicks.tservices_id = tservices.id
-- )
-- WHERE EXISTS (
--     SELECT 1
--     FROM tservices_clicks
--     WHERE tservices_clicks.tservices_id = tservices.id
-- );

-- Вариант 3: Использование JOIN (более эффективен для больших таблиц)
-- Обновляет все сервисы, включая те, у которых нет кликов (устанавливает 0)

-- UPDATE tservices s
-- SET view_count = COALESCE(click_counts.count, 0)
-- FROM (
--     SELECT tservices_id, COUNT(*) as count
--     FROM tservices_clicks
--     GROUP BY tservices_id
-- ) AS click_counts
-- WHERE s.id = click_counts.tservices_id
--    OR NOT EXISTS (
--        SELECT 1
--        FROM tservices_clicks
--        WHERE tservices_clicks.tservices_id = s.id
--    );

-- Примечание: Вариант 3 требует дополнительной логики для установки 0 для сервисов без кликов.
-- Более простой вариант с LEFT JOIN:

-- UPDATE tservices s
-- SET view_count = COALESCE(click_counts.count, 0)
-- FROM (
--     SELECT tservices_id, COUNT(*) as count
--     FROM tservices_clicks
--     GROUP BY tservices_id
-- ) AS click_counts
-- RIGHT JOIN tservices ON tservices.id = click_counts.tservices_id
-- WHERE s.id = tservices.id;


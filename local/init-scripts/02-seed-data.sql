-- Тестовые данные для разработки
-- Этот скрипт добавляет базовые данные для тестирования приложения

-- Вставка тестовых областей
INSERT INTO tarea (name, sysname, parent_id, tier, path) VALUES
('Россия', 'russia', NULL, 1, 'russia'),
('Москва', 'moscow', 1, 2, 'russia.moscow'),
('Санкт-Петербург', 'spb', 1, 2, 'russia.spb'),
('Краснодарский край', 'krasnodar', 1, 2, 'russia.krasnodar'),
('Сочи', 'sochi', 4, 3, 'russia.krasnodar.sochi'),
('Анапа', 'anapa', 4, 3, 'russia.krasnodar.anapa'),
('Крым', 'crimea', 1, 2, 'russia.crimea'),
('Ялта', 'yalta', 7, 3, 'russia.crimea.yalta'),
('Севастополь', 'sevastopol', 7, 3, 'russia.crimea.sevastopol')
ON CONFLICT (sysname) DO NOTHING;

-- Вставка тестовых категорий
INSERT INTO tcategories (code, sysname, name, parent_id, path) VALUES
('accommodation', 'accommodation', 'Размещение', NULL, 'accommodation'),
('hotels', 'hotels', 'Отели', 1, 'accommodation.hotels'),
('apartments', 'apartments', 'Апартаменты', 1, 'accommodation.apartments'),
('hostels', 'hostels', 'Хостелы', 1, 'accommodation.hostels'),
('transport', 'transport', 'Транспорт', NULL, 'transport'),
('flights', 'flights', 'Авиабилеты', 5, 'transport.flights'),
('trains', 'trains', 'Железнодорожные билеты', 5, 'transport.trains'),
('buses', 'buses', 'Автобусы', 5, 'transport.buses'),
('activities', 'activities', 'Активности', NULL, 'activities'),
('excursions', 'excursions', 'Экскурсии', 9, 'activities.excursions'),
('entertainment', 'entertainment', 'Развлечения', 9, 'activities.entertainment'),
('sports', 'sports', 'Спорт', 9, 'activities.sports')
ON CONFLICT (sysname) DO NOTHING;

-- Вставка опций для категорий
INSERT INTO tcategories_options (category_id, name, description) VALUES
(2, 'WiFi', 'Бесплатный WiFi'),
(2, 'Парковка', 'Парковочные места'),
(2, 'Завтрак', 'Завтрак включен'),
(2, 'Кондиционер', 'Кондиционирование'),
(2, 'Балкон', 'Балкон или терраса'),
(3, 'Кухня', 'Кухонное оборудование'),
(3, 'Стиральная машина', 'Стиральная машина'),
(3, 'WiFi', 'Бесплатный WiFi'),
(4, 'Общая кухня', 'Общая кухня'),
(4, 'Общая ванная', 'Общая ванная комната'),
(4, 'Шкафчик', 'Индивидуальный шкафчик')
ON CONFLICT DO NOTHING;

-- Вставка тестовых клиентов
INSERT INTO tclients (name, email, tarea_id, created_at) VALUES
('Иван Петров', 'ivan.petrov@example.com', 2, NOW()),
('Мария Сидорова', 'maria.sidorova@example.com', 3, NOW()),
('Алексей Козлов', 'alexey.kozlov@example.com', 5, NOW()),
('Елена Волкова', 'elena.volkova@example.com', 8, NOW()),
('Дмитрий Соколов', 'dmitry.sokolov@example.com', 2, NOW())
ON CONFLICT (email) DO NOTHING;

-- Вставка аутентификации клиентов
INSERT INTO tclients_auth (tclients_id, auth_type, auth_id, role, is_active) VALUES
(1, 'telegram', '123456789', 'user', TRUE),
(2, 'telegram', '987654321', 'user', TRUE),
(3, 'email', 'alexey.kozlov@example.com', 'user', TRUE),
(4, 'telegram', '555666777', 'user', TRUE),
(5, 'telegram', '111222333', 'user', TRUE)
ON CONFLICT (auth_type, auth_id) DO NOTHING;

-- Вставка тестовых провайдеров
INSERT INTO tproviders (tclients_id, company_name, phone, contact_info, status, created_at) VALUES
(1, 'Отель "Москва"', '+7-495-123-45-67', '{"website": "hotel-moscow.ru", "email": "info@hotel-moscow.ru"}', 'active', NOW()),
(2, 'Апартаменты "Нева"', '+7-812-234-56-78', '{"website": "apartments-neva.ru", "email": "booking@apartments-neva.ru"}', 'active', NOW()),
(3, 'Хостел "Сочи"', '+7-862-345-67-89', '{"website": "hostel-sochi.ru", "email": "info@hostel-sochi.ru"}', 'active', NOW()),
(4, 'Отель "Ялта"', '+7-365-456-78-90', '{"website": "hotel-yalta.ru", "email": "reservations@hotel-yalta.ru"}', 'active', NOW()),
(5, 'Транспортная компания "Тур"', '+7-495-567-89-01', '{"website": "transport-tour.ru", "email": "info@transport-tour.ru"}', 'active', NOW())
ON CONFLICT DO NOTHING;

-- Вставка тестовых сервисов
INSERT INTO tservices (name, description, tcategories_id, price, provider_id, active, status, priority, rating, rating_count, view_count, service_options) VALUES
('Отель в центре Москвы', 'Комфортабельный отель в самом центре столицы', 2, 5000.00, 1, TRUE, 'published', 10, 4.5, 25, 150, '["WiFi", "Парковка", "Завтрак", "Кондиционер"]'),
('Апартаменты у Невы', 'Современные апартаменты с видом на Неву', 3, 3500.00, 2, TRUE, 'published', 8, 4.2, 18, 120, '["Кухня", "Стиральная машина", "WiFi"]'),
('Хостел у моря', 'Бюджетное размещение в 5 минутах от моря', 4, 800.00, 3, TRUE, 'published', 5, 3.8, 12, 80, '["Общая кухня", "Общая ванная", "Шкафчик"]'),
('Отель в Ялте', 'Роскошный отель с видом на море', 2, 6000.00, 4, TRUE, 'published', 12, 4.7, 30, 200, '["WiFi", "Парковка", "Завтрак", "Кондиционер", "Балкон"]'),
('Авиабилеты Москва-Сочи', 'Прямые рейсы в Сочи', 6, 15000.00, 5, TRUE, 'published', 15, 4.3, 45, 300, '["Багаж включен", "Питание", "WiFi"]')
ON CONFLICT DO NOTHING;

-- Вставка контактов сервисов
INSERT INTO tcontacts (tservices_id, email, phone, tg_username, website, whatsap) VALUES
(1, 'booking@hotel-moscow.ru', '+7-495-123-45-67', '@hotel_moscow', 'hotel-moscow.ru', '+7-495-123-45-67'),
(2, 'booking@apartments-neva.ru', '+7-812-234-56-78', '@apartments_neva', 'apartments-neva.ru', '+7-812-234-56-78'),
(3, 'info@hostel-sochi.ru', '+7-862-345-67-89', '@hostel_sochi', 'hostel-sochi.ru', '+7-862-345-67-89'),
(4, 'reservations@hotel-yalta.ru', '+7-365-456-78-90', '@hotel_yalta', 'hotel-yalta.ru', '+7-365-456-78-90'),
(5, 'info@transport-tour.ru', '+7-495-567-89-01', '@transport_tour', 'transport-tour.ru', '+7-495-567-89-01')
ON CONFLICT DO NOTHING;

-- Вставка локаций сервисов
INSERT INTO tlocations (tservices_id, name, address, latitude, longitude, tarea_id, description) VALUES
(1, 'Отель "Москва"', 'Красная площадь, 1', 55.7539, 37.6208, 2, 'В самом сердце Москвы'),
(2, 'Апартаменты "Нева"', 'Невский проспект, 100', 59.9311, 30.3609, 3, 'С видом на Неву'),
(3, 'Хостел "Сочи"', 'Приморская набережная, 50', 43.5855, 39.7231, 5, 'В 5 минутах от моря'),
(4, 'Отель "Ялта"', 'Набережная им. Ленина, 25', 44.4900, 34.1600, 8, 'Роскошный отель с видом на море'),
(5, 'Аэропорт Внуково', 'Московская область, Внуково', 55.5961, 37.2845, 2, 'Отправление из Москвы')
ON CONFLICT DO NOTHING;

-- Вставка фотографий сервисов
INSERT INTO tphotos (tservices_id, url, is_primary) VALUES
(1, 'https://example.com/hotel-moscow-1.jpg', TRUE),
(1, 'https://example.com/hotel-moscow-2.jpg', FALSE),
(1, 'https://example.com/hotel-moscow-3.jpg', FALSE),
(2, 'https://example.com/apartments-neva-1.jpg', TRUE),
(2, 'https://example.com/apartments-neva-2.jpg', FALSE),
(3, 'https://example.com/hostel-sochi-1.jpg', TRUE),
(4, 'https://example.com/hotel-yalta-1.jpg', TRUE),
(4, 'https://example.com/hotel-yalta-2.jpg', FALSE),
(5, 'https://example.com/flight-moscow-sochi.jpg', TRUE)
ON CONFLICT DO NOTHING;

-- Вставка тестовых заявок
INSERT INTO tbids (tclients_id, tarea_id, type, start_date, nights_from, nights_to, budget, status, comment, created_at) VALUES
(1, 2, 'hotel', '2024-06-01', 3, 5, 15000.00, 'active', 'Ищу отель в центре Москвы на 3-5 ночей', NOW()),
(2, 3, 'apartment', '2024-07-15', 7, 14, 25000.00, 'active', 'Апартаменты в СПб на 1-2 недели', NOW()),
(3, 5, 'hostel', '2024-08-01', 10, 21, 8000.00, 'active', 'Хостел в Сочи на 10-21 день', NOW()),
(4, 8, 'hotel', '2024-09-01', 5, 10, 30000.00, 'active', 'Отель в Ялте на 5-10 дней', NOW())
ON CONFLICT DO NOTHING;

-- Вставка тестовых предложений
INSERT INTO tproposals (tbids_id, tservices_id, tproviders_id, comment, status, created_at) VALUES
(1, 1, 1, 'Предлагаем номер с видом на Красную площадь', 'pending', NOW()),
(2, 2, 2, 'Апартаменты с панорамным видом на Неву', 'pending', NOW()),
(3, 3, 3, 'Хостел в 5 минутах от моря, отличное соотношение цена/качество', 'pending', NOW()),
(4, 4, 4, 'Роскошный отель с собственным пляжем', 'pending', NOW())
ON CONFLICT DO NOTHING;

-- Вставка тестовых отзывов
INSERT INTO treviews (tservices_id, tclients_id, rating, comment, created_at) VALUES
(1, 1, 4.5, 'Отличный отель, прекрасное расположение!', NOW() - INTERVAL '10 days'),
(1, 2, 4.0, 'Хороший сервис, но дорого', NOW() - INTERVAL '5 days'),
(2, 3, 4.2, 'Уютные апартаменты, все необходимое есть', NOW() - INTERVAL '7 days'),
(3, 4, 3.8, 'Нормальный хостел за свои деньги', NOW() - INTERVAL '3 days'),
(4, 5, 4.7, 'Превосходный отель, рекомендую!', NOW() - INTERVAL '1 day')
ON CONFLICT (tservices_id, tclients_id) DO NOTHING;

-- Вставка тестовых кликов
INSERT INTO tservices_clicks (tclients_id, tservices_id, timestamp) VALUES
(1, 1, NOW() - INTERVAL '2 hours'),
(2, 2, NOW() - INTERVAL '1 hour'),
(3, 3, NOW() - INTERVAL '30 minutes'),
(4, 4, NOW() - INTERVAL '15 minutes'),
(5, 5, NOW() - INTERVAL '5 minutes')
ON CONFLICT (tclients_id, tservices_id) DO NOTHING;

-- Вставка тестовых уведомлений
INSERT INTO tnotifications (user_id, user_role, message, is_read, created_at) VALUES
(1, 'user', 'Новое предложение по вашей заявке!', FALSE, NOW()),
(2, 'user', 'Ваша заявка рассмотрена', FALSE, NOW()),
(3, 'user', 'Доступны новые сервисы в вашем регионе', FALSE, NOW()),
(4, 'user', 'Скидка 20% на все услуги до конца месяца!', FALSE, NOW()),
(5, 'user', 'Добро пожаловать в нашу систему!', TRUE, NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Логирование успешного добавления тестовых данных
DO $$
BEGIN
    RAISE NOTICE 'Тестовые данные успешно добавлены!';
    RAISE NOTICE 'Областей: %', (SELECT COUNT(*) FROM tarea);
    RAISE NOTICE 'Категорий: %', (SELECT COUNT(*) FROM tcategories);
    RAISE NOTICE 'Клиентов: %', (SELECT COUNT(*) FROM tclients);
    RAISE NOTICE 'Провайдеров: %', (SELECT COUNT(*) FROM tproviders);
    RAISE NOTICE 'Сервисов: %', (SELECT COUNT(*) FROM tservices);
    RAISE NOTICE 'Заявок: %', (SELECT COUNT(*) FROM tbids);
    RAISE NOTICE 'Предложений: %', (SELECT COUNT(*) FROM tproposals);
    RAISE NOTICE 'Отзывов: %', (SELECT COUNT(*) FROM treviews);
END $$;

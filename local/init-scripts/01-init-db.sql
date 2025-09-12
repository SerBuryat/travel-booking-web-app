-- Инициализация базы данных для travel-booking
-- Этот скрипт выполняется при первом запуске контейнера PostgreSQL

-- Создание расширений PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "ltree";

-- Установка кодировки UTF-8
SET client_encoding = 'UTF8';

-- Создание схемы public (если не существует)
CREATE SCHEMA IF NOT EXISTS public;

-- Комментарий к базе данных
COMMENT ON DATABASE db_postgres IS 'Travel Booking Application Database';

-- Создание таблиц на основе Prisma схемы

-- Таблица администраторов
CREATE TABLE IF NOT EXISTS tadmins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP(6) DEFAULT NOW()
);

-- Таблица аутентификации администраторов
CREATE TABLE IF NOT EXISTS tadmins_auth (
    id SERIAL PRIMARY KEY,
    tadmins_id INTEGER NOT NULL,
    auth_type VARCHAR(20) NOT NULL,
    auth_id VARCHAR(255),
    password_hash VARCHAR(255),
    UNIQUE(tadmins_id, auth_type),
    FOREIGN KEY (tadmins_id) REFERENCES tadmins(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Таблица областей (иерархическая структура)
CREATE TABLE IF NOT EXISTS tarea (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sysname VARCHAR(100) UNIQUE NOT NULL,
    parent_id INTEGER,
    tier SMALLINT NOT NULL,
    path LTREE,
    created_at TIMESTAMP(6) DEFAULT NOW(),
    FOREIGN KEY (parent_id) REFERENCES tarea(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Создание индекса для ltree
CREATE INDEX IF NOT EXISTS idx_tarea_path ON tarea USING GIST (path);

-- Таблица клиентов
CREATE TABLE IF NOT EXISTS tclients (
    id SERIAL PRIMARY KEY,
    tarea_id INTEGER,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    photo VARCHAR(500),
    additional_info JSONB,
    created_at TIMESTAMP(6) DEFAULT NOW(),
    FOREIGN KEY (tarea_id) REFERENCES tarea(id) ON UPDATE NO ACTION
);

-- Таблица аутентификации клиентов
CREATE TABLE IF NOT EXISTS tclients_auth (
    id SERIAL PRIMARY KEY,
    tclients_id INTEGER NOT NULL,
    auth_type VARCHAR(20),
    auth_id VARCHAR(255),
    last_login TIMESTAMP(6),
    auth_context JSONB,
    refresh_token VARCHAR(1000),
    token_expires_at TIMESTAMP(6),
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(20) DEFAULT 'user',
    UNIQUE(auth_type, auth_id),
    FOREIGN KEY (tclients_id) REFERENCES tclients(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Таблица настроек клиентов
CREATE TABLE IF NOT EXISTS tclients_settings (
    id SERIAL PRIMARY KEY,
    tclients_id INTEGER NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT NOT NULL,
    UNIQUE(tclients_id, setting_key),
    FOREIGN KEY (tclients_id) REFERENCES tclients(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Таблица категорий (иерархическая структура)
CREATE TABLE IF NOT EXISTS tcategories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    sysname VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    photo VARCHAR(255),
    parent_id INTEGER,
    path LTREE,
    FOREIGN KEY (parent_id) REFERENCES tcategories(id) ON UPDATE NO ACTION
);

-- Создание индекса для ltree категорий
CREATE INDEX IF NOT EXISTS idx_categories_path ON tcategories USING GIST (path);

-- Таблица опций категорий
CREATE TABLE IF NOT EXISTS tcategories_options (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (category_id) REFERENCES tcategories(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE INDEX IF NOT EXISTS idx_tcategories_options_category ON tcategories_options (category_id);

-- Таблица провайдеров
CREATE TABLE IF NOT EXISTS tproviders (
    id SERIAL PRIMARY KEY,
    tclients_id INTEGER NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    contact_info JSONB,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP(6) DEFAULT NOW(),
    FOREIGN KEY (tclients_id) REFERENCES tclients(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Таблица сервисов
CREATE TABLE IF NOT EXISTS tservices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tcategories_id INTEGER NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    provider_id INTEGER NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP(6) DEFAULT NOW(),
    priority SMALLINT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    service_options JSONB,
    FOREIGN KEY (tcategories_id) REFERENCES tcategories(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (provider_id) REFERENCES tproviders(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Индексы для сервисов
CREATE INDEX IF NOT EXISTS idx_tservices_category ON tservices (tcategories_id);
CREATE INDEX IF NOT EXISTS idx_tservices_price ON tservices (price);

-- Таблица контактов сервисов
CREATE TABLE IF NOT EXISTS tcontacts (
    id SERIAL PRIMARY KEY,
    tservices_id INTEGER NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(14),
    tg_username VARCHAR(255),
    website VARCHAR(255),
    whatsap VARCHAR(255),
    FOREIGN KEY (tservices_id) REFERENCES tservices(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Таблица локаций сервисов
CREATE TABLE IF NOT EXISTS tlocations (
    id SERIAL PRIMARY KEY,
    tservices_id INTEGER NOT NULL,
    name VARCHAR(255),
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    tarea_id INTEGER NOT NULL,
    description TEXT,
    FOREIGN KEY (tservices_id) REFERENCES tservices(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (tarea_id) REFERENCES tarea(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE INDEX IF NOT EXISTS idx_tlocations_area ON tlocations (tarea_id);

-- Таблица фотографий сервисов
CREATE TABLE IF NOT EXISTS tphotos (
    id SERIAL PRIMARY KEY,
    tservices_id INTEGER NOT NULL,
    url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (tservices_id) REFERENCES tservices(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Таблица заявок (bids)
CREATE TABLE IF NOT EXISTS tbids (
    id SERIAL PRIMARY KEY,
    tclients_id INTEGER NOT NULL,
    tarea_id INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    nights_from SMALLINT NOT NULL,
    nights_to SMALLINT,
    budget DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP(6) DEFAULT NOW(),
    FOREIGN KEY (tclients_id) REFERENCES tclients(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (tarea_id) REFERENCES tarea(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE INDEX IF NOT EXISTS idx_tbids_area ON tbids (tarea_id);

-- Таблица предложений
CREATE TABLE IF NOT EXISTS tproposals (
    id SERIAL PRIMARY KEY,
    tbids_id INTEGER NOT NULL,
    tservices_id INTEGER NOT NULL,
    tproviders_id INTEGER NOT NULL,
    created_at TIMESTAMP(6) DEFAULT NOW(),
    comment TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (tbids_id) REFERENCES tbids(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (tservices_id) REFERENCES tservices(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (tproviders_id) REFERENCES tproviders(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Таблица уведомлений
CREATE TABLE IF NOT EXISTS talerts (
    id SERIAL PRIMARY KEY,
    tbids_id INTEGER NOT NULL,
    tproviders_id INTEGER NOT NULL,
    created_at TIMESTAMP(6) DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (tbids_id) REFERENCES tbids(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (tproviders_id) REFERENCES tproviders(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Таблица отзывов
CREATE TABLE IF NOT EXISTS treviews (
    id SERIAL PRIMARY KEY,
    tservices_id INTEGER NOT NULL,
    tclients_id INTEGER NOT NULL,
    rating DECIMAL(3, 2) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP(6) DEFAULT NOW(),
    UNIQUE(tservices_id, tclients_id),
    FOREIGN KEY (tservices_id) REFERENCES tservices(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (tclients_id) REFERENCES tclients(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE INDEX IF NOT EXISTS idx_treviews_created ON treviews (created_at DESC);

-- Таблица кликов по сервисам
CREATE TABLE IF NOT EXISTS tservices_clicks (
    id SERIAL PRIMARY KEY,
    tclients_id INTEGER NOT NULL,
    tservices_id INTEGER NOT NULL,
    timestamp TIMESTAMP(6) DEFAULT NOW(),
    UNIQUE(tclients_id, tservices_id),
    FOREIGN KEY (tclients_id) REFERENCES tclients(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (tservices_id) REFERENCES tservices(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE INDEX IF NOT EXISTS idx_tservices_clicks_client ON tservices_clicks (tclients_id);

-- Таблица платежей
CREATE TABLE IF NOT EXISTS tpayments (
    id SERIAL PRIMARY KEY,
    payment_id VARCHAR(100) UNIQUE NOT NULL,
    tservices_id INTEGER NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP(6) DEFAULT NOW(),
    FOREIGN KEY (tservices_id) REFERENCES tservices(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Таблица уведомлений системы
CREATE TABLE IF NOT EXISTS tnotifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    user_role VARCHAR(10) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP(6) DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON tnotifications (user_id, user_role);

-- Добавление комментариев к таблицам
COMMENT ON TABLE tadmins IS 'Администраторы системы';
COMMENT ON TABLE tadmins_auth IS 'Аутентификация администраторов';
COMMENT ON TABLE tarea IS 'Иерархическая структура областей/регионов';
COMMENT ON TABLE tclients IS 'Клиенты системы';
COMMENT ON TABLE tclients_auth IS 'Аутентификация клиентов';
COMMENT ON TABLE tclients_settings IS 'Настройки клиентов';
COMMENT ON TABLE tcategories IS 'Иерархическая структура категорий сервисов';
COMMENT ON TABLE tcategories_options IS 'Опции для категорий сервисов';
COMMENT ON TABLE tproviders IS 'Провайдеры услуг';
COMMENT ON TABLE tservices IS 'Сервисы/услуги';
COMMENT ON TABLE tcontacts IS 'Контактная информация сервисов';
COMMENT ON TABLE tlocations IS 'Локации сервисов';
COMMENT ON TABLE tphotos IS 'Фотографии сервисов';
COMMENT ON TABLE tbids IS 'Заявки клиентов';
COMMENT ON TABLE tproposals IS 'Предложения провайдеров';
COMMENT ON TABLE talerts IS 'Уведомления о заявках';
COMMENT ON TABLE treviews IS 'Отзывы о сервисах';
COMMENT ON TABLE tservices_clicks IS 'Клики по сервисам';
COMMENT ON TABLE tpayments IS 'Платежи';
COMMENT ON TABLE tnotifications IS 'Системные уведомления';

-- Создание пользователя для приложения (если нужен отдельный пользователь)
-- CREATE USER travel_app WITH PASSWORD 'travel_app_password';
-- GRANT ALL PRIVILEGES ON DATABASE db_postgres TO travel_app;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO travel_app;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO travel_app;

-- Установка прав доступа
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Логирование успешного создания
DO $$
BEGIN
    RAISE NOTICE 'База данных travel-booking успешно инициализирована!';
    RAISE NOTICE 'Создано таблиц: %', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public');
    RAISE NOTICE 'Создано расширений: ltree, uuid-ossp';
END $$;

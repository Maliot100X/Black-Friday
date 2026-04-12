-- MK BLACK FRIDAY RADAR - Database Schema
-- PostgreSQL with PostGIS

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'store_owner', 'admin')),
    qr_code VARCHAR(255) UNIQUE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    notification_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    city VARCHAR(100) DEFAULT 'Skopje',
    country VARCHAR(100) DEFAULT 'North Macedonia',
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    geog GEOGRAPHY(POINT, 4326),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url TEXT,
    category VARCHAR(100),
    owner_id INTEGER REFERENCES users(id),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deals table
CREATE TABLE IF NOT EXISTS deals (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    product_name VARCHAR(255),
    original_price DECIMAL(10, 2),
    discounted_price DECIMAL(10, 2),
    discount_percentage DECIMAL(5, 2),
    discount_amount DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    category VARCHAR(100),
    subcategory VARCHAR(100),
    image_url TEXT,
    product_url TEXT,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    quantity_available INTEGER,
    quantity_sold INTEGER DEFAULT 0,
    ranking_score DECIMAL(5, 2),
    scraped_from VARCHAR(50),
    scraped_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchases table
CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    deal_id INTEGER REFERENCES deals(id) ON DELETE SET NULL,
    store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    total_amount DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    qr_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- QR Scans table
CREATE TABLE IF NOT EXISTS qr_scans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL,
    qr_code VARCHAR(255),
    scan_type VARCHAR(20) CHECK (scan_type IN ('check_in', 'purchase', 'redemption')),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_valid BOOLEAN DEFAULT TRUE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    event_category VARCHAR(50),
    deal_id INTEGER REFERENCES deals(id) ON DELETE SET NULL,
    store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL,
    metadata JSONB,
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_qr ON users(qr_code);
CREATE INDEX IF NOT EXISTS idx_stores_location ON stores USING GIST(geog);
CREATE INDEX IF NOT EXISTS idx_stores_city ON stores(city);
CREATE INDEX IF NOT EXISTS idx_deals_store ON deals(store_id);
CREATE INDEX IF NOT EXISTS idx_deals_category ON deals(category);
CREATE INDEX IF NOT EXISTS idx_deals_active ON deals(is_active, end_date);
CREATE INDEX IF NOT EXISTS idx_deals_price ON deals(discounted_price);
CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_deal ON purchases(deal_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_user ON qr_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_store ON qr_scans(store_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stores_updated_at ON stores;
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_deals_updated_at ON deals;
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample Skopje stores for testing
INSERT INTO stores (name, description, address, city, latitude, longitude, geog, category, is_verified)
VALUES
    ('TechnoMarket Skopje', 'Electronics and gadgets store', 'Boulevard Partizanski Odredi 20', 'Skopje', 41.9981, 21.4254, ST_SetSRID(ST_MakePoint(21.4254, 41.9981), 4326)::geography, 'Electronics', TRUE),
    ('Anhoch Skopje', 'Computer and laptop retailer', 'Boulevard Ilinden 100', 'Skopje', 41.9949, 21.4310, ST_SetSRID(ST_MakePoint(21.4310, 41.9949), 4326)::geography, 'Electronics', TRUE),
    ('Neptun Skopje City Mall', 'Home appliances and electronics', 'Boulevard Partizanski Odredi 14', 'Skopje', 41.9865, 21.4380, ST_SetSRID(ST_MakePoint(21.4380, 41.9865), 4326)::geography, 'Electronics', TRUE),
    ('Super Vero Skopje', 'Supermarket chain', 'Boulevard Goce Delcev 40', 'Skopje', 42.0005, 21.4130, ST_SetSRID(ST_MakePoint(21.4130, 42.0005), 4326)::geography, 'Supermarket', TRUE),
    ('Ramstore Mall', 'Shopping mall with multiple stores', 'Boulevard Aleksandar Makedonski 10', 'Skopje', 41.9910, 21.4450, ST_SetSRID(ST_MakePoint(21.4450, 41.9910), 4326)::geography, 'Mall', TRUE)
ON CONFLICT DO NOTHING;

-- Insert sample deals
INSERT INTO deals (store_id, title, description, product_name, original_price, discounted_price, discount_percentage, category, is_active, quantity_available)
SELECT
    s.id,
    'Black Friday: 50% Off Laptops',
    'Get 50% off all laptop models this Black Friday weekend',
    'Generic Laptop',
    899.99,
    449.99,
    50.00,
    'Electronics',
    TRUE,
    50
FROM stores s WHERE s.name = 'Anhoch Skopje'
ON CONFLICT DO NOTHING;

INSERT INTO deals (store_id, title, description, product_name, original_price, discounted_price, discount_percentage, category, is_active, quantity_available)
SELECT
    s.id,
    'Smartphone Sale: 30% Off',
    'All smartphones 30% off this week only',
    'Generic Smartphone',
    699.99,
    489.99,
    30.00,
    'Electronics',
    TRUE,
    100
FROM stores s WHERE s.name = 'TechnoMarket Skopje'
ON CONFLICT DO NOTHING;

INSERT INTO deals (store_id, title, description, product_name, original_price, discounted_price, discount_percentage, category, is_active, quantity_available)
SELECT
    s.id,
    'TV Black Friday Deal: 40% Off',
    '4K Smart TVs at unbeatable prices',
    '55" 4K Smart TV',
    1200.00,
    720.00,
    40.00,
    'Electronics',
    TRUE,
    25
FROM stores s WHERE s.name = 'Neptun Skopje City Mall'
ON CONFLICT DO NOTHING;

INSERT INTO deals (store_id, title, description, product_name, original_price, discounted_price, discount_percentage, category, is_active, quantity_available)
SELECT
    s.id,
    'Grocery Special: Buy 2 Get 1 Free',
    'On selected food items',
    'Assorted Groceries',
    50.00,
    33.33,
    33.33,
    'Groceries',
    TRUE,
    200
FROM stores s WHERE s.name = 'Super Vero Skopje'
ON CONFLICT DO NOTHING;

INSERT INTO deals (store_id, title, description, product_name, original_price, discounted_price, discount_percentage, category, is_active, quantity_available)
SELECT
    s.id,
    'Mall Wide Sale: Up to 70% Off',
    'Various stores participating in Ramstore Black Friday',
    'Various Products',
    200.00,
    60.00,
    70.00,
    'Various',
    TRUE,
    500
FROM stores s WHERE s.name = 'Ramstore Mall'
ON CONFLICT DO NOTHING;

-- Verify setup
SELECT 'Database schema created successfully' AS status;

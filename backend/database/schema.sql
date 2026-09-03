-- LAVÉRA Relational SQLite Database Schema
PRAGMA foreign_keys = ON;

-- 1. Users & Authentication
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN')),
    phone TEXT,
    address TEXT,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Garment Digital Twin (Garment DNA)
CREATE TABLE IF NOT EXISTS garments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    fabric TEXT NOT NULL,
    color TEXT NOT NULL,
    size TEXT NOT NULL,
    purchase_date TEXT,
    wash_cycles INTEGER DEFAULT 0,
    last_washed TEXT,
    condition_score INTEGER DEFAULT 100,
    care_recommendation TEXT,
    status TEXT DEFAULT 'IN_WARDROBE' CHECK(status IN ('IN_WARDROBE', 'IN_ORDER', 'MAINTENANCE')),
    image_url TEXT,
    color_vector TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Garment Images & Visual Twins
CREATE TABLE IF NOT EXISTS garment_images (
    id TEXT PRIMARY KEY,
    garment_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    image_type TEXT DEFAULT 'STUDIO' CHECK(image_type IN ('STUDIO', 'BEFORE_CARE', 'INSPECTION', 'SEARCH_SAMPLE')),
    color_vector TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (garment_id) REFERENCES garments(id) ON DELETE CASCADE
);

-- 4. Pre-Existing Damage & Inspections
CREATE TABLE IF NOT EXISTS garment_inspections (
    id TEXT PRIMARY KEY,
    garment_id TEXT NOT NULL,
    order_id TEXT,
    detected_condition TEXT NOT NULL,
    confidence REAL NOT NULL,
    snapshot_url TEXT NOT NULL,
    stage TEXT DEFAULT 'BEFORE_CARE' CHECK(stage IN ('BEFORE_CARE', 'AFTER_CARE')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (garment_id) REFERENCES garments(id) ON DELETE CASCADE
);

-- 5. Garment Care History
CREATE TABLE IF NOT EXISTS garment_care_history (
    id TEXT PRIMARY KEY,
    garment_id TEXT NOT NULL,
    wash_date TEXT NOT NULL,
    cycle_type TEXT NOT NULL,
    facility TEXT NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (garment_id) REFERENCES garments(id) ON DELETE CASCADE
);

-- 6. Orders
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    service_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('PICKUP', 'RECEPTION', 'SORTING', 'PROCESSING', 'QUALITY_CHECK', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED')),
    pickup_date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    estimated_completion TEXT,
    total_price REAL NOT NULL,
    instructions TEXT,
    water_liters REAL DEFAULT 48.0,
    energy_kwh REAL DEFAULT 1.2,
    co2_kg REAL DEFAULT 0.45,
    eco_score INTEGER DEFAULT 88,
    missing_garment_flag INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    garment_id TEXT NOT NULL,
    service_type TEXT NOT NULL,
    price REAL NOT NULL,
    status TEXT DEFAULT 'PROCESSING',
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (garment_id) REFERENCES garments(id) ON DELETE CASCADE
);

-- 8. Order Status History (Chain of Custody)
CREATE TABLE IF NOT EXISTS order_status_history (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    stage TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    location TEXT NOT NULL,
    staff_name TEXT NOT NULL,
    status TEXT NOT NULL,
    notes TEXT,
    sequence INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 9. Machines
CREATE TABLE IF NOT EXISTS machines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('WASHER', 'DRYER')),
    status TEXT NOT NULL CHECK(status IN ('AVAILABLE', 'RUNNING', 'MAINTENANCE', 'OVERLOADED')),
    capacity_pct INTEGER DEFAULT 0,
    current_order_id TEXT,
    temperature TEXT,
    cycle_name TEXT,
    estimated_completion TEXT,
    notes TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Machine Cycles
CREATE TABLE IF NOT EXISTS machine_cycles (
    id TEXT PRIMARY KEY,
    machine_id TEXT NOT NULL,
    order_id TEXT,
    cycle_type TEXT NOT NULL,
    started_at TEXT NOT NULL,
    completed_at TEXT,
    energy_used REAL DEFAULT 0.8,
    FOREIGN KEY (machine_id) REFERENCES machines(id) ON DELETE CASCADE
);

-- 11. Staff
CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    station TEXT NOT NULL,
    shift TEXT NOT NULL,
    avatar_url TEXT
);

-- 12. Smart Inventory
CREATE TABLE IF NOT EXISTS inventory (
    id TEXT PRIMARY KEY,
    item_name TEXT NOT NULL,
    current_stock REAL NOT NULL,
    unit TEXT NOT NULL,
    projected_usage_per_day REAL NOT NULL,
    days_remaining REAL NOT NULL,
    reorder_level REAL NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('IN_STOCK', 'REORDER_SOON', 'CRITICAL')),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 13. Deliveries
CREATE TABLE IF NOT EXISTS deliveries (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    staff_id TEXT,
    driver_name TEXT NOT NULL,
    vehicle TEXT,
    eta TEXT,
    status TEXT DEFAULT 'SCHEDULED',
    dropoff_notes TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 14. Payments
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    amount REAL NOT NULL,
    method TEXT NOT NULL,
    status TEXT DEFAULT 'COMPLETED',
    transaction_ref TEXT NOT NULL,
    paid_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 15. AI Predictions & Aging
CREATE TABLE IF NOT EXISTS ai_predictions (
    id TEXT PRIMARY KEY,
    garment_id TEXT,
    prediction_type TEXT NOT NULL,
    input_parameters TEXT,
    prediction_output TEXT NOT NULL,
    confidence REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 16. AI Recommendations & Operational Intelligence
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    trigger_event TEXT NOT NULL,
    observation TEXT NOT NULL,
    bottleneck TEXT,
    recommendation_text TEXT NOT NULL,
    suggested_action TEXT NOT NULL,
    action_payload TEXT,
    is_applied INTEGER DEFAULT 0,
    applied_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 17. In-App Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

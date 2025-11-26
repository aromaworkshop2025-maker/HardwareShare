import Database from 'better-sqlite3';

const db = new Database('sqlite.db');
db.pragma('foreign_keys = ON');

console.log('Initializing database...');

// Drop existing tables
db.exec(`
  DROP TABLE IF EXISTS notifications;
  DROP TABLE IF EXISTS ratings;
  DROP TABLE IF EXISTS requests;
  DROP TABLE IF EXISTS items;
  DROP TABLE IF EXISTS users;
`);

// Create users table
db.exec(`
  CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    first_name TEXT,
    last_name TEXT,
    profile_image_url TEXT,
    bio TEXT,
    location TEXT,
    phone TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
`);

// Create items table
db.exec(`
  CREATE TABLE items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('laptop', 'monitor', 'peripheral', 'audio', 'tablet', 'other')),
    condition TEXT NOT NULL CHECK(condition IN ('new', 'like_new', 'good', 'fair')),
    image TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available', 'requested', 'borrowed', 'unavailable')),
    owner_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Create requests table
db.exec(`
  CREATE TABLE requests (
    id TEXT PRIMARY KEY,
    item_id TEXT NOT NULL,
    requester_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'declined', 'completed', 'cancelled')),
    message TEXT,
    start_date INTEGER,
    end_date INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    responded_at INTEGER,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Create ratings table
db.exec(`
  CREATE TABLE ratings (
    id TEXT PRIMARY KEY,
    request_id TEXT NOT NULL,
    from_user_id TEXT NOT NULL,
    to_user_id TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
    FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Create notifications table
db.exec(`
  CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('request_received', 'request_approved', 'request_declined', 'item_returned', 'rating_received', 'message_received')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_id TEXT,
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Create indexes
db.exec(`
  CREATE INDEX idx_items_owner ON items(owner_id);
  CREATE INDEX idx_items_status ON items(status);
  CREATE INDEX idx_requests_item ON requests(item_id);
  CREATE INDEX idx_requests_requester ON requests(requester_id);
  CREATE INDEX idx_requests_status ON requests(status);
  CREATE INDEX idx_ratings_to_user ON ratings(to_user_id);
  CREATE INDEX idx_ratings_from_user ON ratings(from_user_id);
  CREATE INDEX idx_notifications_user ON notifications(user_id);
  CREATE INDEX idx_notifications_read ON notifications(is_read);
`);

console.log('Database initialized successfully!');
db.close();

CREATE DATABASE mailforge_db;
USE mailforge_db;

-- 1. Users Table (Simple structure for ownership)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    role VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Templates Table
-- The 'sections' column uses the JSON data type to store the block array
CREATE TABLE templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL DEFAULT 'Untitled Template',
    category VARCHAR(100) DEFAULT 'Other',
    subject VARCHAR(255),
    sections JSON NOT NULL, -- This stores your React state directly
    thumbnail_url VARCHAR(2048),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Optional: Insert a dummy user to start with
INSERT INTO users (name, email, password_hash, company, role) 
VALUES ('Soham', 'soham@sonyinfotech.com', 'hashed_pass', 'Sony Info Tech', 'Senior Developer');
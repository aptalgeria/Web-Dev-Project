-- Database creation script for Perfume Gate
-- Use this script to manually initialize your database in phpMyAdmin if preferred.

CREATE DATABASE IF NOT EXISTS `perfume_db`;
USE `perfume_db`;

-- Create the perfumes table
CREATE TABLE IF NOT EXISTS perfumes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL COMMENT 'Fragrance name',
  description TEXT COMMENT 'Detailed scent profile',
  price DECIMAL(10,2) NOT NULL COMMENT 'Price in local currency',
  image_url VARCHAR(1024) DEFAULT NULL COMMENT 'URL to fragrance display image',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data (optional)
INSERT IGNORE INTO perfumes (name, description, price, image_url) VALUES 
('Lumière d\'Or', 'A radiant blend of citrus and white jasmine.', 85.00, 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800'),
('Nuit Éthérée', 'Mysterious oud and sandalwood with a hint of dark rose.', 120.00, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800');

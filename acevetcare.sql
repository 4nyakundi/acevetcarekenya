-- ACEVETCARE DATABASE STRUCTURE
-- Create the database
CREATE DATABASE IF NOT EXISTS acevetcare;
USE acevetcare;

-- Drop tables if they already exist (optional cleanup)
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS comments;

-- Appointments Table
CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  date DATETIME NOT NULL,
  department VARCHAR(100) NOT NULL,
  doctor VARCHAR(100) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments Table
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

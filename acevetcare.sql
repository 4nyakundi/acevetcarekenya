-- Create the database
CREATE DATABASE acevetcare;

-- Use the new database
USE acevetcare;

-- Create appointments table
CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  appointment_date DATETIME NOT NULL,
  department VARCHAR(100) NOT NULL,
  doctor VARCHAR(100) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

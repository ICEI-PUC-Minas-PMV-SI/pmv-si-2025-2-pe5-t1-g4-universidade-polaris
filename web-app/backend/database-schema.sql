-- Student Management System - MariaDB Database Schema
-- This file creates the required tables for the application

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'moderator', 'teacher', 'student') NOT NULL DEFAULT 'student',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  registration_number VARCHAR(50) NOT NULL UNIQUE,
  course VARCHAR(255) NOT NULL,
  semester INT NOT NULL CHECK (semester >= 1 AND semester <= 8),
  gpa DECIMAL(3, 2) DEFAULT NULL CHECK (gpa >= 0 AND gpa <= 10),
  phone VARCHAR(20),
  status ENUM('active', 'inactive', 'graduated') DEFAULT 'active',
  created_by INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_created_by (created_by),
  INDEX idx_status (status),
  INDEX idx_course (course),
  INDEX idx_semester (semester),
  INDEX idx_registration_number (registration_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

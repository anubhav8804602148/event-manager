-- College Event Management System - Database Initialization Script
-- MySQL 8.0+

-- Create Database
CREATE DATABASE IF NOT EXISTS event_manager;
USE event_manager;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100),
    role ENUM('STUDENT', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    account_status ENUM('ACTIVE', 'INACTIVE', 'LOCKED') NOT NULL DEFAULT 'ACTIVE',
    failed_login_attempts INT NOT NULL DEFAULT 0,
    last_login_attempt DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_account_status (account_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Events Table
CREATE TABLE IF NOT EXISTS events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    start_date_time DATETIME NOT NULL,
    end_date_time DATETIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    registration_deadline DATETIME NOT NULL,
    image_url VARCHAR(500),
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    rejection_reason TEXT,
    organizer_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_organizer FOREIGN KEY (organizer_id) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_start_date_time (start_date_time),
    INDEX idx_organizer_id (organizer_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    registration_date DATETIME NOT NULL,
    attendance_status ENUM('PENDING', 'ATTENDED', 'CANCELLED', 'REMOVED') NOT NULL DEFAULT 'PENDING',
    cancellation_reason TEXT,
    removal_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES events(id),
    CONSTRAINT uq_student_event UNIQUE KEY (student_id, event_id),
    
    INDEX idx_student_id (student_id),
    INDEX idx_event_id (event_id),
    INDEX idx_attendance_status (attendance_status),
    INDEX idx_registration_date (registration_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Admin User (Password: Admin@123)
-- Use this command to generate bcrypt hash: https://www.bcryptcalculator.com/
-- Or use: Spring's BCryptPasswordEncoder in code
INSERT INTO users (email, password, first_name, last_name, role, account_status) VALUES 
('admin@college.edu', '$2a$10$GRLdNijSQMUvqfH5rJ7lOegCrJhLhFEgMkj9gqNK/VZOqNpG1D.cO', 'Admin', 'User', 'ADMIN', 'ACTIVE');

-- Insert Sample Student Users
INSERT INTO users (email, password, first_name, last_name, department, role, account_status) VALUES 
('john@student.edu', '$2a$10$GRLdNijSQMUvqfH5rJ7lOegCrJhLhFEgMkj9gqNK/VZOqNpG1D.cO', 'John', 'Doe', 'Computer Science', 'STUDENT', 'ACTIVE'),
('jane@student.edu', '$2a$10$GRLdNijSQMUvqfH5rJ7lOegCrJhLhFEgMkj9gqNK/VZOqNpG1D.cO', 'Jane', 'Smith', 'Electronics', 'STUDENT', 'ACTIVE');

-- Insert Sample Events
INSERT INTO events (title, description, category, start_date_time, end_date_time, location, capacity, registration_deadline, status, organizer_id) VALUES 
('Spring Boot Workshop', 'Learn modern Spring Boot development with hands-on exercises. This comprehensive workshop covers Spring Security, Data JPA, REST APIs, and microservices architecture. Perfect for intermediate Java developers.', 'Workshop', DATE_ADD(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 7 DAY 2 HOUR), 'Room 101, Engineering Block', 50, DATE_ADD(NOW(), INTERVAL 5 DAY), 'APPROVED', 1),
('Cloud Computing Seminar', 'Understand cloud architecture, AWS services, and deployment strategies. Guest speaker from leading cloud provider. Topics include EC2, S3, Lambda, and RDS.', 'Seminar', DATE_ADD(NOW(), INTERVAL 14 DAY), DATE_ADD(NOW(), INTERVAL 14 DAY 1 HOUR), 'Auditorium', 100, DATE_ADD(NOW(), INTERVAL 12 DAY), 'APPROVED', 1);

-- Create view for event registration count (optional, for performance)
CREATE OR REPLACE VIEW event_registration_count AS
SELECT 
    e.id,
    e.title,
    COUNT(r.id) as current_registrations
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id AND r.attendance_status = 'PENDING'
GROUP BY e.id, e.title;

-- Display summary
SELECT 'Database initialized successfully!' as status;

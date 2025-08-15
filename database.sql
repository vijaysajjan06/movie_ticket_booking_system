-- Create the database
CREATE DATABASE IF NOT EXISTS cinema_db;
USE cinema_db;

-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT NOT NULL, -- Duration in minutes
    release_date DATE,
    poster_url VARCHAR(255),
    status ENUM('now_showing', 'upcoming') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create shows table
CREATE TABLE IF NOT EXISTS shows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_title VARCHAR(255) NOT NULL,
    showtime DATETIME NOT NULL,
    total_seats INT NOT NULL DEFAULT 100,
    available_seats INT NOT NULL DEFAULT 100,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_title) REFERENCES movies(title)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_title VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    seats INT NOT NULL,
    showtime DATETIME NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_title) REFERENCES movies(title)
);

-- Insert sample movies
INSERT INTO movies (title, description, duration, release_date, poster_url, status) VALUES
('Inception', 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 148, '2024-05-01', 'images/movie1.jpg', 'now_showing'),
('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 152, '2024-06-15', 'images/movie2.jpg', 'upcoming');

-- Insert sample shows
INSERT INTO shows (movie_title, showtime, price) VALUES
('Inception', '2024-05-27 14:30:00', 12.99),
('Inception', '2024-05-27 18:30:00', 14.99),
('Inception', '2024-05-27 21:30:00', 14.99); 
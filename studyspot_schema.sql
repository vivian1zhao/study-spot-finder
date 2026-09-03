DROP DATABASE IF EXISTS StudySpots;
CREATE DATABASE StudySpots;

USE StudySpots;

CREATE TABLE Users(
	user_id INT AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    pass_word VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) UNIQUE,
    address VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(50),
    user_role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

CREATE TABLE Places(
	place_id INT AUTO_INCREMENT PRIMARY KEY,
    place_name VARCHAR(100) NOT NULL,
    place_type VARCHAR(30) NOT NULL,
    address VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    total_reviews INT DEFAULT NULL,
    avg_rating DECIMAL(3,2) DEFAULT NULL
);

CREATE TABLE Reviews(
	review_id INT AUTO_INCREMENT PRIMARY KEY,
    place_id INT NOT NULL,
    user_id INT NOT NULL, 
    overall_rating DECIMAL(3,2) NOT NULL,
    noise DECIMAL(3,2),
    seating DECIMAL(3,2),
	outlets DECIMAL(3,2),
	wifi DECIMAL(3,2),
	food DECIMAL(3,2),
	opening_hours DECIMAL(3,2),
	parking DECIMAL(3,2),
    comments VARCHAR(250),
    FOREIGN KEY (place_id) REFERENCES Places(place_id), 
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
); 

CREATE TABLE Amenities(
	amenity_id INT AUTO_INCREMENT PRIMARY KEY,
    amenity_name VARCHAR(50)
);

CREATE TABLE PlaceAmenities(
	amenity_id INT, 
    place_id INT,
    FOREIGN KEY (amenity_id) REFERENCES Amenities(amenity_id),
    FOREIGN KEY (place_id) REFERENCES Places(place_id)
);

CREATE TABLE OpeningHours(
    hours_id INT PRIMARY KEY AUTO_INCREMENT,
    place_id INT NOT NULL,
    day_of_week TINYINT NOT NULL,   -- 0=Sun, 1=Mon, ..., 6=Sat
    open_time TIME,
    close_time TIME,
    is_24_hours BOOLEAN DEFAULT FALSE,
    closed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (place_id) REFERENCES Places(place_id),
    UNIQUE (place_id, day_of_week)   -- one row per place per day
);

CREATE TABLE Favorites(
	favorite_id INT AUTO_INCREMENT PRIMARY KEY,
    place_id INT,
    user_id INT,
    FOREIGN KEY (place_id) REFERENCES Places(place_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    UNIQUE (user_id, place_id) 
);


CREATE TABLE audit_log (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,   -- to see which user made the change
    action VARCHAR(50) NOT NULL,    -- crud functionality was performed
    table_name VARCHAR(50) NOT NULL,    -- table that's changed
    details TEXT,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 
    FOREIGN KEY (user_id) REFERENCES Users(user_id)  -- links to the user 
);


DELIMITER //
 
CREATE TRIGGER after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE places
    SET
        total_reviews = (SELECT COUNT(*) FROM reviews WHERE place_id = NEW.place_id),
        avg_rating = (SELECT ROUND(AVG(overall_rating), 2) FROM reviews WHERE place_id = NEW.place_id)
    WHERE place_id = NEW.place_id;
END//
 
DELIMITER ;

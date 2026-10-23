USE StudySpots;

-- =========================
-- USERS
-- =========================

INSERT INTO Users
(fname, lname, username, pass_word, email, phone, address, city, state, user_role)
VALUES
('Amanda', 'Wright', 'amanda_w10', 'password123', 'amanda@example.com', '7325551001',
 '10 Main St', 'Manalapan', 'NJ', 'user'),

('Alex', 'Chen', 'alexc_22', 'study123', 'alex@example.com', '7325551002',
 '22 Oak Rd', 'Manalapan', 'NJ', 'user'),

('Jordan', 'Smith', 'jordan_htx', 'coffee456', 'jordan@example.com', '7135551003',
 '100 Westheimer Rd', 'Houston', 'TX', 'user'),

('Maya', 'Patel', 'maya_patel23', 'books789', 'maya@example.com', '2125551004',
 '55 W 23rd St', 'New York', 'NY', 'user'),

('Chris', 'Lee', 'chris_admin', 'admin123', 'admin@example.com', '7325551005',
 '77 Route 9', 'Manalapan', 'NJ', 'admin');
 
 -- =========================
-- PLACES
-- =========================

INSERT INTO Places
(place_name, place_type, address, city, state)
VALUES

-- Manalapan, NJ
('Monmouth County Library Headquarters',
 'Library',
 '125 Symmes Dr',
 'Manalapan',
 'NJ'),

('Panera Bread - Manalapan',
 'Cafe',
 '31 US-9',
 'Manalapan',
 'NJ'),

('Starbucks - Manalapan',
 'Cafe',
 '334 US-9 N',
 'Manalapan',
 'NJ'),

-- Houston, TX
('Houston Central Library',
 'Library',
 '500 McKinney St',
 'Houston',
 'TX'),

('Jungman Neighborhood Library',
 'Library',
 '5830 Westheimer Rd',
 'Houston',
 'TX'),

('The Coffee House at West End',
 'Cafe',
 '802 Shepherd Dr',
 'Houston',
 'TX'),

-- New York, NY
('Stephen A. Schwarzman Building',
 'Library',
 '476 5th Ave',
 'New York',
 'NY'),

('Muhlenberg Library',
 'Library',
 '209 W 23rd St',
 'New York',
 'NY'),

('Think Coffee',
 'Cafe',
 '248 Mercer St',
 'New York',
 'NY'),

-- Philadelphia, PA
('Parkway Central Library',
 'Library',
 '1901 Vine St',
 'Philadelphia',
 'PA'),

('Philadelphia City Institute',
 'Library',
 '1905 Locust St',
 'Philadelphia',
 'PA'),
 
 ('La Colombe Coffee Roasters - Rittenhouse Square',
 'Cafe',
 '130 S 19th St',
 'Philadelphia',
 'PA'),

-- San Francisco, CA
('San Francisco Main Library',
 'Library',
 '100 Larkin St',
 'San Francisco',
 'CA'),

('Mission Bay Branch Library',
 'Library',
 '960 4th St',
 'San Francisco',
 'CA'),
 
 ('Sightglass Coffee - SoMa',
 'Cafe',
 '270 7th St',
 'San Francisco',
 'CA'),

-- Austin, TX
('Austin Central Library',
 'Library',
 '710 W Cesar Chavez St',
 'Austin',
 'TX'),

('Ruiz Branch Library',
 'Library',
 '1600 Grove Blvd',
 'Austin',
 'TX'),
 
 ('Texas Union',
 'Campus Building',
 '2308 Whitis Ave',
 'Austin',
 'TX'),

-- Los Angeles, CA
('Los Angeles Central Library',
 'Library',
 '630 W 5th St',
 'Los Angeles',
 'CA'),

('West Los Angeles Regional Branch Library',
 'Library',
 '11360 Santa Monica Blvd',
 'Los Angeles',
 'CA'),
 
 ('Ronald Tutor Campus Center',
 'Campus Building',
 '3607 Trousdale Pkwy',
 'Los Angeles',
 'CA');

 
-- =========================
-- AMENITIES
-- =========================

INSERT INTO Amenities
(amenity_name)
VALUES
('Free Wi-Fi'),
('Outlets'),
('Food'),
('Parking'),
('Quiet Area'),
('Restrooms'),
('Group Seating'),
('Individual Seating'), 
('Study Rooms');


INSERT INTO PlaceAmenities
(amenity_id, place_id)
VALUES

-- Place 1: Monmouth County Library Headquarters
(1,1),
(2,1),
(4,1),
(5,1),
(6,1),
(7,1),
(8,1),
(9,1),

-- Place 2: Panera Bread - Manalapan
(1,2),
(2,2),
(3,2),
(4,2),
(6,2),
(7,2),

-- Place 3: Starbucks - Manalapan
(1,3),
(2,3),
(3,3),
(4,3),
(6,3),

-- Place 4: Houston Central Library
(1,4),
(2,4),
(5,4),
(6,4),
(7,4),
(8,4),
(9,4),

-- Place 5: Jungman Neighborhood Library
(1,5),
(2,5),
(4,5),
(5,5),
(6,5),
(8,5),

-- Place 6: The Coffee House at West End
(1,6),
(2,6),
(3,6),
(4,6),
(6,6),
(7,6),

-- Place 7: Stephen A. Schwarzman Building
(1,7),
(2,7),
(5,7),
(6,7),
(8,7),
(9,7),

-- Place 8: Muhlenberg Library
(1,8),
(2,8),
(5,8),
(6,8),
(7,8),
(8,8),
(9,8),

-- Place 9: Think Coffee
(1,9),
(2,9),
(3,9),
(6,9),
(7,9),

-- Place 10: Parkway Central Library
(1,10),
(2,10),
(4,10),
(6,10),
(9,10),

-- Place 11: Philadelphia City Institute
(1,11),
(4,11),
(6,11),

-- Place 12: La Colombe Coffee Roasters - Rittenhouse Square
(3,12),

-- Place 13: San Francisco Main Library
(1,13),
(3,13),
(4,13),
(9,13),

-- Place 14: Mission Bay Branch Library
(9,14),

-- Place 15: Sightglass Coffee - SoMa
(3,15),

-- Place 16: Austin Central Library
(1,16),
(4,16),
(9,16),

-- Place 17: Ruiz Branch Library
(9,17),

-- Place 18: Texas Union
(3,18),
(4,18),
(7,18),
(8,18),

-- Place 19: Los Angeles Central Library
(1,19),
(4,19),

-- Place 20: West Los Angeles Regional Branch Library
(1,20),
(4,20),

-- Place 21: Ronald Tutor Campus Center
(3,21),
(7,21),
(8,21);


-- =========================
-- OPENING HOURS
-- =========================

-- Place 1: Monmouth County Library
INSERT INTO OpeningHours
(place_id, day_of_week, open_time, close_time, is_24_hours, closed)
VALUES
(1,0,NULL,NULL,FALSE,TRUE),
(1,1,'09:00:00','21:00:00',FALSE,FALSE),
(1,2,'09:00:00','21:00:00',FALSE,FALSE),
(1,3,'09:00:00','21:00:00',FALSE,FALSE),
(1,4,'09:00:00','21:00:00',FALSE,FALSE),
(1,5,'09:00:00','17:00:00',FALSE,FALSE),
(1,6,'09:00:00','17:00:00',FALSE,FALSE);

-- Place 2: Panera
INSERT INTO OpeningHours
(place_id, day_of_week, open_time, close_time, is_24_hours, closed)
VALUES
(2,0,'07:00:00','21:00:00',FALSE,FALSE),
(2,1,'06:30:00','21:00:00',FALSE,FALSE),
(2,2,'06:30:00','21:00:00',FALSE,FALSE),
(2,3,'06:30:00','21:00:00',FALSE,FALSE),
(2,4,'06:30:00','21:00:00',FALSE,FALSE),
(2,5,'06:30:00','21:00:00',FALSE,FALSE),
(2,6,'07:00:00','21:00:00',FALSE,FALSE);

-- Place 3: Starbucks
INSERT INTO OpeningHours
(place_id, day_of_week, open_time, close_time, is_24_hours, closed)
VALUES
(3,0,'06:00:00','20:00:00',FALSE,FALSE),
(3,1,'05:30:00','20:30:00',FALSE,FALSE),
(3,2,'05:30:00','20:30:00',FALSE,FALSE),
(3,3,'05:30:00','20:30:00',FALSE,FALSE),
(3,4,'05:30:00','20:30:00',FALSE,FALSE),
(3,5,'05:30:00','20:30:00',FALSE,FALSE),
(3,6,'06:00:00','20:00:00',FALSE,FALSE);

-- Place 4: Houston Central Library
INSERT INTO OpeningHours
(place_id, day_of_week, open_time, close_time, is_24_hours, closed)
VALUES
(4,0,NULL,NULL,FALSE,TRUE),
(4,1,'10:00:00','18:00:00',FALSE,FALSE),
(4,2,'10:00:00','18:00:00',FALSE,FALSE),
(4,3,'10:00:00','18:00:00',FALSE,FALSE),
(4,4,'10:00:00','18:00:00',FALSE,FALSE),
(4,5,'10:00:00','17:00:00',FALSE,FALSE),
(4,6,'10:00:00','17:00:00',FALSE,FALSE);

-- Place 10: Parkway Central Library
INSERT INTO OpeningHours
(place_id, day_of_week, open_time, close_time, is_24_hours, closed)
VALUES
(10,0,NULL,NULL,FALSE,TRUE),
(10,1,'09:00:00','20:00:00',FALSE,FALSE),
(10,2,'09:00:00','20:00:00',FALSE,FALSE),
(10,3,'09:00:00','20:00:00',FALSE,FALSE),
(10,4,'09:00:00','20:00:00',FALSE,FALSE),
(10,5,'09:00:00','17:00:00',FALSE,FALSE),
(10,6,'09:00:00','17:00:00',FALSE,FALSE);

-- Place 11: Philadelphia City Institute
INSERT INTO OpeningHours
(place_id, day_of_week, open_time, close_time, is_24_hours, closed)
VALUES
(11,0,NULL,NULL,FALSE,TRUE),
(11,1,'11:00:00','19:00:00',FALSE,FALSE),
(11,2,'11:00:00','19:00:00',FALSE,FALSE),
(11,3,'10:00:00','17:00:00',FALSE,FALSE),
(11,4,'10:00:00','17:00:00',FALSE,FALSE),
(11,5,'10:00:00','17:00:00',FALSE,FALSE),
(11,6,'10:00:00','17:00:00',FALSE,FALSE);

-- Place 12: La Colombe Coffee Roasters - Rittenhouse Square
INSERT INTO OpeningHours
(place_id, day_of_week, open_time, close_time, is_24_hours, closed)
VALUES
(12,0,'06:00:00','19:00:00',FALSE,FALSE),
(12,1,'06:00:00','19:00:00',FALSE,FALSE),
(12,2,'06:00:00','19:00:00',FALSE,FALSE),
(12,3,'06:00:00','19:00:00',FALSE,FALSE),
(12,4,'06:00:00','19:00:00',FALSE,FALSE),
(12,5,'06:00:00','19:00:00',FALSE,FALSE),
(12,6,'06:00:00','19:00:00',FALSE,FALSE);

-- Place 13: San Francisco Main Library
INSERT INTO OpeningHours
(place_id, day_of_week, open_time, close_time, is_24_hours, closed)
VALUES
(13,0,'12:00:00','18:00:00',FALSE,FALSE),
(13,1,'09:00:00','18:00:00',FALSE,FALSE),
(13,2,'09:00:00','20:00:00',FALSE,FALSE),
(13,3,'09:00:00','20:00:00',FALSE,FALSE),
(13,4,'09:00:00','20:00:00',FALSE,FALSE),
(13,5,'12:00:00','18:00:00',FALSE,FALSE),
(13,6,'10:00:00','18:00:00',FALSE,FALSE);

-- Place 14: Mission Bay Branch Library
INSERT INTO OpeningHours
(place_id, day_of_week, open_time, close_time, is_24_hours, closed)
VALUES
(14,0,'13:00:00','17:00:00',FALSE,FALSE),
(14,1,'10:00:00','18:00:00',FALSE,FALSE),
(14,2,'10:00:00','18:00:00',FALSE,FALSE),
(14,3,'11:00:00','20:00:00',FALSE,FALSE),
(14,4,'10:00:00','18:00:00',FALSE,FALSE),
(14,5,'13:00:00','18:00:00',FALSE,FALSE),
(14,6,'10:00:00','18:00:00',FALSE,FALSE);

-- Place 15: Sightglass Coffee - SoMa
INSERT INTO OpeningHours
(place_id, day_of_week, open_time, close_time, is_24_hours, closed)
VALUES
(15,0,'07:00:00','17:00:00',FALSE,FALSE),
(15,1,'06:30:00','17:00:00',FALSE,FALSE),
(15,2,'06:30:00','17:00:00',FALSE,FALSE),
(15,3,'06:30:00','17:00:00',FALSE,FALSE),
(15,4,'06:30:00','17:00:00',FALSE,FALSE),
(15,5,'06:30:00','17:00:00',FALSE,FALSE),
(15,6,'07:00:00','17:00:00',FALSE,FALSE);

-- Place 16: Austin Central Library
INSERT INTO OpeningHours
(place_id, day_of_week, open_time, close_time, is_24_hours, closed)
VALUES
(16,0,'12:00:00','17:00:00',FALSE,FALSE),
(16,1,'09:00:00','20:00:00',FALSE,FALSE),
(16,2,'09:00:00','20:00:00',FALSE,FALSE),
(16,3,'09:00:00','20:00:00',FALSE,FALSE),
(16,4,'09:00:00','20:00:00',FALSE,FALSE),
(16,5,'09:00:00','17:00:00',FALSE,FALSE),
(16,6,'10:00:00','17:00:00',FALSE,FALSE);

-- Place 17: Ruiz Branch Library
INSERT INTO OpeningHours
(place_id, day_of_week, open_time, close_time, is_24_hours, closed)
VALUES
(17,0,'12:00:00','17:00:00',FALSE,FALSE),
(17,1,'09:00:00','20:00:00',FALSE,FALSE),
(17,2,'09:00:00','20:00:00',FALSE,FALSE),
(17,3,'09:00:00','20:00:00',FALSE,FALSE),
(17,4,'09:00:00','20:00:00',FALSE,FALSE),
(17,5,'09:00:00','17:00:00',FALSE,FALSE),
(17,6,'10:00:00','17:00:00',FALSE,FALSE);

-- Place 18: Texas Union
INSERT INTO OpeningHours
(place_id, day_of_week, open_time, close_time, is_24_hours, closed)
VALUES
(18,0,'12:00:00','23:00:00',FALSE,FALSE),
(18,1,'07:00:00','23:00:00',FALSE,FALSE),
(18,2,'07:00:00','23:00:00',FALSE,FALSE),
(18,3,'07:00:00','23:00:00',FALSE,FALSE),
(18,4,'07:00:00','23:00:00',FALSE,FALSE),
(18,5,'07:00:00','23:00:00',FALSE,FALSE),
(18,6,'10:00:00','23:00:00',FALSE,FALSE);

-- Place 19: Los Angeles Central Library
INSERT INTO OpeningHours
(place_id, day_of_week, open_time, close_time, is_24_hours, closed)
VALUES
(19,0,'13:00:00','17:00:00',FALSE,FALSE),
(19,1,'10:00:00','20:00:00',FALSE,FALSE),
(19,2,'10:00:00','20:00:00',FALSE,FALSE),
(19,3,'10:00:00','20:00:00',FALSE,FALSE),
(19,4,'10:00:00','20:00:00',FALSE,FALSE),
(19,5,'09:30:00','17:30:00',FALSE,FALSE),
(19,6,'09:30:00','17:30:00',FALSE,FALSE);

-- Place 20: West Los Angeles Regional Branch Library
INSERT INTO OpeningHours
(place_id, day_of_week, open_time, close_time, is_24_hours, closed)
VALUES
(20,0,'13:00:00','17:00:00',FALSE,FALSE),
(20,1,'10:00:00','20:00:00',FALSE,FALSE),
(20,2,'10:00:00','20:00:00',FALSE,FALSE),
(20,3,'10:00:00','20:00:00',FALSE,FALSE),
(20,4,'10:00:00','20:00:00',FALSE,FALSE),
(20,5,'09:30:00','17:30:00',FALSE,FALSE),
(20,6,'09:30:00','17:30:00',FALSE,FALSE);


-- =========================
-- REVIEWS
-- =========================

INSERT INTO Reviews
(place_id, user_id, overall_rating, noise, seating, outlets, wifi,
 food, opening_hours, parking, comments)
VALUES

-- Place 1: Monmouth County Library Headquarters
(1,1,4.80,4.80,4.50,4.70,4.80,2.00,4.00,5.00,
 'Very quiet and plenty of space to study.'),

(1,2,4.50,4.70,4.20,4.50,4.60,1.50,4.00,5.00,
 'Good place for long study sessions.'),

(1,4,4.70,4.90,4.60,4.30,4.70,1.00,4.20,4.80,
 'One of the best quiet study spots.'),

-- Place 2: Panera Bread - Manalapan
(2,1,4.00,3.20,4.00,3.50,4.20,4.80,4.50,4.80,
 'Good for studying if it is not too crowded.'),

(2,2,3.80,3.00,3.80,3.40,4.00,4.70,4.50,4.50,
 'Convenient, but can get noisy around lunch.'),

-- Place 3: Starbucks - Manalapan
(3,1,3.60,2.50,3.30,3.00,4.00,4.50,4.70,4.50,
 'Good coffee but not ideal when busy.'),

(3,3,3.90,2.80,3.70,3.50,4.10,4.60,4.60,4.20,
 'Decent for short study sessions.'),

-- Place 4: Houston Central Library
(4,3,4.70,4.80,4.60,4.70,4.80,1.50,4.00,3.00,
 'Lots of space and very quiet.'),

(4,4,4.50,4.60,4.30,4.50,4.70,1.00,4.00,3.20,
 'Great for focused work.'),

-- Place 5: Jungman Neighborhood Library
(5,3,4.30,4.50,4.00,4.20,4.30,1.00,4.20,4.50,
 'Reliable library with a calm environment.'),

-- Place 6: The Coffee House at West End
(6,3,4.20,3.30,4.20,4.00,4.50,4.60,4.70,4.20,
 'Nice atmosphere and good seating.'),

(6,4,4.00,3.10,4.00,3.80,4.30,4.80,4.70,4.00,
 'Good for casual studying with friends.'),

-- Place 7: Stephen A. Schwarzman Building
(7,4,4.90,5.00,4.70,4.20,4.60,1.00,4.20,1.00,
 'Excellent quiet environment for serious studying.'),

(7,2,4.70,4.90,4.50,4.00,4.50,1.00,4.00,1.00,
 'Beautiful and very focused atmosphere.'),

-- Place 8: Muhlenberg Library
(8,4,4.40,4.60,4.30,4.40,4.50,1.00,4.20,2.00,
 'Solid neighborhood library for studying.'),

-- Place 9: Think Coffee
(9,4,4.10,3.20,4.00,3.80,4.40,4.60,4.50,1.50,
 'Nice cafe atmosphere but gets busy.'),

-- Place 10: Parkway Central Library
(10,1,4.70,4.70,4.60,4.50,4.70,1.00,4.50,3.30,
 'Large library with plenty of space for focused studying.'),

(10,4,4.50,4.60,4.40,4.40,4.60,1.00,4.40,3.20,
 'Good option for a longer study session.'),

-- Place 11: Philadelphia City Institute
(11,2,4.20,4.40,4.00,3.80,4.40,1.00,4.00,3.20,
 'Smaller library with a calm atmosphere.'),

-- Place 12: La Colombe Coffee Roasters - Rittenhouse Square
(12,1,4.20,3.20,4.00,3.50,4.00,4.80,4.70,2.00,
 'Good cafe for studying, especially earlier in the day.'),

(12,4,4.00,3.00,3.80,3.40,4.00,4.70,4.60,2.00,
 'Convenient coffee shop for a shorter work session.'),

-- Place 13: San Francisco Main Library
(13,2,4.60,4.50,4.60,4.30,4.70,3.50,4.60,2.50,
 'Lots of room and several areas to work.'),

(13,4,4.40,4.30,4.50,4.20,4.60,3.40,4.50,2.40,
 'Good downtown option for studying for several hours.'),

-- Place 14: Mission Bay Branch Library
(14,1,4.30,4.50,4.10,4.00,4.30,1.00,4.20,3.00,
 'Comfortable branch for quiet work and studying.'),

-- Place 15: Sightglass Coffee - SoMa
(15,2,4.20,3.30,4.20,3.70,4.10,4.60,4.40,2.20,
 'Nice atmosphere for working with a coffee.'),

(15,4,4.00,3.10,4.00,3.60,4.00,4.70,4.30,2.00,
 'Good place to work for a few hours if it is not too busy.'),

-- Place 16: Austin Central Library
(16,3,4.90,4.60,4.90,4.60,4.80,3.50,4.70,4.00,
 'Excellent space with plenty of areas to sit and work.'),

(16,4,4.70,4.50,4.80,4.50,4.70,3.40,4.60,4.00,
 'One of the better places for spending a full day studying.'),

-- Place 17: Ruiz Branch Library
(17,3,4.20,4.40,4.00,4.00,4.30,1.00,4.20,4.00,
 'Quiet neighborhood library that works well for focused studying.'),

-- Place 18: Texas Union
(18,3,4.40,3.40,4.50,4.00,4.40,4.80,4.90,4.00,
 'Lots of places to sit and convenient for studying between classes.'),

(18,1,4.20,3.20,4.30,3.90,4.30,4.70,4.80,4.00,
 'Good campus option when I want somewhere more casual than a library.'),

-- Place 19: Los Angeles Central Library
(19,1,4.60,4.50,4.70,4.30,4.70,2.00,4.50,2.80,
 'Large library with many different areas for studying.'),

(19,4,4.50,4.40,4.60,4.20,4.60,2.00,4.40,2.70,
 'Good place for getting several hours of work done.'),

-- Place 20: West Los Angeles Regional Branch Library
(20,2,4.30,4.50,4.20,4.00,4.40,1.00,4.30,3.50,
 'Calm library and a solid option for individual studying.'),

-- Place 21: Ronald Tutor Campus Center
(21,4,4.30,3.20,4.50,3.80,4.20,4.80,4.60,2.50,
 'Plenty of seating and a convenient place to work between classes.'),

(21,2,4.10,3.00,4.30,3.70,4.10,4.70,4.50,2.40,
 'Good for casual studying or meeting up for group work.');


 -- =========================
-- FAVORITES
-- =========================

INSERT INTO Favorites
(place_id, user_id)
VALUES
-- User 1
(1,1),
(2,1),
(7,1),
(10,1),
(12,1),
(14,1),
(18,1),
(19,1),

-- User 2
(1,2),
(3,2),
(7,2),
(11,2),
(13,2),
(15,2),
(20,2),
(21,2),

-- User 3
(4,3),
(5,3),
(6,3),
(16,3),
(17,3),
(18,3),

-- User 4
(7,4),
(8,4),
(9,4),
(10,4),
(12,4),
(13,4),
(16,4),
(19,4),
(21,4);
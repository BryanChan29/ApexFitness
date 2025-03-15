-- Updated Users Table Insert Data
INSERT INTO users (id, email, username, password, current_weight, goal_weight, height, age, gender, activity_level) VALUES
('user1', 'alice@example.com', 'alice123', '$argon2id$v=19$m=65536,t=3,p=4$iXgrKMu5e9OLt3hbMh568A$fx1QqmmsKO8O124zzHB3/9ayTdvjnGffpN7NDp3UEEY', null, null, null, null, null, null),
('user2', 'bob@example.com', 'bob456', '$argon2id$v=19$m=65536,t=3,p=4$iXgrKMu5e9OLt3hbMh568A$fx1QqmmsKO8O124zzHB3/9ayTdvjnGffpN7NDp3UEEY', null, null, null, null, null, null);

-- Daily Food Insert Data
INSERT INTO daily_food (id, user_id, meal_type, name, quantity, calories, carbs, fat, protein, sodium, sugar, date) VALUES
(1, 'user1', 'dinner', 'Chicken Stir-fry with White rice', '1 serving', 507, 10, 14, 56, 1400, 3, '2025-03-08'),
(2, 'user1', 'lunch', 'Soup and sandwich meal', '1 meal', 567, 10, 14, 56, 1400, 3, '2025-03-08');

-- Meals Insert Data (updated with auto-incremented ID)
INSERT INTO meals (name, date, user_id) VALUES
('Chicken Stir-fry with White rice', '2025-02-18', 'user1'),
('Soup and sandwich meal', '2025-02-18', 'user1');

-- Meal Items Join Data (Updated meal_id with auto-incremented values)
INSERT INTO meal_items (meal_id, food_id) VALUES
(1, 1), -- Meal 1: Chicken Stir-fry with White rice
(2, 2); -- Meal 2: Soup and sandwich meal

-- Meal Plan Items (updated table with correct references to meal and food ids)
INSERT INTO meal_plan_items (meal_plan_id, meal_id, food_id, day_of_week) VALUES
(100, 1, 1, 'tuesday'),
(100, 2, 2, 'tuesday');

-- Meal Plans Insert Data
INSERT INTO meal_plans (name, is_private) VALUES
('Meal plan 1', 0),
('Meal plan 2', 1),
('Meal plan 3', 0),
('Meal plan 4', 1),
('Meal plan 5', 0),
('Meal plan 6', 1),
('Meal plan 7', 0),
('Meal plan 8', 1),
('Meal plan 9', 0),
('Meal plan 10', 1),
('Meal plan 11', 0),
('Meal plan 12', 1),
('Meal plan 13', 0),
('Meal plan 14', 1),
('Meal plan 15', 0),
('Meal plan 16', 1),
('Meal plan 17', 0),
('Meal plan 18', 1),
('Meal plan 19', 0),
('Meal plan 20', 1);

-- Additional Daily Food Insert Data (Updated for multiple entries)
INSERT INTO daily_food (id, user_id, meal_type, name, quantity, calories, carbs, fat, protein, sodium, sugar, date) VALUES
(100, 'user1', 'meal-plan-item-dinner', 'Test Food 1', '1 serving', 100, 10, 5, 8, 200, 2, '2025-03-07'),
(101, 'user1', 'meal-plan-item-dinner', 'Test Food 2', '1 serving', 110, 12, 6, 9, 205, 3, '2025-03-07'),
(102, 'user1', 'meal-plan-item-dinner', 'Test Food 3', '1 serving', 120, 14, 7, 10, 210, 4, '2025-03-07'),
(103, 'user1', 'meal-plan-item-dinner', 'Test Food 4', '1 serving', 130, 16, 8, 11, 215, 5, '2025-03-07'),
(104, 'user1', 'meal-plan-item-dinner', 'Test Food 5', '1 serving', 140, 18, 9, 12, 220, 6, '2025-03-07'),
(105, 'user1', 'meal-plan-item-dinner', 'Test Food 6', '1 serving', 150, 20, 10, 13, 225, 7, '2025-03-07'),
(106, 'user1', 'meal-plan-item-dinner', 'Test Food 7', '1 serving', 160, 22, 11, 14, 230, 8, '2025-03-07'),
(107, 'user1', 'meal-plan-item-dinner', 'Test Food 8', '1 serving', 170, 24, 12, 15, 235, 9, '2025-03-07'),
(108, 'user1', 'meal-plan-item-dinner', 'Test Food 9', '1 serving', 180, 26, 13, 16, 240, 10, '2025-03-07'),
(109, 'user1', 'meal-plan-item-dinner', 'Test Food 10', '1 serving', 190, 28, 14, 17, 245, 11, '2025-03-07'),
(110, 'user1', 'meal-plan-item-dinner', 'Test Food 11', '1 serving', 200, 30, 15, 18, 250, 12, '2025-03-07'),
(111, 'user1', 'meal-plan-item-dinner', 'Test Food 12', '1 serving', 210, 32, 16, 19, 255, 13, '2025-03-07'),
(112, 'user1', 'meal-plan-item-dinner', 'Test Food 13', '1 serving', 220, 34, 17, 20, 260, 14, '2025-03-07'),
(113, 'user1', 'meal-plan-item-dinner', 'Test Food 14', '1 serving', 230, 36, 18, 21, 265, 15, '2025-03-07'),
(114, 'user1', 'meal-plan-item-dinner', 'Test Food 15', '1 serving', 240, 38, 19, 22, 270, 16, '2025-03-07'),
(115, 'user1', 'meal-plan-item-dinner', 'Test Food 16', '1 serving', 250, 40, 20, 23, 275, 17, '2025-03-07'),
(116, 'user1', 'meal-plan-item-dinner', 'Test Food 17', '1 serving', 260, 42, 21, 24, 280, 18, '2025-03-07'),
(117, 'user1', 'meal-plan-item-dinner', 'Test Food 18', '1 serving', 270, 44, 22, 25, 285, 19, '2025-03-07'),
(118, 'user1', 'meal-plan-item-dinner', 'Test Food 19', '1 serving', 280, 46, 23, 26, 290, 20, '2025-03-07'),
(119, 'user1', 'meal-plan-item-dinner', 'Test Food 20', '1 serving', 290, 48, 24, 27, 295, 21, '2025-03-07');

-- Updated Meals Table Insert Data
INSERT INTO meals (name, date, user_id) VALUES
('Meal 1', '2025-03-07', 'user1'),
('Meal 2', '2025-03-07', 'user1'),
('Meal 3', '2025-03-07', 'user1'),
('Meal 4', '2025-03-07', 'user1'),
('Meal 5', '2025-03-07', 'user1'),
('Meal 6', '2025-03-07', 'user1'),
('Meal 7', '2025-03-07', 'user1'),
('Meal 8', '2025-03-07', 'user1'),
('Meal 9', '2025-03-07', 'user1'),
('Meal 10', '2025-03-07', 'user1'),
('Meal 11', '2025-03-07', 'user1'),
('Meal 12', '2025-03-07', 'user1'),
('Meal 13', '2025-03-07', 'user1'),
('Meal 14', '2025-03-07', 'user1'),
('Meal 15', '2025-03-07', 'user1'),
('Meal 16', '2025-03-07', 'user1'),
('Meal 17', '2025-03-07', 'user1'),
('Meal 18', '2025-03-07', 'user1'),
('Meal 19', '2025-03-07', 'user1'),
('Meal 20', '2025-03-07', 'user1');

-- Meal Items Join Data (updated with auto-incremented meal_id)
INSERT INTO meal_items (meal_id, food_id) VALUES
(1, 100),
(2, 101),
(3, 102),
(4, 103),
(5, 104),
(6, 105),
(7, 106),
(8, 107),
(9, 108),
(10, 109),
(11, 110),
(12, 111),
(13, 112),
(14, 113),
(15, 114),
(16, 115),
(17, 116),
(18, 117),
(19, 118),
(20, 119);

-- Updated Meal Plan Items Join Data
INSERT INTO meal_plan_items (meal_plan_id, meal_id, food_id, day_of_week) VALUES
(1, 1, 100, 'monday'),
(2, 2, 101, 'tuesday'),
(3, 3, 102, 'wednesday'),
(4, 4, 103, 'thursday'),
(5, 5, 104, 'friday'),
(6, 6, 105, 'saturday'),
(7, 7, 106, 'sunday'),
(8, 8, 107, 'monday'),
(9, 9, 108, 'tuesday'),
(10, 10, 109, 'wednesday'),
(11, 11, 110, 'thursday'),
(12, 12, 111, 'friday'),
(13, 13, 112, 'saturday'),
(14, 14, 113, 'sunday'),
(15, 15, 114, 'monday'),
(16, 16, 115, 'tuesday'),
(17, 17, 116, 'wednesday'),
(18, 18, 117, 'thursday'),
(19, 19, 118, 'friday'),
(20, 20, 119, 'saturday');

-- Goals test data
INSERT INTO user_weight_history (user_id, date_recorded, weight, notes) VALUES ('user1', '2025-01-01', 241, 'Steady weight loss');
INSERT INTO user_weight_history (user_id, date_recorded, weight, notes) VALUES ('user1', '2025-01-08', 233, 'Steady weight loss');
INSERT INTO user_weight_history (user_id, date_recorded, weight, notes) VALUES ('user1', '2025-01-15', 224, 'Steady weight loss');
INSERT INTO user_weight_history (user_id, date_recorded, weight, notes) VALUES ('user1', '2025-01-22', 217, 'Steady weight loss');
INSERT INTO user_weight_history (user_id, date_recorded, weight, notes) VALUES ('user1', '2025-01-29', 210, 'Steady weight loss');
INSERT INTO user_weight_history (user_id, date_recorded, weight, notes) VALUES ('user1', '2025-02-05', 203, 'Steady weight loss');
INSERT INTO user_weight_history (user_id, date_recorded, weight, notes) VALUES ('user1', '2025-02-12', 193, 'Steady weight loss');
INSERT INTO user_weight_history (user_id, date_recorded, weight, notes) VALUES ('user1', '2025-02-19', 183, 'Minor fluctuation');
INSERT INTO user_weight_history (user_id, date_recorded, weight, notes) VALUES ('user1', '2025-02-26', 175, 'Minor fluctuation');
INSERT INTO user_weight_history (user_id, date_recorded, weight, notes) VALUES ('user1', '2025-03-05', 167, 'Minor fluctuation');


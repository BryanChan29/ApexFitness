-- alice@example.com:password
-- bob@example.com:password
INSERT INTO users (id, email, username, password, current_weight, goal_weight, height, age, activity_level) VALUES
('user1', 'alice@example.com', 'alice123', '$argon2id$v=19$m=65536,t=3,p=4$iXgrKMu5e9OLt3hbMh568A$fx1QqmmsKO8O124zzHB3/9ayTdvjnGffpN7NDp3UEEY', null, null, null, null, null),
('user2', 'bob@example.com', 'bob456', '$argon2id$v=19$m=65536,t=3,p=4$iXgrKMu5e9OLt3hbMh568A$fx1QqmmsKO8O124zzHB3/9ayTdvjnGffpN7NDp3UEEY', null, null, null, null, null);

INSERT INTO daily_food (id, user_id, meal_type, name, quantity, calories, carbs, fat, protein, sodium, sugar, date) VALUES
(1, 'user1', 'dinner', 'Chicken Stir-fry with White rice', '1 serving', 507, 10, 14, 56, 1400, 3, '2025-03-08'),
(2, 'user1', 'lunch', 'Soup and sandwich meal', '1 meal', 567, 10, 14, 56, 1400, 3, '2025-03-08');

-- Meal one solely consists of the chicken stir fry dish
INSERT INTO meals (id, name, date, user_id) VALUES(10, 'Chicken Stir-fry with White rice', '02/18/2025', 'user1');
INSERT INTO meal_items (meal_id, food_id) VALUES(10, 1);

INSERT INTO meals (id, name, date, user_id) VALUES(11, 'Soup and sandwich meal', '02/18/2025', 'user1');
INSERT INTO meal_items (meal_id, food_id) VALUES(11, 2);

INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES 
(100, 10, 'tuesday'),
(100, 11, 'tuesday');

INSERT INTO meal_plans (id, name, is_private) VALUES (1, 'Meal plan 1', 0);
INSERT INTO meal_plans (id, name, is_private) VALUES (2, 'Meal plan 2', 1);
INSERT INTO meal_plans (id, name, is_private) VALUES (3, 'Meal plan 3', 0);
INSERT INTO meal_plans (id, name, is_private) VALUES (4, 'Meal plan 4', 1);
INSERT INTO meal_plans (id, name, is_private) VALUES (5, 'Meal plan 5', 0);
INSERT INTO meal_plans (id, name, is_private) VALUES (6, 'Meal plan 6', 1);
INSERT INTO meal_plans (id, name, is_private) VALUES (7, 'Meal plan 7', 0);
INSERT INTO meal_plans (id, name, is_private) VALUES (8, 'Meal plan 8', 1);
INSERT INTO meal_plans (id, name, is_private) VALUES (9, 'Meal plan 9', 0);
INSERT INTO meal_plans (id, name, is_private) VALUES (10, 'Meal plan 10', 1);
INSERT INTO meal_plans (id, name, is_private) VALUES (11, 'Meal plan 11', 0);
INSERT INTO meal_plans (id, name, is_private) VALUES (12, 'Meal plan 12', 1);
INSERT INTO meal_plans (id, name, is_private) VALUES (13, 'Meal plan 13', 0);
INSERT INTO meal_plans (id, name, is_private) VALUES (14, 'Meal plan 14', 1);
INSERT INTO meal_plans (id, name, is_private) VALUES (15, 'Meal plan 15', 0);
INSERT INTO meal_plans (id, name, is_private) VALUES (16, 'Meal plan 16', 1);
INSERT INTO meal_plans (id, name, is_private) VALUES (17, 'Meal plan 17', 0);
INSERT INTO meal_plans (id, name, is_private) VALUES (18, 'Meal plan 18', 1);
INSERT INTO meal_plans (id, name, is_private) VALUES (19, 'Meal plan 19', 0);
INSERT INTO meal_plans (id, name, is_private) VALUES (20, 'Meal plan 20', 1);

INSERT INTO daily_food (id, user_id, meal_type, name, quantity, calories, carbs, fat, protein, sodium, sugar, date) VALUES
(100, 'user1', 'dinner', 'Test Food 1', '1 serving', 100, 10, 5, 8, 200, 2, '2025-03-07'),
(101, 'user1', 'dinner', 'Test Food 2', '1 serving', 110, 12, 6, 9, 205, 3, '2025-03-07'),
(102, 'user1', 'dinner', 'Test Food 3', '1 serving', 120, 14, 7, 10, 210, 4, '2025-03-07'),
(103, 'user1', 'dinner', 'Test Food 4', '1 serving', 130, 16, 8, 11, 215, 5, '2025-03-07'),
(104, 'user1', 'dinner', 'Test Food 5', '1 serving', 140, 18, 9, 12, 220, 6, '2025-03-07'),
(105, 'user1', 'dinner', 'Test Food 6', '1 serving', 150, 20, 10, 13, 225, 7, '2025-03-07'),
(106, 'user1', 'dinner', 'Test Food 7', '1 serving', 160, 22, 11, 14, 230, 8, '2025-03-07'),
(107, 'user1', 'dinner', 'Test Food 8', '1 serving', 170, 24, 12, 15, 235, 9, '2025-03-07'),
(108, 'user1', 'dinner', 'Test Food 9', '1 serving', 180, 26, 13, 16, 240, 10, '2025-03-07'),
(109, 'user1', 'dinner', 'Test Food 10', '1 serving', 190, 28, 14, 17, 245, 11, '2025-03-07'),
(110, 'user1', 'dinner', 'Test Food 11', '1 serving', 200, 30, 15, 18, 250, 12, '2025-03-07'),
(111, 'user1', 'dinner', 'Test Food 12', '1 serving', 210, 32, 16, 19, 255, 13, '2025-03-07'),
(112, 'user1', 'dinner', 'Test Food 13', '1 serving', 220, 34, 17, 20, 260, 14, '2025-03-07'),
(113, 'user1', 'dinner', 'Test Food 14', '1 serving', 230, 36, 18, 21, 265, 15, '2025-03-07'),
(114, 'user1', 'dinner', 'Test Food 15', '1 serving', 240, 38, 19, 22, 270, 16, '2025-03-07'),
(115, 'user1', 'dinner', 'Test Food 16', '1 serving', 250, 40, 20, 23, 275, 17, '2025-03-07'),
(116, 'user1', 'dinner', 'Test Food 17', '1 serving', 260, 42, 21, 24, 280, 18, '2025-03-07'),
(117, 'user1', 'dinner', 'Test Food 18', '1 serving', 270, 44, 22, 25, 285, 19, '2025-03-07'),
(118, 'user1', 'dinner', 'Test Food 19', '1 serving', 280, 46, 23, 26, 290, 20, '2025-03-07'),
(119, 'user1', 'dinner', 'Test Food 20', '1 serving', 290, 48, 24, 27, 295, 21, '2025-03-07');

INSERT INTO meals (id, name, date, user_id) VALUES(200, 'Meal 1', '03/07/2025', 'user1');
INSERT INTO meals (id, name, date, user_id) VALUES(201, 'Meal 2', '03/07/2025', 'user1');
INSERT INTO meals (id, name, date, user_id) VALUES(202, 'Meal 3', '03/07/2025', 'user1');
INSERT INTO meals (id, name, date, user_id) VALUES(203, 'Meal 4', '03/07/2025', 'user1');
INSERT INTO meals (id, name, date, user_id) VALUES(204, 'Meal 5', '03/07/2025', 'user1');
INSERT INTO meals (id, name, date, user_id) VALUES(205, 'Meal 6', '03/07/2025', 'user1');
INSERT INTO meals (id, name, date, user_id) VALUES(206, 'Meal 7', '03/07/2025', 'user1');
INSERT INTO meals (id, name, date, user_id) VALUES(207, 'Meal 8', '03/07/2025', 'user1');
INSERT INTO meals (id, name, date, user_id) VALUES(208, 'Meal 9', '03/07/2025', 'user1');
INSERT INTO meals (id, name, date, user_id) VALUES(209, 'Meal 10', '03/07/2025', 'user1');
INSERT INTO meals (id, name, date, user_id) VALUES(210, 'Meal 11', '03/07/2025', 'user1');
INSERT INTO meals (id, name, date, user_id) VALUES(211, 'Meal 12', '03/07/2025', 'user1');
INSERT INTO meals (id, name, date, user_id) VALUES(212, 'Meal 13', '03/07/2025', 'user1');
INSERT INTO meals (id, name, date, user_id) VALUES(213, 'Meal 14', '03/07/2025', 'user1');
INSERT INTO meals (id, name, date, user_id) VALUES(214, 'Meal 15', '03/07/2025', 'user1');
INSERT INTO meals (id, name, date, user_id) VALUES(215, 'Meal 16', '03/07/2025', 'user1');
INSERT INTO meals (id, name, date, user_id) VALUES(216, 'Meal 17', '03/07/2025', 'user1');
INSERT INTO meals (id, name, date, user_id) VALUES(217, 'Meal 18', '03/07/2025', 'user1');
INSERT INTO meals (id, name, date, user_id) VALUES(218, 'Meal 19', '03/07/2025', 'user1');
INSERT INTO meals (id, name, date, user_id) VALUES(219, 'Meal 20', '03/07/2025', 'user1');

INSERT INTO meal_items (meal_id, food_id) VALUES(200, 100);
INSERT INTO meal_items (meal_id, food_id) VALUES(201, 101);
INSERT INTO meal_items (meal_id, food_id) VALUES(202, 102);
INSERT INTO meal_items (meal_id, food_id) VALUES(203, 103);
INSERT INTO meal_items (meal_id, food_id) VALUES(204, 104);
INSERT INTO meal_items (meal_id, food_id) VALUES(205, 105);
INSERT INTO meal_items (meal_id, food_id) VALUES(206, 106);
INSERT INTO meal_items (meal_id, food_id) VALUES(207, 107);
INSERT INTO meal_items (meal_id, food_id) VALUES(208, 108);
INSERT INTO meal_items (meal_id, food_id) VALUES(209, 109);
INSERT INTO meal_items (meal_id, food_id) VALUES(210, 110);
INSERT INTO meal_items (meal_id, food_id) VALUES(211, 111);
INSERT INTO meal_items (meal_id, food_id) VALUES(212, 112);
INSERT INTO meal_items (meal_id, food_id) VALUES(213, 113);
INSERT INTO meal_items (meal_id, food_id) VALUES(214, 114);
INSERT INTO meal_items (meal_id, food_id) VALUES(215, 115);
INSERT INTO meal_items (meal_id, food_id) VALUES(216, 116);
INSERT INTO meal_items (meal_id, food_id) VALUES(217, 117);
INSERT INTO meal_items (meal_id, food_id) VALUES(218, 118);
INSERT INTO meal_items (meal_id, food_id) VALUES(219, 119);

INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (1, 200, 'monday');
INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (2, 201, 'tuesday');
INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (3, 202, 'wednesday');
INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (4, 203, 'thursday');
INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (5, 204, 'friday');
INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (6, 205, 'saturday');
INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (7, 206, 'sunday');
INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (8, 207, 'monday');
INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (9, 208, 'tuesday');
INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (10, 209, 'wednesday');
INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (11, 210, 'thursday');
INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (12, 211, 'friday');
INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (13, 212, 'saturday');
INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (14, 213, 'sunday');
INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (15, 214, 'monday');
INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (16, 215, 'tuesday');
INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (17, 216, 'wednesday');
INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (18, 217, 'thursday');
INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (19, 218, 'friday');
INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) VALUES (20, 219, 'saturday');

-- alice@example.com:password
-- bob@example.com:password
INSERT INTO users (id, email, username, password, current_weight, goal_weight, height, age, activity_level) VALUES
('user1', 'alice@example.com', 'alice123', '$argon2id$v=19$m=65536,t=3,p=4$iXgrKMu5e9OLt3hbMh568A$fx1QqmmsKO8O124zzHB3/9ayTdvjnGffpN7NDp3UEEY', null, null, null, null, null),
('user2', 'bob@example.com', 'bob456', '$argon2id$v=19$m=65536,t=3,p=4$iXgrKMu5e9OLt3hbMh568A$fx1QqmmsKO8O124zzHB3/9ayTdvjnGffpN7NDp3UEEY', null, null, null, null, null);

INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES
(1, 'user1', 'dinner', 'Chicken Stir-fry with White rice (1 serving)', 507, 10, 14, 56, 1400, 3),
(2, 'user1', 'lunch', 'Soup and sandwich meal', 567, 10, 14, 56, 1400, 3);

-- Meal one solely consists of the chicken stir fry dish
INSERT INTO meals (id, date, saved_meal) VALUES(10, '02/18/2025', false);
INSERT INTO meal_items (meal_id, food_id) VALUES(10, 1);

INSERT INTO meals (id, date, saved_meal) VALUES(11, '02/18/2025', false);
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
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (100, 'user1', 'dinner', 'Test Food 1', 100, 10, 5, 8, 200, 2);
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (101, 'user1', 'dinner', 'Test Food 2', 110, 12, 6, 9, 205, 3);
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (102, 'user1', 'dinner', 'Test Food 3', 120, 14, 7, 10, 210, 4);
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (103, 'user1', 'dinner', 'Test Food 4', 130, 16, 8, 11, 215, 5);
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (104, 'user1', 'dinner', 'Test Food 5', 140, 18, 9, 12, 220, 6);
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (105, 'user1', 'dinner', 'Test Food 6', 150, 20, 10, 13, 225, 7);
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (106, 'user1', 'dinner', 'Test Food 7', 160, 22, 11, 14, 230, 8);
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (107, 'user1', 'dinner', 'Test Food 8', 170, 24, 12, 15, 235, 9);
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (108, 'user1', 'dinner', 'Test Food 9', 180, 26, 13, 16, 240, 10);
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (109, 'user1', 'dinner', 'Test Food 10', 190, 28, 14, 17, 245, 11);
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (110, 'user1', 'dinner', 'Test Food 11', 200, 30, 15, 18, 250, 12);
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (111, 'user1', 'dinner', 'Test Food 12', 210, 32, 16, 19, 255, 13);
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (112, 'user1', 'dinner', 'Test Food 13', 220, 34, 17, 20, 260, 14);
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (113, 'user1', 'dinner', 'Test Food 14', 230, 36, 18, 21, 265, 15);
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (114, 'user1', 'dinner', 'Test Food 15', 240, 38, 19, 22, 270, 16);
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (115, 'user1', 'dinner', 'Test Food 16', 250, 40, 20, 23, 275, 17);
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (116, 'user1', 'dinner', 'Test Food 17', 260, 42, 21, 24, 280, 18);
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (117, 'user1', 'dinner', 'Test Food 18', 270, 44, 22, 25, 285, 19);
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (118, 'user1', 'dinner', 'Test Food 19', 280, 46, 23, 26, 290, 20);
INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES (119, 'user1', 'dinner', 'Test Food 20', 290, 48, 24, 27, 295, 21);
INSERT INTO meals (id, date, saved_meal) VALUES(200, '03/07/2025', false);
INSERT INTO meals (id, date, saved_meal) VALUES(201, '03/07/2025', false);
INSERT INTO meals (id, date, saved_meal) VALUES(202, '03/07/2025', false);
INSERT INTO meals (id, date, saved_meal) VALUES(203, '03/07/2025', false);
INSERT INTO meals (id, date, saved_meal) VALUES(204, '03/07/2025', false);
INSERT INTO meals (id, date, saved_meal) VALUES(205, '03/07/2025', false);
INSERT INTO meals (id, date, saved_meal) VALUES(206, '03/07/2025', false);
INSERT INTO meals (id, date, saved_meal) VALUES(207, '03/07/2025', false);
INSERT INTO meals (id, date, saved_meal) VALUES(208, '03/07/2025', false);
INSERT INTO meals (id, date, saved_meal) VALUES(209, '03/07/2025', false);
INSERT INTO meals (id, date, saved_meal) VALUES(210, '03/07/2025', false);
INSERT INTO meals (id, date, saved_meal) VALUES(211, '03/07/2025', false);
INSERT INTO meals (id, date, saved_meal) VALUES(212, '03/07/2025', false);
INSERT INTO meals (id, date, saved_meal) VALUES(213, '03/07/2025', false);
INSERT INTO meals (id, date, saved_meal) VALUES(214, '03/07/2025', false);
INSERT INTO meals (id, date, saved_meal) VALUES(215, '03/07/2025', false);
INSERT INTO meals (id, date, saved_meal) VALUES(216, '03/07/2025', false);
INSERT INTO meals (id, date, saved_meal) VALUES(217, '03/07/2025', false);
INSERT INTO meals (id, date, saved_meal) VALUES(218, '03/07/2025', false);
INSERT INTO meals (id, date, saved_meal) VALUES(219, '03/07/2025', false);
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

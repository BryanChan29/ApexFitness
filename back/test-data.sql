INSERT INTO users (id, email, username, password) VALUES
('user1', 'alice@example.com', 'alice123', 'password1'),
('user2', 'bob@example.com', 'bob456', 'password2');

INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES
(1, 'user1', 'dinner', 'Chicken Stir-fry with White rice (1 serving)', 507, 10, 14, 56, 1400, 3),
(2, 'user1', 'lunch', 'Soup and sandwich meal', 567, 10, 14, 56, 1400, 3);

-- Meal one solely consists of the chicken stir fry dish
INSERT INTO meals (id, date, saved_meal) VALUES(1, '02/18/2025', false);
INSERT INTO meal_items (meal_id, food_id) VALUES(1, 1);


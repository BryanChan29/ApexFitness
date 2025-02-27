-- alice@example.com:password
-- bob@example.com:password
INSERT INTO users (id, email, username, password, current_weight, goal_weight, height, age, activity_level) VALUES
('user1', 'alice@example.com', 'alice123', '$argon2id$v=19$m=65536,t=3,p=4$iXgrKMu5e9OLt3hbMh568A$fx1QqmmsKO8O124zzHB3/9ayTdvjnGffpN7NDp3UEEY', null, null, null, null, null),
('user2', 'bob@example.com', 'bob456', '$argon2id$v=19$m=65536,t=3,p=4$iXgrKMu5e9OLt3hbMh568A$fx1QqmmsKO8O124zzHB3/9ayTdvjnGffpN7NDp3UEEY', null, null, null, null, null);

INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) VALUES
(1, 'user1', 'dinner', 'Chicken Stir-fry with White rice (1 serving)', 507, 10, 14, 56, 1400, 3),
(2, 'user1', 'lunch', 'Soup and sandwich meal', 567, 10, 14, 56, 1400, 3);

-- Meal one solely consists of the chicken stir fry dish
INSERT INTO meals (id, date, saved_meal) VALUES(1, '02/18/2025', false);
INSERT INTO meal_items (meal_id, food_id) VALUES(1, 1);


-- Users Table
CREATE TABLE users ( 
    id VARCHAR(50) PRIMARY KEY, 
    email VARCHAR(50) NOT NULL, 
    username VARCHAR(50) NOT NULL,
    password VARCHAR(25) NOT NULL,
    current_weight INTEGER,
    goal_weight INTEGER,
    height INTEGER,
    age INTEGER,
    gender VARCHAR(10),
    activity_level VARCHAR(25)
);

-- DailyFood Table
CREATE TABLE daily_food ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    user_id VARCHAR(50) NOT NULL,
    meal_type VARCHAR(50) NOT NULL, 
    name VARCHAR(50) NOT NULL,
    calories INTEGER NOT NULL,
    carbs INTEGER NOT NULL,
    fat INTEGER NOT NULL,
    protein INTEGER NOT NULL,
    sodium INTEGER NOT NULL,
    sugar INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Meals Table
CREATE TABLE meals ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    date TEXT NOT NULL,  -- Use TEXT for dates in SQLite
    saved_meal BOOLEAN NOT NULL DEFAULT 0
);

-- Meal Items Join Table (for list of food IDs in a meal)
CREATE TABLE meal_items (
    meal_id INTEGER NOT NULL,
    food_id INTEGER NOT NULL,
    PRIMARY KEY (meal_id, food_id),
    FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES daily_food(id) ON DELETE CASCADE
);

-- Meal Plans Table
CREATE TABLE meal_plans ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name VARCHAR(50) NOT NULL,
    is_private BOOLEAN NOT NULL DEFAULT 1
);

-- Meal Plan Items Join Table (for list of meal IDs in a meal plan)
CREATE TABLE meal_plan_items (
    meal_plan_id INTEGER NOT NULL,
    meal_id INTEGER NOT NULL,
    day_of_week VARCHAR(15) NOT NULL,
    PRIMARY KEY (meal_plan_id, meal_id, day_of_week),
    FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE
);

-- Workout Table
CREATE TABLE workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Exercises Table
CREATE TABLE exercises (  
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_of_workout VARCHAR(255) NOT NULL,
    muscle_worked VARCHAR(255),
    duration INTEGER, -- duration in minutes
    sets INTEGER,
    reps INTEGER,
    weight INTEGER
);

-- Workout Exercises Join Table (for list of exercise IDs in a workout)
CREATE TABLE workout_exercises (
    workout_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    PRIMARY KEY (workout_id, exercise_id),
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

-- User Weight History Table
CREATE TABLE user_weight_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id VARCHAR(50) NOT NULL,
    date_recorded DATETIME NOT NULL,
    weight INTEGER NOT NULL,
    -- Optionally track body fat %, waist size, etc. if needed
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
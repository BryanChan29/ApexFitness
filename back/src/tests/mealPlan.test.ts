import axios, { AxiosError } from 'axios';
import { open } from 'sqlite';
import * as url from 'url';
import sqlite3 from 'sqlite3';
import { UIFormattedMealPlan } from '@apex/shared';

let port = 3000;
let host = 'localhost';
let protocol = 'http';
let baseUrl = `${protocol}://${host}:${port}/api`;
let __dirname = url.fileURLToPath(new URL('../..', import.meta.url));
let dbfile = `${__dirname}database.db`; // Use real database
let db: any;

// Initialize database
export async function initializeDb(): Promise<void> {
  console.log('FILENAME ' + dbfile);
  db = await open({
    filename: dbfile,
    driver: sqlite3.Database,
  });
  await db.get('PRAGMA foreign_keys = ON');
}

async function resetDb() {
  await db.run('DELETE FROM meal_plan_items');
  await db.run('DELETE FROM meal_plans');
  await db.run('DELETE FROM meal_items');
  await db.run('DELETE FROM meals');
  await db.run('DELETE FROM daily_food');
  await db.run('DELETE FROM users');
}

async function closeDb() {
  await db.close();
}

async function addToDb() {
  try {
    await db.run(
      `INSERT INTO users (id, email, username, password)
       VALUES (?, ?, ?, ?);`,
      ['1', 'test@example.com', 'testuser', 'hashedpassword123']
    );

    await db.run(
      `INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [5000, '1', 'Breakfast', 'Oatmeal', 150, 27, 3, 5, 0, 1]
    );

    await db.run(
      `INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [5001, '1', 'Lunch', 'Chicken Salad', 350, 15, 20, 30, 500, 3]
    );

    await db.run(
      `INSERT INTO daily_food (id, user_id, meal_type, name, calories, carbs, fat, protein, sodium, sugar) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [5002, '1', 'Dinner', 'Grilled Salmon', 400, 10, 25, 40, 700, 1]
    );

    await db.run(
      `INSERT INTO meals (id, date, saved_meal) 
       VALUES (?, ?, ?);`,
      [6000, '2025-02-24', 1]
    );

    await db.run(
      `INSERT INTO meals (id, date, saved_meal) 
       VALUES (?, ?, ?);`,
      [6001, '2025-02-25', 0]
    );

    await db.run(
      `INSERT INTO meal_items (meal_id, food_id) 
       VALUES (?, ?);`,
      [6000, 5000]
    );

    await db.run(
      `INSERT INTO meal_items (meal_id, food_id) 
       VALUES (?, ?);`,
      [6001, 5001]
    );

    await db.run(
      `INSERT INTO meal_items (meal_id, food_id) 
       VALUES (?, ?);`,
      [6001, 5002]
    );

    await db.run(
      `INSERT INTO meal_plans (id, name, is_private) 
       VALUES (?, ?, ?);`,
      [100, 'Test Meal Plan', 1]
    );

    await db.run(
      `INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) 
       VALUES (?, ?, ?);`,
      [100, 6000, 'thursday']
    );

    await db.run(
      `INSERT INTO meal_plan_items (meal_plan_id, meal_id, day_of_week) 
       VALUES (?, ?, ?);`,
      [100, 6001, 'wednesday']
    );

    console.log('Data inserted successfully!');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

beforeAll(async () => {
  await initializeDb();
  console.log("DB Init'd");
});

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await closeDb();
});

describe('Meal Plan API', () => {
  afterEach(async () => {
    await resetDb();
  });

  test('GET /meal_plan/:id - Retrieve daily food items for a valid meal plan', async () => {
    await addToDb();

    const res = await axios.get(`${baseUrl}/meal_plan/100`);

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('result');

    expect(typeof res.data.result).toBe('object');

    const result: UIFormattedMealPlan = res.data.result;

    // Flatten all food items from all days and meal types into a single array
    const allFoodItems = Object.values(result) // Get all days
      .flatMap((day: any) => Object.values(day)) // Get all meal types
      .flat(); // Flatten into one array

    expect(allFoodItems).toHaveLength(3);
    const foodNames = allFoodItems.map((item: any) => item.name);
    expect(foodNames).toContain('Oatmeal');
    expect(foodNames).toContain('Chicken Salad');
    expect(foodNames).toContain('Grilled Salmon');
  });

  test('GET /meal_plan/:id - Returns 404 if no meals found', async () => {
    try {
      await axios.get(`${baseUrl}/meal_plan/100`);
    } catch (error) {
      const caughtError = error as AxiosError;
      expect(caughtError.response?.status).toBe(404);
      expect(caughtError.response?.data).toEqual({
        error: 'Meal plan not found',
      });
    }
  });

  test('GET /meal_plan/:id - Returns 500 on database error', async () => {
    await addToDb();

    // Force an error by renaming the table temporarily
    await db.exec(
      'ALTER TABLE meal_plan_items RENAME TO meal_plan_items_temp;'
    );

    try {
      await axios.get(`${baseUrl}/meal_plan/100`);
    } catch (error) {
      const caughtError = error as AxiosError;
      expect(caughtError.response?.status).toBe(500);
    }

    // Restore table
    await db.exec(
      'ALTER TABLE meal_plan_items_temp RENAME TO meal_plan_items;'
    );
  });
});

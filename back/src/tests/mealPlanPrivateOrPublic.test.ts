import axios, { AxiosError } from 'axios';
import { Database, open } from 'sqlite';
import * as url from 'url';
import sqlite3 from 'sqlite3';

let port = 3000;
let host = 'localhost';
let protocol = 'http';
let baseUrl = `${protocol}://${host}:${port}/api`;
let __dirname = url.fileURLToPath(new URL('../..', import.meta.url));
let dbfile = `${__dirname}database.db`;
let db: Database<sqlite3.Database, sqlite3.Statement>;

// Initialize database
export async function initializeDb() {
  console.log('FILENAME ' + dbfile);
  db = await open({
    filename: dbfile,
    driver: sqlite3.Database,
  });
  await db.get('PRAGMA foreign_keys = ON');
}

async function resetDb() {
  await db.run('DELETE FROM meal_plans;');
  await db.run("DELETE FROM sqlite_sequence WHERE name='meal_plans';");
}

async function closeDb() {
  await db.close();
}

beforeAll(async () => {
  await initializeDb();
});

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await closeDb();
});

describe('Meal Plan API', () => {
  test('POST /meal_plan - Create meal plan successfully', async () => {
    const response = await axios.post(`${baseUrl}/meal_plan`, {
      name: 'Weekly Plan',
      isPrivate: true,
    });

    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Meal plan created successful');
    expect(response.data.mealID).toBeDefined();
  });

  test('POST /meal_plan - Fail to create meal plan with missing fields', async () => {
    try {
      await axios.post(`${baseUrl}/meal_plan`, { isPrivate: true });
    } catch (error) {
      const caughtError = error as AxiosError;
      expect(caughtError.response?.status).toBe(400);
      expect(caughtError.response?.data).toEqual({ error: 'Name required' });
    }
  });

  test('POST /meal_plan - Fail to create meal plan with no request body', async () => {
    try {
      await axios.post(`${baseUrl}/meal_plan`, {});
    } catch (error) {
      const caughtError = error as AxiosError;
      expect(caughtError.response?.status).toBe(400);
      expect(caughtError.response?.data).toEqual({
        error: 'Name and isPrivate required',
      });
    }
  });

  test('PUT /meal_plan - Update meal plan successfully', async () => {
    const createRes = await axios.post(`${baseUrl}/meal_plan`, {
      name: 'Weekly Plan',
      isPrivate: false,
    });

    expect(createRes.status).toBe(200);
    expect(createRes.data.mealID).toBeDefined();

    const mealId = createRes.data.mealID;

    const updateRes = await axios.put(`${baseUrl}/meal_plan`, {
      id: mealId,
      name: 'Updated Weekly Plan',
      isPrivate: true,
    });

    expect(updateRes.status).toBe(200);
    expect(updateRes.data.message).toContain(
      `Meal Plan ${mealId} updated successfully!`
    );
  });

  test('PUT /meal_plan - Fail to update non-existent meal plan', async () => {
    try {
      await axios.put(`${baseUrl}/meal_plan`, {
        id: '1', // Fake UUID
        name: 'Non-Existent Plan',
        isPrivate: true,
      });
    } catch (error) {
      const caughtError = error as AxiosError;
      expect(caughtError.response?.status).toBe(404);
      expect(caughtError.response?.data).toEqual({
        error: 'No meal plan found with ID 1',
      });
    }
  });

  test('PUT /meal_plan - Fail to update with missing fields', async () => {
    const createRes = await axios.post(`${baseUrl}/meal_plan`, {
      name: 'Weekly Plan',
      isPrivate: false,
    });

    expect(createRes.status).toBe(200);
    expect(createRes.data.mealID).toBeDefined();

    try {
      await axios.put(`${baseUrl}/meal_plan`, {});
    } catch (error) {
      const caughtError = error as AxiosError;
      expect(caughtError.response?.status).toBe(400);
      expect(caughtError.response?.data).toEqual({
        error: 'Meal Plan ID, Name and isPrivate values are required',
      });
    }
  });

  test('PUT /meal_plan - Fail to update with missing Meal Plan ID', async () => {
    const createRes = await axios.post(`${baseUrl}/meal_plan`, {
      name: 'Weekly Plan',
      isPrivate: false,
    });

    expect(createRes.status).toBe(200);
    expect(createRes.data.mealID).toBeDefined();

    try {
      await axios.put(`${baseUrl}/meal_plan`, {
        name: 'Updated Weekly Plan',
        isPrivate: true,
      });
    } catch (error) {
      const caughtError = error as AxiosError;
      expect(caughtError.response?.status).toBe(400);
      expect(caughtError.response?.data).toEqual({
        error: 'Meal Plan ID required',
      });
    }
  });

  test('PUT /meal_plan - Fail to update with missing name', async () => {
    const createRes = await axios.post(`${baseUrl}/meal_plan`, {
      name: 'Weekly Plan',
      isPrivate: false,
    });

    expect(createRes.status).toBe(200);
    expect(createRes.data.mealID).toBeDefined();
    const mealId = createRes.data.mealID;

    try {
      await axios.put(`${baseUrl}/meal_plan`, {
        id: mealId,
        isPrivate: true,
      });
    } catch (error) {
      const caughtError = error as AxiosError;
      expect(caughtError.response?.status).toBe(400);
      expect(caughtError.response?.data).toEqual({
        error: 'Meal Plan Name required',
      });
    }
  });

  test('PUT /meal_plan - Fail to update with missing isPrivate field', async () => {
    const createRes = await axios.post(`${baseUrl}/meal_plan`, {
      name: 'Weekly Plan',
      isPrivate: false,
    });

    expect(createRes.status).toBe(200);
    expect(createRes.data.mealID).toBeDefined();
    const mealId = createRes.data.mealID;

    try {
      await axios.put(`${baseUrl}/meal_plan`, {
        id: mealId,
        name: 'Updated Weekly Plan',
      });
    } catch (error) {
      const caughtError = error as AxiosError;
      expect(caughtError.response?.status).toBe(400);
      expect(caughtError.response?.data).toEqual({
        error: 'isPrivate required',
      });
    }
  });
});

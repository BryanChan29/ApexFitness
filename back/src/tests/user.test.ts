import axios, { AxiosError } from 'axios';
import { open } from 'sqlite';
import * as url from 'url';
import sqlite3 from 'sqlite3';

let port = 3000;
let host = 'localhost';
let protocol = 'http';
let baseUrl = `${protocol}://${host}:${port}/api`;
let __dirname = url.fileURLToPath(new URL('../..', import.meta.url));
let dbfile = `${__dirname}database.db`;
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
  await db.run('DELETE FROM users;');
  await db.run("DELETE FROM sqlite_sequence WHERE name='users';");
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

describe('User API', () => {
  test('PUT /user - Update user successfully', async () => {
    const registerRes = await axios.post(`${baseUrl}/register`, {
      email: 'test@example.com',
      username: 'testuser',
      password: 'TestPass123',
    });

    expect(registerRes.status).toBe(200);
    expect(registerRes.data.message).toBe('Signup successful');
    expect(registerRes.data.user_id).toBeDefined();

    const userId = registerRes.data.user_id;

    const updateRes = await axios.put(`${baseUrl}/user`, {
      id: userId,
      email: 'updated@example.com',
      username: 'updatedUser',
      password: 'NewPass123',
      current_weight: 70,
      goal_weight: 65,
      height: 180,
      age: 25,
      activity_level: 'Active',
    });

    expect(updateRes.status).toBe(200);
    expect(updateRes.data.message).toContain(
      `User ${userId} updated successfully`
    );
  });

  test('PUT /user - Fail to update non-existent user', async () => {
    try {
      await axios.put(`${baseUrl}/user`, {
        id: '550e8400-e29b-41d4-a716-446655440000', // Fake UUID
        email: 'new@example.com',
        username: 'newuser',
        password: 'NewPass123',
      });
    } catch (error) {
      const caughtError = error as AxiosError;
      expect(caughtError.response?.status).toBe(404);
      expect(caughtError.response?.data).toEqual({
        error: 'No user found with ID 550e8400-e29b-41d4-a716-446655440000',
      });
    }
  });

  test('PUT /user - Fail to update with missing fields', async () => {
    const registerRes = await axios.post(`${baseUrl}/register`, {
      email: 'test@example.com',
      username: 'testuser',
      password: 'TestPass123',
    });

    expect(registerRes.status).toBe(200);
    expect(registerRes.data.user_id).toBeDefined();
    const userId = registerRes.data.user_id;

    try {
      await axios.put(`${baseUrl}/user`, {
        id: userId,
      });
    } catch (error) {
      const caughtError = error as AxiosError;
      expect(caughtError.response?.status).toBe(400);
      expect(caughtError.response?.data).toEqual({
        error: 'Email required',
      });
    }
  });
});

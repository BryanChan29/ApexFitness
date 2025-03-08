import axios, { AxiosError } from 'axios';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import * as url from 'url';

// Set up base URL
const port = 3000;
const host = 'localhost';
const protocol = 'http';
const baseUrl = `${protocol}://${host}:${port}/api`;

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
// Assume that initializeDb, resetDb, and closeDb functions exist as in your test file
// and that your server is running separately for testing.

describe('GET /api/user endpoint', () => {
  test('should return 401 if no token is provided', async () => {
    try {
      // Call GET /api/user without any Cookie header.
      await axios.get(`${baseUrl}/user?id=some-id`, { withCredentials: true });
      // If no error thrown, fail the test.
      throw new Error('Request should have failed with 401');
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toBe(401);
      expect(err.response?.data).toEqual({ error: 'Not authenticated' });
    }
  });

  test('should return 401 if an invalid token is provided', async () => {
    try {
      await axios.get(`${baseUrl}/user?id=some-id`, {
        withCredentials: true,
        headers: { Cookie: `token=invalidtoken` },
      });
      throw new Error('Request should have failed with 401');
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toBe(401);
      expect(err.response?.data).toEqual({ error: 'Not authenticated' });
    }
  });

  test('should return user data when a valid token is provided', async () => {
    // Register a new user so we have a valid token and user in the database.
    const registerRes = await axios.post(
      `${baseUrl}/register`,
      {
        email: 'test@example.com',
        username: 'testuser',
        password: 'TestPass123',
      },
      { withCredentials: true }
    );
    expect(registerRes.status).toBe(200);
    expect(registerRes.data.user_id).toBeDefined();

    // Extract the token from the response header.
    // Note: The method of extraction depends on your server's header formatting.
    const setCookieHeader = registerRes.headers['set-cookie'];
    if (!setCookieHeader || !setCookieHeader.length) {
      throw new Error('No cookie set on registration');
    }
    // Example: token=abc123; Path=/; HttpOnly; Secure; SameSite=Strict
    const token = setCookieHeader[0].split(';')[0].split('=')[1];

    // Now call GET /api/user with a valid token.
    const getRes = await axios.get(`${baseUrl}/user?id=${registerRes.data.user_id}`, {
      withCredentials: true,
      headers: { Cookie: `token=${token}` },
    });
    expect(getRes.status).toBe(200);
    expect(getRes.data.email).toBe('test@example.com');
  });
});

describe('PATCH /api/user/metrics endpoint', () => {
  test('should return 401 if no token is provided', async () => {
    try {
      await axios.patch(
        `${baseUrl}/user/metrics`,
        { current_weight: 70, goal_weight: 65 },
        { withCredentials: true }
      );
      throw new Error('Request should have failed with 401');
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response?.status).toBe(401);
      expect(err.response?.data).toEqual({ error: 'Not authenticated' });
    }
  });

  test('should update metrics successfully with a valid token', async () => {
    // Register a new user.
    const registerRes = await axios.post(
      `${baseUrl}/register`,
      {
        email: 'test2@example.com',
        username: 'testuser2',
        password: 'TestPass123',
      },
      { withCredentials: true }
    );
    expect(registerRes.status).toBe(200);
    const userId = registerRes.data.user_id;
    const setCookieHeader = registerRes.headers['set-cookie'];
    if (!setCookieHeader || !setCookieHeader.length) {
      throw new Error('No cookie set on registration');
    }
    const token = setCookieHeader[0].split(';')[0].split('=')[1];

    // Prepare payload with new metrics.
    const payload = {
      current_weight: 70,
      goal_weight: 65,
      height: 180,
      age: 30,
      activity_level: 'Active',
    };

    // Call PATCH /api/user/metrics with the valid token.
    const patchRes = await axios.patch(`${baseUrl}/user/metrics`, payload, {
      withCredentials: true,
      headers: { Cookie: `token=${token}` },
    });
    expect(patchRes.status).toBe(200);
    expect(patchRes.data.current_weight).toBe(70);
    expect(patchRes.data.goal_weight).toBe(65);
    expect(patchRes.data.height).toBe(180);
    expect(patchRes.data.age).toBe(30);
    expect(patchRes.data.activity_level).toBe('Active');
  });
});

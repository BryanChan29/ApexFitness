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

describe('Authentication API', () => {
  let userId: string = '';

  test('POST /register - Register a new user', async () => {
    const res = await axios.post(`${baseUrl}/register`, {
      email: 'test@example.com',
      username: 'testuser',
      password: 'TestPass123',
    });

    expect(res.status).toBe(200);
    expect(res.data.message).toBe('Signup successful');
    expect(res.data.user_id).toBeDefined();

    userId = res.data.user_id; // Capture UUID for future tests
    console.log('Registered User ID:', userId);

    // Ensure user exists in the database
    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    expect(user).not.toBeUndefined();
  });

  test('POST /register - Fail to register with duplicate email', async () => {
    await axios.post(`${baseUrl}/register`, {
      email: 'test@example.com',
      username: 'testuser',
      password: 'TestPass123',
    });

    try {
      await axios.post(`${baseUrl}/register`, {
        email: 'test@example.com', // Same email
        username: 'testuser2',
        password: 'TestPass456',
      });
    } catch (error) {
      const caughtError = error as AxiosError;
      expect(caughtError.response?.status).toBe(400);
      expect(caughtError.response?.data).toEqual({
        error: 'Email already registered',
      });
    }
  });

  test('POST /login - Successful login', async () => {
    await axios.post(`${baseUrl}/register`, {
      email: 'test@example.com',
      username: 'testuser',
      password: 'TestPass123',
    });

    const res = await axios.post(
      `${baseUrl}/login`,
      {
        email: 'test@example.com',
        password: 'TestPass123', // Ensure this matches exactly
      },
      { withCredentials: true }
    );

    expect(res.status).toBe(200);
    expect(res.data.message).toBe('Login successful');
    expect(res.data.user.email).toBe('test@example.com');

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies?.some((cookie) => cookie.startsWith('token='))).toBe(true);
  });

  test('GET /auth/check - User is authenticated', async () => {
    const registerRes = await axios.post(`${baseUrl}/register`, {
      email: 'test@example.com',
      username: 'testuser',
      password: 'TestPass123',
    });

    const loginRes = await axios.post(
      `${baseUrl}/login`,
      {
        email: 'test@example.com',
        password: 'TestPass123',
      },
      { withCredentials: true }
    );

    const token = loginRes.headers['set-cookie'];

    const res = await axios.get(`${baseUrl}/auth/check`, {
      headers: { Cookie: token },
      withCredentials: true,
    });

    expect(res.status).toBe(200);
    expect(res.data.loggedIn).toBe(true);
  });

  test('POST /logout - Successful logout', async () => {
    const registerRes = await axios.post(`${baseUrl}/register`, {
      email: 'test@example.com',
      username: 'testuser',
      password: 'TestPass123',
    });

    const loginRes = await axios.post(
      `${baseUrl}/login`,
      {
        email: 'test@example.com',
        password: 'TestPass123',
      },
      { withCredentials: true }
    );

    const token = loginRes.headers['set-cookie'];

    const res = await axios.post(
      `${baseUrl}/logout`,
      {},
      {
        headers: { Cookie: token },
        withCredentials: true,
      }
    );

    expect(res.status).toBe(200);
    expect(res.data.message).toBe('Logout successful');
  });

  test('POST /login - Fail with incorrect password', async () => {
    await axios.post(`${baseUrl}/register`, {
      email: 'test@example.com',
      username: 'testuser',
      password: 'TestPass123',
    });

    try {
      await axios.post(`${baseUrl}/login`, {
        email: 'test@example.com',
        password: 'WrongPass',
      });
    } catch (error) {
      const caughtError = error as AxiosError;
      expect(caughtError.response?.status).toBe(400);
    }
  });

  test('POST /login - Fail with non-existent email', async () => {
    try {
      await axios.post(`${baseUrl}/login`, {
        email: 'doesnotexist@example.com',
        password: 'RandomPass123',
      });
    } catch (error) {
      const caughtError = error as AxiosError;
      expect(caughtError.response?.status).toBe(404);
    }
  });

  test('POST /logout - Fail when not logged in', async () => {
    try {
      await axios.post(`${baseUrl}/logout`);
    } catch (error) {
      const caughtError = error as AxiosError;
      expect(caughtError.response?.status).toBe(400);
    }
  });

  test('GET /auth/check - User is not authenticated', async () => {
    try {
      await axios.get(`${baseUrl}/auth/check`, {
        withCredentials: true,
      });
    } catch (error) {
      const caughtError = error as AxiosError;
      console.log(
        'Error response:',
        caughtError.response?.status,
        caughtError.response?.data
      ); // Debugging
      expect(caughtError.response?.status).toBe(401);
      expect(caughtError.response?.data).toEqual({
        loggedIn: false,
        error: 'Not authenticated',
      });
    }
  });
});

import express, { Response, Request, CookieOptions } from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import * as url from 'url';
import { DBDailyFoodItem, User } from '@apex/shared';
import * as crypto from 'crypto';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import argon2 from 'argon2';
import * as dotenv from 'dotenv';
import path from 'path';

const __filename = url.fileURLToPath(import.meta.url);
const __curr_dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__curr_dirname, '../../.env') });

if (
  !process.env.FATSECRET_CONSUMER_KEY ||
  !process.env.FATSECRET_CLIENT_SECRET
) {
  throw new Error(
    'FATSECRET_CONSUMER_KEY and/or FATSECRET_CLIENT_SECRET is not defined in .env file'
  );
}

let app = express();
app.use(express.json());
const requestRouter = express.Router();

const __dirname = url.fileURLToPath(new URL('..', import.meta.url));
const dbfile = `${__dirname}database.db`;
const db = await open({
  filename: dbfile,
  driver: sqlite3.Database,
});
await db.get('PRAGMA foreign_keys = ON');

const tokenStorage: { [key: string]: string } = {};
function makeToken() {
  return crypto.randomBytes(32).toString('hex');
}

function validateLogin(body: { email: string; password?: string }) {
  return body.email && body.password !== undefined;
}

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

app.use(cookieParser());

const FATSECRET_API_URL = 'https://platform.fatsecret.com/rest/server.api';
const FATSECRET_TOKEN_URL = 'https://oauth.fatsecret.com/connect/token';
let fatSecretAccessToken: string | null = null;
let tokenExpiryTime: number | null = null;

async function getFatSecretAccessToken() {
  if (fatSecretAccessToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
    return fatSecretAccessToken;
  }

  try {
    const response = await axios.post(
      FATSECRET_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'premier',
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: process.env.FATSECRET_CLIENT_ID!,
          password: process.env.FATSECRET_CLIENT_SECRET!,
        },
      }
    );

    fatSecretAccessToken = response.data.access_token;
    tokenExpiryTime = Date.now() + response.data.expires_in * 1000;
    return fatSecretAccessToken;
  } catch (error) {
    console.error('Error fetching FatSecret access token:', error);
    throw new Error('Failed to obtain FatSecret access token');
  }
}

// Middleware to ensure we have a valid FatSecret token before making API calls
async function authenticateFatSecret(req: Request, res: Response, next: any) {
  try {
    const accessToken = await getFatSecretAccessToken();
    if (accessToken) {
      req.accessToken = accessToken;
      next();
    } else {
      res.status(500).json({ error: 'Failed to obtain FatSecret access token' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Authentication with FatSecret failed' });
  }
}

app.post('/api/register', async (req, res) => {
  const { email, username, password } = req.body;

  if (!validateLogin(req.body)) {
    console.log('Invalid input:', req.body);
    return res
      .status(400)
      .json({ error: 'Email, Username, and Password are required' });
  }

  // Parameterized query to prevent SQL injection
  const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [
    email,
  ]);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  // Generate a unique user ID (UUID)
  const uid = crypto.randomUUID(); // Example: "550e8400-e29b-41d4-a716-446655440000"

  // Hash the user password
  let hash: string;
  try {
    hash = await argon2.hash(password);
  } catch (error) {
    console.log('Hashing failed', error);
    return res.sendStatus(500);
  }

  // Insert the new user into the database
  try {
    const statement = await db.prepare(
      'INSERT INTO users (id, email, username, password, current_weight, goal_weight, height, age, activity_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    await statement.run(
      uid,
      email,
      username,
      hash,
      null,
      null,
      null,
      null,
      null
    );

    console.log('Inserted user:', uid);
  } catch (error) {
    console.log('Insert error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }

  const token = makeToken();
  tokenStorage[token] = email;

  return res
    .cookie('token', token, cookieOptions)
    .json({ message: 'Signup successful', user_id: uid });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!validateLogin(req.body)) {
    return res.sendStatus(400);
  }

  let result;
  try {
    result = await db.get('SELECT id, password FROM users WHERE email = ?', [
      email,
    ]);
  } catch (error) {
    console.error('Select failed', error);
    return res.sendStatus(500);
  }

  if (!result) {
    return res.sendStatus(404);
  }

  const hash = result.password;

  let verifyResult;
  try {
    verifyResult = await argon2.verify(hash, password);
  } catch (error) {
    console.error('Verification failed', error);
    return res.sendStatus(500);
  }

  if (!verifyResult) {
    return res.sendStatus(400);
  }

  const token = makeToken();
  tokenStorage[token] = email;
  res.cookie('token', token, cookieOptions);

  return res.json({
    message: 'Login successful',
    user: { email: email, id: result.id },
  });
});

app.post('/api/logout', (req, res) => {
  const { token } = req.cookies;
  if (!token || !tokenStorage[token]) {
    return res.sendStatus(400); // Already logged out or invalid token
  }
  delete tokenStorage[token];
  return res
    .clearCookie('token', cookieOptions)
    .json({ message: 'Logout successful' });
});

app.put('/api/user', async (req: { body: User }, res) => {
  const {
    id, // Now a UUID instead of an integer
    email,
    username,
    password,
    current_weight,
    goal_weight,
    height,
    age,
    activity_level,
  } = req.body;

  const validateRequest = () => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return 'ID, Email, Username, and Password are required';
    }
    if (!id) return 'User ID required';
    if (!email) return 'Email required';
    if (!username) return 'Username required';
    if (!password) return 'Password required';
    return null;
  };

  const validationError = validateRequest();
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    // Check if user exists
    const existingUser = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!existingUser) {
      return res.status(404).json({ error: `No user found with ID ${id}` });
    }

    // Prepare the update query
    const statement = await db.prepare(
      `UPDATE users 
       SET email = ?, username = ?, password = ?, current_weight = ?, goal_weight = ?, height = ?, age = ?, activity_level = ? 
       WHERE id = ?`
    );

    await statement.run(
      email,
      username,
      password,
      current_weight,
      goal_weight,
      height,
      age,
      activity_level,
      id
    );

    return res
      .status(200)
      .json({ message: `User ${id} updated successfully!` });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/auth/check', (req, res) => {
  const { token } = req.cookies; // Get the token from cookies

  if (!token || !tokenStorage[token]) {
    return res
      .status(401)
      .json({ loggedIn: false, error: 'Not authenticated' });
  }

  return res.json({ loggedIn: true });
});

requestRouter.get('/daily_food', async (req, res) => {
  // TODO: work on permissions, but for now just return everything in `daily_food` table
  let result: DBDailyFoodItem[];

  try {
    result = await db.all('SELECT * FROM daily_food');
    if (result.length === 0) {
      return res.status(404).json({ error: 'No meals found' });
    }
  } catch (err) {
    const error = err as object;
    return res.status(500).json({ error: error.toString() });
  }

  return res.json({ result });
});

requestRouter.get('/meal_plan/:id', async (req, res) => {
  // TODO: work on permissions, but for now just return everything in `daily_food` table
  let result: DBDailyFoodItem[];
  // ? Do an inner join, first get all meals associated with the meal plan
  // ? Then do another inner join, get all daily foods associated with each meal
  // ? then return..?
  try {
    result = await db.all('SELECT * FROM daily_food');
    if (result.length === 0) {
      return res.status(404).json({ error: 'No meals found' });
    }
  } catch (err) {
    const error = err as object;
    return res.status(500).json({ error: error.toString() });
  }

  return res.json({ result });
});

requestRouter.get('/meals/:id', async (req, res) => {
  // TODO: work on permissions, but for now just return everything in `daily_food` table
  // ! This route might not actually be valid... Made this just to test meals/inner joins
  let result: DBDailyFoodItem[];
  const mealId = parseInt(req.params.id, 10);
  if (isNaN(mealId)) {
    return res.status(400).json({ error: 'Invalid Meal Id' });
  }

  const query = `
    SELECT df.*
    FROM daily_food df
    INNER JOIN meal_items mi ON df.id = mi.food_id
    INNER JOIN meals m ON mi.meal_id = m.id
    WHERE m.id = ?;
  `;

  try {
    result = await db.all(query, [mealId]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'No meals found' });
    }
  } catch (err) {
    const error = err as object;
    return res.status(500).json({ error: error.toString() });
  }

  return res.json({ result });
});

// Replace previous API calls with OAuth2 authorization header
app.get('/api/search-food', authenticateFatSecret, async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;

    const params = {
      method: 'foods.search',
      search_expression: query,
      format: 'json',
      max_results: 10,
      include_food_attributes: 1,
      flag_default_serving: 1,
    };

    const response = await axios.get(FATSECRET_API_URL, {
      headers: {
        Authorization: `Bearer ${req.accessToken}`,
      },
      params: params,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching food data:', error);
    res.status(500).json({ error: 'Failed to fetch food data' });
  }
});

app.get('/api/food-detail', authenticateFatSecret, async (req: Request, res: Response) => {
  try {
    const foodId = req.query.foodId as string;

    const params = {
      method: 'food.get.v2',
      food_id: foodId,
      format: 'json',
    };

    const response = await axios.get(FATSECRET_API_URL, {
      headers: {
        Authorization: `Bearer ${req.accessToken}`,
      },
      params: params,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching food detail:', error);
    res.status(500).json({ error: 'Failed to fetch food details' });
  }
});

// run server
let port = 3000;
let host = 'localhost';
let protocol = 'http';

app.use('/api', requestRouter);

app.listen(port, host, () => {
  console.log(`${protocol}://${host}:${port}`);
});

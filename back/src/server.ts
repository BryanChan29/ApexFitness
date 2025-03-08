import express, { Response, Request, CookieOptions } from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import * as url from 'url';
import {
  DBDailyFoodItem,
  UIDailyMeal,
  UIFormattedDailyFoodItem,
  UIFormattedMealPlan,
  User,
} from '@apex/shared';
import * as crypto from 'crypto';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import argon2 from 'argon2';
import * as dotenv from 'dotenv';
import path from 'path';

const __filename = url.fileURLToPath(import.meta.url);
const __curr_dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__curr_dirname, '../../.env') });

if (!process.env.FATSECRET_CLIENT_SECRET || !process.env.FATSECRET_CLIENT_ID) {
  throw new Error(
    'FATSECRET_CLIENT_ID and/or FATSECRET_CLIENT_SECRET is not defined in .env file'
  );
}
const BURN_API_URL = 'https://api.api-ninjas.com/v1/caloriesburned';
const BURN_API_KEY = '';

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

async function getUserIdFromCookies(
  token: string | undefined
): Promise<number | null> {
  // ! NEED TO AWAIT WHEN CALLING THIS (returns a promise)
  // * Used for meal_plan when a user wants to query all of their meal_plans
  if (!token) {
    console.log('No token provided');
    return null;
  }

  // Look up the email from tokenStorage
  const email = tokenStorage[token];
  if (!email) {
    console.log('Invalid or expired token');
    return null;
  }

  // Query the users table for the user ID
  try {
    const user = await db.get('SELECT id FROM users WHERE email = ?', [email]);

    if (user) {
      return user.id;
    } else {
      console.log('User not found in the database');
      return null;
    }
  } catch (error) {
    console.error('Database query error:', error);
    return null;
  }
}

// Auth
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
      res
        .status(500)
        .json({ error: 'Failed to obtain FatSecret access token' });
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

app.post('/api/meal_plan', async (req, res) => {
  console.log('body:' + JSON.stringify(req.body));
  const { name, isPrivate } = req.body;
  const validateRequest = () => {
    if (!req.body || Object.keys(req.body).length === 0)
      return 'Name and isPrivate required';
    if (isPrivate === undefined || isPrivate === null)
      return 'isPrivate required';
    if (!name) return 'Name required';
    return null;
  };

  const validationError = validateRequest();
  if (validationError) {
    console.log(validationError);
    return res.status(400).json({ error: validationError });
  }
  try {
    const statement = await db.prepare(
      'INSERT INTO meal_plans (name, is_private) VALUES (?, ?)'
    );
    const result = await statement.run(name, isPrivate);

    console.log('Inserted Meal Plan ID:', result.lastID);
    return res.json({
      message: 'Meal plan created successful',
      mealID: result.lastID,
    });
  } catch (error) {
    console.log('Insert error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/meal_plan', async (req, res) => {
  const { id, name, isPrivate } = req.body;

  const validateRequest = () => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return 'Meal Plan ID, Name and isPrivate values are required';
    }
    if (!id) return 'Meal Plan ID required';
    if (!name) return 'Meal Plan Name required';
    if (isPrivate === undefined || isPrivate === null)
      return 'isPrivate required';
    return null;
  };

  const validationError = validateRequest();
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    // Check if user exists
    const existingMealPlan = await db.get(
      'SELECT * FROM meal_plans WHERE id = ?',
      [id]
    );
    if (!existingMealPlan) {
      return res
        .status(404)
        .json({ error: `No meal plan found with ID ${id}` });
    }

    // Prepare the update query
    const statement = await db.prepare(
      `UPDATE meal_plans 
       SET name = ?, is_private = ? 
       WHERE id = ?`
    );

    await statement.run(name, isPrivate, id);

    return res
      .status(200)
      .json({ message: `Meal Plan ${id} updated successfully!` });
  } catch (error) {
    console.error('Error updating meal plan:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
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
  let result: { day_of_week: string; daily_foods: string; name: string }[];
  const mealPlanId = parseInt(req.params.id, 10);
  if (isNaN(mealPlanId)) {
    return res.status(400).json({ error: 'Invalid Meal Plan ID' });
  }

  const query = `
    SELECT 
        mpi.day_of_week,
        mp.name,
        json_group_array(
            json_object(
                'name', df.name,
                'meal_type', df.meal_type,
                'calories', df.calories,
                'carbs', df.carbs,
                'fat', df.fat,
                'protein', df.protein,
                'sodium', df.sodium,
                'sugar', df.sugar
            )
        ) AS daily_foods
    FROM meal_plans mp
    LEFT JOIN meal_plan_items mpi ON mp.id = mpi.meal_plan_id
    LEFT JOIN meals m ON mpi.meal_id = m.id
    LEFT JOIN meal_items mi ON m.id = mi.meal_id
    LEFT JOIN daily_food df ON mi.food_id = df.id
    WHERE mp.id = ?
    GROUP BY mpi.day_of_week;
  `;

  try {
    result = await db.all(query, [mealPlanId]);

    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    const formattedMealPlan: Partial<UIFormattedMealPlan> = {};
    const mealPlanName = result[0].name;

    result.forEach((row) => {
      const dayOfWeek =
        row.day_of_week.toLowerCase() as keyof UIFormattedMealPlan; // Use day_of_week directly

      if (!formattedMealPlan[dayOfWeek]) {
        formattedMealPlan[dayOfWeek] = {
          breakfast: [],
          lunch: [],
          dinner: [],
          snack: [],
        };
      }

      const dailyFoods: UIFormattedDailyFoodItem[] = row.daily_foods
        ? JSON.parse(row.daily_foods)
        : [];

      dailyFoods.forEach((food) => {
        const mealType = food.meal_type.toLowerCase() as keyof UIDailyMeal;
        formattedMealPlan[dayOfWeek]![mealType].push(food);
      });
    });

    return res.json({ name: mealPlanName, result: formattedMealPlan });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.toString() });
  }
});

requestRouter.get('/user/meal_plan', async (req, res) => {
  const userId = await getUserIdFromCookies(req.cookies.token);

  console.log(userId);

  if (!userId) {
    return res.status(400).json({ error: 'Invalid User ID' });
  }

  const query = `
    SELECT DISTINCT mp.id AS meal_plan_id
    FROM meal_plans mp
    JOIN meal_plan_items mpi ON mp.id = mpi.meal_plan_id
    JOIN meals m ON mpi.meal_id = m.id
    JOIN meal_items mi ON m.id = mi.meal_id
    JOIN daily_food df ON mi.food_id = df.id
    WHERE df.user_id = ?;
  `;

  try {
    const result = await db.all(query, [userId]);

    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'No meal plans found' });
    }
    console.log('result', result);

    return res.json({
      meal_plan_ids: result.map((row) => row.meal_plan_id),
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.toString() });
  }
});

requestRouter.get('/meals/:id', async (req, res) => {
  // TODO: work on permissions
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
app.get(
  '/api/search-food',
  authenticateFatSecret,
  async (req: Request, res: Response) => {
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
  }
);

requestRouter.get('/meal_plans', async (req, res) => {
  let result;
  try {
    result = await db.all('SELECT * FROM meal_plans WHERE is_private = 0;');

    if (!result || result.length === 0) {
      console.log('public meal plans found.');
      return res.status(404).json({ error: 'No public meal plans found' });
    }

    return res.json({ result });
  } catch (err: any) {
    console.error('Error in /meal_plans:', err);
    return res.status(500).json({ error: err.toString() });
  }
});

app.get(
  '/api/food-detail',
  authenticateFatSecret,
  async (req: Request, res: Response) => {
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
  }
);

app.get('/api/user', async (req: Request, res: Response) => {
  // Retrieve token from cookies
  const { token } = req.cookies;
  if (!token || !tokenStorage[token]) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Look up the user's email based on the token
  const userEmail = tokenStorage[token];

  try {
    // Query the database for the user by email
    const user = await db.get('SELECT * FROM users WHERE email = ?', [
      userEmail,
    ]);
    if (!user) {
      return res
        .status(404)
        .json({ error: `No user found with email ${userEmail}` });
    }
    // Return the user object (all fields)
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH endpoint for updating body metrics
app.patch('/api/user/metrics', async (req: Request, res: Response) => {
  // Retrieve token from cookies (make sure cookie-parser middleware is enabled)
  const { token } = req.cookies;
  if (!token || !tokenStorage[token]) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Retrieve the user's email from the token storage
  const userEmail = tokenStorage[token];

  try {
    // Get the existing user record by email
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [
      userEmail,
    ]);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract only the body metrics from the request body
    const { current_weight, goal_weight, height, age, activity_level } =
      req.body;

    // Update the user record with new metrics, preserving fields that are not provided
    await db.run(
      `UPDATE users 
       SET 
         current_weight = COALESCE(?, current_weight),
         goal_weight = COALESCE(?, goal_weight),
         height = COALESCE(?, height),
         age = COALESCE(?, age),
         activity_level = COALESCE(?, activity_level)
       WHERE email = ?`,
      current_weight,
      goal_weight,
      height,
      age,
      activity_level,
      userEmail
    );

    // Retrieve the updated user record and return it
    const updatedUser = await db.get('SELECT * FROM users WHERE email = ?', [
      userEmail,
    ]);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating metrics:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Workouts Endpoints
app.post('/api/workouts', async (req, res) => {
  const { name, date, exercises } = req.body;
  const userId = await getUserIdFromCookies(req.cookies.token);

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (!name || !date) {
    return res.status(400).json({ error: 'Name and date are required' });
  }

  try {
    const workoutStatement = await db.prepare(
      'INSERT INTO workouts (user_id, name, date) VALUES (?, ?, ?)'
    );
    const workoutResult = await workoutStatement.run(userId, name, date);
    const workoutId = workoutResult.lastID;

    if (exercises && Array.isArray(exercises)) {
      for (const exercise of exercises) {
        let exerciseStatement;
        let exerciseResult;
        if (exercise.hasOwnProperty('caloriesBurned')) {
          exerciseStatement = await db.prepare(
            'INSERT INTO exercises (name_of_workout, duration, calories_per_hour) VALUES (?, ?, ?)'
          );
          exerciseResult = await exerciseStatement.run(
            exercise.workoutType,
            exercise.duration,
            exercise.caloriesBurned
          );
        } else {
          exerciseStatement = await db.prepare(
            'INSERT INTO exercises (name_of_workout, sets, reps, weight) VALUES (?, ?, ?, ?)'
          );
          exerciseResult = await exerciseStatement.run(
            exercise.workoutType,
            exercise.sets,
            exercise.reps,
            exercise.weight
          );
        }

        const exerciseId = exerciseResult.lastID;

        const workoutExerciseStatement = await db.prepare(
          'INSERT INTO workout_exercises (workout_id, exercise_id) VALUES (?, ?)'
        );
        await workoutExerciseStatement.run(workoutId, exerciseId);
      }
    }

    return res.json({
      message: 'Workout created successfully',
      workoutId: workoutId,
    });
  } catch (error) {
    console.error('Error creating workout:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/workouts', async (req, res) => {
  const userId = await getUserIdFromCookies(req.cookies.token);

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const workouts = await db.all('SELECT * FROM workouts WHERE user_id = ?', [
      userId,
    ]);
    return res.json({ workouts });
  } catch (error) {
    console.error('Error retrieving workouts:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/workouts/:workoutId/exercises', async (req, res) => {
  const { name_of_workout, muscle_worked, duration, sets, reps, weight } =
    req.body;
  const workoutId = parseInt(req.params.workoutId, 10);

  if (isNaN(workoutId)) {
    return res.status(400).json({ error: 'Invalid workout ID' });
  }

  if (!name_of_workout) {
    return res.status(400).json({ error: 'Exercise name is required' });
  }

  try {
    const exerciseStatement = await db.prepare(
      'INSERT INTO exercises (name_of_workout, muscle_worked, duration, sets, reps, weight) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const exerciseResult = await exerciseStatement.run(
      name_of_workout,
      muscle_worked,
      duration,
      sets,
      reps,
      weight
    );

    const workoutExerciseStatement = await db.prepare(
      'INSERT INTO workout_exercises (workout_id, exercise_id) VALUES (?, ?)'
    );
    await workoutExerciseStatement.run(workoutId, exerciseResult.lastID);

    return res.json({
      message: 'Exercise added to workout successfully',
    });
  } catch (error) {
    console.error('Error adding exercise to workout:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/workouts/:workoutId/exercises', async (req, res) => {
  const workoutId = parseInt(req.params.workoutId, 10);

  if (isNaN(workoutId)) {
    return res.status(400).json({ error: 'Invalid workout ID' });
  }

  try {
    const exercises = await db.all(
      `SELECT e.* FROM exercises e JOIN workout_exercises we ON e.id = we.exercise_id WHERE we.workout_id = ?`,
      [workoutId]
    );
    return res.json({ exercises });
  } catch (error) {
    console.error('Error retrieving exercises:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/calories-burned', async (req: Request, res: Response) => {
  try {
    // console.log('Burn handler');
    const activity = req.query.activity as string;
    if (!activity) {
      return res.status(400).json({ error: 'Activity parameter is required' });
    }

    // Actual API call
    const api_url = `${BURN_API_URL}?activity=${encodeURIComponent(activity)}`;

    const response = await axios.get(api_url, {
      headers: { 'X-Api-Key': BURN_API_KEY },
    });

    if (response.status === 200) {
      res.json(response.data);
    } else {
      res.status(response.status).json({ error: response.data });
    }
  } catch (error) {
    console.error('Error fetching calories burned data:', error);
    res.status(500).json({ error: 'Failed to fetch calories burned data' });
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

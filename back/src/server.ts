import express, { Response, Request } from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import * as url from 'url';
import { DBDailyFoodItem } from '@apex/shared';
import * as crypto from 'crypto';
import axios from 'axios';

const FATSECRET_CONSUMER_KEY = 'key_here';
const FATSECRET_SHARED_SECRET = 'key_here';
const FATSECRET_API_URL = 'https://platform.fatsecret.com/rest/server.api';

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

function generateOAuthSignature(url: string, method: string, params: any) {
  const oauthParams = {
    oauth_consumer_key: FATSECRET_CONSUMER_KEY,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000),
    oauth_version: '1.0',
  };

  const allParams = { ...params, ...oauthParams };

  // Sort and encode parameters
  const sortedParams = Object.keys(allParams)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key])}`)
    .join('&');

  const baseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
  const signingKey = `${encodeURIComponent(FATSECRET_SHARED_SECRET)}&`;
  const signature = crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');

  return { ...oauthParams, oauth_signature: signature };
}

app.get('/api/search-food', async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;

    const params = {
      method: 'foods.search',
      search_expression: query,
      format: 'json',
      max_results: 10,
    };

    const oauthParams = generateOAuthSignature(FATSECRET_API_URL, 'GET', params);

    const response = await axios.get(FATSECRET_API_URL, {
      params: { ...params, ...oauthParams },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching food data:', error);
    res.status(500).json({ error: 'Failed to fetch food data' });
  }
});

app.get('/api/food-detail', async (req: Request, res: Response) => {
  try {
    const foodId = req.query.foodId as string;

    const params = {
      method: 'food.get.v2',
      food_id: foodId,
      format: 'json',
    };

    const oauthParams = generateOAuthSignature(FATSECRET_API_URL, 'GET', params);

    const response = await axios.get(FATSECRET_API_URL, {
      params: { ...params, ...oauthParams },
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

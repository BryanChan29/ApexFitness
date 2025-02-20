import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import * as url from 'url';
import { DBDailyFoodItem } from '@apex/shared';

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

// run server
let port = 3000;
let host = 'localhost';
let protocol = 'http';

app.use('/api', requestRouter);

app.listen(port, host, () => {
  console.log(`${protocol}://${host}:${port}`);
});

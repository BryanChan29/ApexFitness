import * as crypto from 'crypto';
import express, { Response, Request } from 'express';
import axios from 'axios';

const FATSECRET_CONSUMER_KEY = 'key_here';
const FATSECRET_SHARED_SECRET = 'key_here';
const FATSECRET_API_URL = 'https://platform.fatsecret.com/rest/server.api';

let app = express();
app.use(express.json());

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

let port = 3000;
let host = 'localhost';
let protocol = 'http';
app.listen(port, host, () => {
  console.log(`${protocol}://${host}:${port}`);
});

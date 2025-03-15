# ApexFitness
## CS478 Group Project

## SETUP API KEYS
Creare a file called `.env` file in the root directory. Copy the contents of `.env_sample` into it and replace with your respective keys

It will look like:
```
FATSECRET_CLIENT_ID=your-key-here
FATSECRET_CLIENT_SECRET=your-key-here
BURN_API_KEY=your-key-here
```


## How to run: 
`cd front`

`npm i`

`npm run dev`

Paste the resulting localhost URL into your browser. 

## In another terminal instance

`cd back`

`npm i`

`npm run watch`

This will continuously check for changes in the backend.

## In another (third) terminal instance
`cd shared`

`npm i`

to install dependencies for our shared library
# ApexFitness
## CS478 Group Project

## SETUP API KEYS
Replace the contents of the `.env` file in the root directory

It will look like:
```
FATSECRET_CONSUMER_KEY=abc-123
FATSECRET_SHARED_SECRET=123-abc
FATSECRET_CLIENT_SECRET=cba-321
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
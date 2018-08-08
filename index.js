require('dotenv').config();
const express = require('express');
const { middleware, JSONParseError, SignatureValidationFailed } = require('@line/bot-sdk');

const app = express();

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN, // from environment variable Set access token
  channelSecret: process.env.LINE_CHANNEL_SECRET, // Setting channel secret from environment variable
};
console.log(config);

app.get('/', (req, res) => res.send('OK'));

app.use(middleware(config));

app.post('/webhook', (req, res) => {
  res.json(req.body.events); // req.body will be webhook event object
});

app.use((err, req, res, next) => {
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature);
    return;
  }
  if (err instanceof JSONParseError) {
    res.status(400).send(err.raw);
    return;
  }
  next(err); // will throw default 500
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
  if (err) console.log(err);

  console.log(`App start on port${PORT}`);
});

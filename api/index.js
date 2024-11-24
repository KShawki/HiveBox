import express from 'express';
import cors from 'cors';
import temperature from './controllers/temperature.js';

const PORT = 3000;
const APP_VERSION = '0.0.2';

const app = express();
app.use(cors());

app.get('/', (_req, res) => {
  res.json('HiveBox!');
});

app.get('/version', (_req, res) => {
  res.json({ version: `v${APP_VERSION}` });
});

app.get('/temperature', temperature);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

export default app;

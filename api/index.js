import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (_req, res) => {
  res.json('Hello, World!');
});

app.get('/version', (_req, res) => {
  res.json('Current v0.0.1');
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

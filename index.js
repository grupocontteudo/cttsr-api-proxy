const express = require('express');
const axios = require('axios');
const { parse } = require('csv-parse/sync');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/semrush', async (req, res) => {
  const { phrase } = req.query;

  if (!phrase) return res.status(400).json({ error: 'Missing phrase' });

  try {
    const response = await axios.get('https://api.semrush.com/', {
      params: {
        type: 'phrase_this',
        key: process.env.SEMRUSH_API_KEY,
        phrase,
        database: 'br',
        export_columns: 'Ph,Nq,Cp,Co,Nr,Td'
      }
    });

    const csv = response.data;
    const records = parse(csv, {
      columns: true,
      skip_empty_lines: true
    });

    res.json(records);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch from SEMrush' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

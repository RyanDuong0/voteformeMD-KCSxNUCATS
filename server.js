require('dotenv').config();
const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Load tax rate data from CSV
let taxRates = [];

fs.createReadStream('data/tax_rates.csv')
  .pipe(csv())
  .on('data', (row) => taxRates.push(row))
  .on('end', () => {
    console.log('Tax rates loaded');
  });

// API Endpoint to check if server is running
app.get('/', (req, res) => {
    res.send('Sales Tax Calculator API is running');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
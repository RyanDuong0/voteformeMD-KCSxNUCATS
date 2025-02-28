require('dotenv').config();
const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let taxRates = [];

// Load tax rate data from CSV
fs.createReadStream('data/tax_rates.csv')
  .pipe(csv())
  .on('data', (row) => taxRates.push(row))
  .on('end', () => {
    console.log('Tax rates loaded');
  });

// API to calculate sales tax with overrides
app.post('/calculate-tax', (req, res) => {
  const { state, zip, price, productOverride, customerExempt, customTaxRate } = req.body;

  if (!state || !zip || !price) {
    return res.status(400).json({ message: "State, ZIP code, and price are required" });
  }

  const taxData = taxRates.find(rate => rate.State === state && rate.ZipCode === zip);

  if (!taxData) {
    return res.status(404).json({ message: "Tax rate not found for this location" });
  }

  let taxRate = parseFloat(taxData.EstimatedCombinedRate);

  // If a product has a tax exemption override, apply it
  if (productOverride === "exempt") {
    taxRate = 0;
  }

  // If a customer is tax-exempt, do not apply tax
  if (customerExempt) {
    taxRate = 0;
  }

  // If a custom tax rate is provided, use it instead
  if (customTaxRate) {
    taxRate = parseFloat(customTaxRate);
  }

  const taxAmount = price * taxRate;
  const totalPrice = price + taxAmount;

  res.json({
    priceBeforeTax: price,
    taxAmount: taxAmount.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
    appliedTaxRate: taxRate,
    breakdown: {
      stateTax: taxData.StateRate,
      countyTax: taxData.EstimatedCountyRate,
      cityTax: taxData.EstimatedCityRate,
      extraTax: taxData.EstimatedSpecialRate,
      totalTaxRate: taxRate,
    },
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));

let taxRates = [];

// Function to Load Tax Rate Data from CSV
const loadTaxRates = () => {
    taxRates = [];
    fs.createReadStream('data/tax_rates.csv')
        .pipe(csv())
        .on('data', (row) => taxRates.push(row))
        .on('end', () => {
            console.log(`✅ Loaded ${taxRates.length} tax records`);
        });
};

// Load CSV Data on Startup
loadTaxRates();

// Reload tax rates every 24 hours automatically
setInterval(() => {
    console.log("🔄 Reloading tax rates...");
    loadTaxRates();
}, 24 * 60 * 60 * 1000);

// Serve index.html by default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

// Reload Tax Rates Manually
app.post('/reload-tax-rates', (req, res) => {
    loadTaxRates();
    res.json({ message: "✅ Tax rates reloaded successfully" });
});

// Configure Multer for File Uploads
const upload = multer({ dest: 'uploads/' });

// Upload a New Tax Rate CSV File
app.post('/upload-tax-rates', upload.single('taxFile'), (req, res) => {
    const tempPath = req.file.path;
    const targetPath = 'data/tax_rates.csv';

    fs.rename(tempPath, targetPath, (err) => {
        if (err) {
            return res.status(500).json({ message: "❌ Error updating tax rates" });
        }
        loadTaxRates();
        res.json({ message: "✅ Tax rates updated successfully" });
    });
});

// Get Tax Rate for a State and ZIP Code
app.get('/tax-rates/:state/:zip', (req, res) => {
    const { state, zip } = req.params;
    const taxData = taxRates.find(rate => 
        rate.State?.trim().toUpperCase() === state.trim().toUpperCase() && 
        rate.ZipCode?.trim() === zip.trim()
    );

    if (!taxData) {
        return res.status(404).json({ message: "❌ Tax rate not found for this location" });
    }

    res.json({
        state: taxData.State,
        zip: taxData.ZipCode,
        stateTax: taxData.StateRate,
        countyTax: taxData.EstimatedCountyRate,
        cityTax: taxData.EstimatedCityRate,
        extraTax: taxData.EstimatedSpecialRate,
        totalTaxRate: taxData.EstimatedCombinedRate,
    });
});

// Calculate Sales Tax Based on Input Data
app.post('/calculate-tax', (req, res) => {
    const { state, zip, price, productOverride, customerExempt, customTaxRate } = req.body;

    if (!state || !zip || !price) {
        return res.status(400).json({ message: "❌ State, ZIP code, and price are required" });
    }

    const taxData = taxRates.find(rate => 
        rate.State?.trim().toUpperCase() === state.trim().toUpperCase() && 
        rate.ZipCode?.trim() === zip.trim()
    );

    if (!taxData) {
        return res.status(404).json({ message: "❌ Tax rate not found for this location" });
    }

    let taxRate = parseFloat(taxData.EstimatedCombinedRate);

    if (productOverride === "exempt" || customerExempt) {
        taxRate = 0;
    }
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

// Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/`);
});

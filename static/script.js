$(document).ready(function () {
    // Default tax rates for each country
    const taxRates = {
        "UK": 25, "IE": 12.5, "NL": 25.8, "BE": 25, "ZA": 27,
        "KE": 30, "CA": 15, "AU": 30, "FI": 20, "SE": 20.6
    };

    // Currency symbols mapping
    const currencySymbols = {
        "USD": "$",
        "GBP": "£",
        "EUR": "€",
        "CAD": "C$",
        "AUD": "A$"
    };

    let currentTaxRate = 0;
    let currentCurrency = "GBP"; // Default to GBP

    // Function to update the currency symbol
    function updateCurrency() {
        currentCurrency = $("#currency").val();
        const currencySymbol = currencySymbols[currentCurrency];

        // Update labels with the selected currency symbol
        $("label[for='price']").html(`Product Price (${currencySymbol})`);
        calculateTax();
    }

    // Function to update tax rate based on seller's location
    function updateTaxRate() {
        const sellerLocation = $("#sellerLocation").val();
        currentTaxRate = taxRates[sellerLocation] || 0;
        $("#salesTaxRate").val(currentTaxRate); // No percentage sign
        calculateTax();
    }

    // Function to calculate tax and update results
    function calculateTax() {
        const currencySymbol = currencySymbols[currentCurrency];
        const price = parseFloat($("#price").val()) || 0;
        const quantity = parseInt($("#quantity").val()) || 0;
        const subtotal = price * quantity;
        const salesTax = (subtotal * currentTaxRate) / 100;
        const totalPrice = subtotal + salesTax;

        $("#beforeTax").val(`${currencySymbol}${subtotal.toFixed(2)}`);
        $("#salesTax").val(`${currencySymbol}${salesTax.toFixed(2)}`);
        $("#totalPrice").val(`${currencySymbol}${totalPrice.toFixed(2)}`);
    }

    // Event listeners
    $("#currency").change(updateCurrency);
    $("#sellerLocation").change(updateTaxRate);
    $("#price, #quantity").on("input", calculateTax);

    // Initialize defaults
    updateCurrency();
    updateTaxRate();
});
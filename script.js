$(document).ready(function () {
    // Default tax rates by country
    const taxRates = {
        "UK": 20, "IE": 23, "NL": 21, "BE": 21, "ZA": 15,
        "KE": 16, "CA": 5, "AU": 10, "FI": 24, "SE": 25
    };

    let currentTaxRate = 0;

    // Update tax rate based on seller's location
    function updateTaxRate() {
        const sellerLocation = $("#sellerLocation").val();
        currentTaxRate = taxRates[sellerLocation] || 0;
        
        $("#salesTaxRate").val(`${currentTaxRate}%`); // Updates the new input box
        calculateTax();
    }

    // Calculate tax and update result fields
    function calculateTax() {
        const price = parseFloat($("#price").val()) || 0;
        const quantity = parseInt($("#quantity").val()) || 0;
        const subtotal = price * quantity;
        const salesTax = (subtotal * currentTaxRate) / 100;
        const totalPrice = subtotal + salesTax;

        $("#beforeTax").text(`$${subtotal.toFixed(2)}`);
        $("#salesTax").text(`$${salesTax.toFixed(2)}`);
        $("#totalPrice").text(`$${totalPrice.toFixed(2)}`);
    }

    // Event listeners for updates
    $("#sellerLocation").change(updateTaxRate);
    $("#price, #quantity").on("input", calculateTax);

    // Set initial tax rate on page load
    updateTaxRate();
});
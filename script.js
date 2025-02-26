$(document).ready(function () {
    // Tax rates for each country
    let taxRates = {
        "UK": 0.25,      // United Kingdom - 25%
        "IE": 0.125,     // Ireland - 12.5%
        "NL": 0.258,     // Netherlands - 25.8%
        "BE": 0.25,      // Belgium - 25%
        "ZA": 0.27,      // South Africa - 27%
        "KE": 0.30,      // Kenya - 30%
        "CA": 0.15,      // Canada - 15% federal
        "AU": 0.30,      // Australia - 30%
        "FI": 0.20,      // Finland - 20%
        "SE": 0.206      // Sweden - 20.6%
    };

    function calculateTax() {
        let price = parseFloat($("#price").val()) || 0;
        let quantity = parseInt($("#quantity").val()) || 0;
        let buyerLocation = $("#buyerLocation").val();

        if (price <= 0 || quantity <= 0) {
            $("#beforeTax").text("$0.00");
            $("#salesTaxRate").text("0%");
            $("#salesTax").text("$0.00");
            $("#totalPrice").text("$0.00");
            return;
        }

        let subtotal = price * quantity;
        let taxRate = taxRates[buyerLocation] || 0; // Sales tax is based on the buyer's location
        let salesTax = subtotal * taxRate;
        let totalPrice = subtotal + salesTax;

        $("#beforeTax").text(`$${subtotal.toFixed(2)}`);
        $("#salesTaxRate").text(`${(taxRate * 100).toFixed(1)}%`);
        $("#salesTax").text(`$${salesTax.toFixed(2)}`);
        $("#totalPrice").text(`$${totalPrice.toFixed(2)}`);
    }

    // Trigger calculation whenever an input changes
    $("#price, #quantity, #buyerLocation").on("input change", calculateTax);
});
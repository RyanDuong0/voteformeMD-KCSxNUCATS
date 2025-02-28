function calculateTax() {
    let quantity = parseInt(document.getElementById("quantity").value);
    let price = parseFloat(document.getElementById("price").value);
    let taxRate = parseFloat(document.getElementById("product_override").value) || 0;

    if (isNaN(quantity) || isNaN(price)) {
        alert("Please enter valid quantity and price.");
        return;
    }

    let orderValue = quantity * price;
    let salesTax = orderValue * (taxRate / 100);
    let totalAmount = orderValue + salesTax;

    document.getElementById("before_tax").innerText = `$${orderValue.toFixed(2)}`;
    document.getElementById("state_tax").innerText = `${taxRate.toFixed(2)}%`;
    document.getElementById("county_tax").innerText = `N/A`;
    document.getElementById("city_tax").innerText = `N/A`;
    document.getElementById("extra_tax").innerText = `N/A`;
    document.getElementById("after_tax").innerText = `$${totalAmount.toFixed(2)}`;
}
document.getElementById("taxForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const state = document.getElementById("state").value;
    const zip = document.getElementById("zip").value;
    const price = parseFloat(document.getElementById("price").value);
    const productOverride = document.getElementById("productOverride").value;
    const customerExempt = document.getElementById("customerExempt").checked;
    const customTaxRate = document.getElementById("customTaxRate").value;

    const requestBody = {
        state,
        zip,
        price,
        productOverride: productOverride === "exempt" ? "exempt" : null,
        customerExempt,
        customTaxRate: customTaxRate ? parseFloat(customTaxRate) : null
    };

    try {
        const response = await fetch("http://localhost:3000/calculate-tax", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        document.getElementById("result").innerHTML = `
            <p><strong>Before Sales Tax:</strong> $${result.priceBeforeTax}</p>
            <p><strong>Tax Amount:</strong> $${result.taxAmount}</p>
            <p><strong>Total Price:</strong> $${result.totalPrice}</p>
            <p><strong>Applied Tax Rate:</strong> ${result.appliedTaxRate * 100}%</p>
            <p><strong>Breakdown:</strong></p>
            <ul>
                <li>State Tax: ${result.breakdown.stateTax}</li>
                <li>County Tax: ${result.breakdown.countyTax}</li>
                <li>City Tax: ${result.breakdown.cityTax}</li>
                <li>Extra Taxes: ${result.breakdown.extraTax}</li>
            </ul>
        `;
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("result").innerHTML = "<p>Error calculating tax.</p>";
    }
});
$(document).ready(function() {
    $("#taxForm").submit(async function(event) {
        event.preventDefault();

        const state = $("#state").val();
        const zip = $("#zip").val();
        const price = parseFloat($("#price").val());
        const productOverride = $("#productOverride").val();
        const customerExempt = $("#customerExempt").prop("checked");
        const customTaxRate = $("#customTaxRate").val();

        const requestBody = {
            state,
            zip,
            price,
            productOverride: productOverride === "exempt" ? "exempt" : null,
            customerExempt,
            customTaxRate: customTaxRate ? parseFloat(customTaxRate) : null
        };

        try {
            const response = await $.ajax({
                url: "/calculate-tax",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(requestBody)
            });

            $("#result").html(`
                <p><strong>Before Sales Tax:</strong> $${response.priceBeforeTax}</p>
                <p><strong>Tax Amount:</strong> $${response.taxAmount}</p>
                <p><strong>Total Price:</strong> $${response.totalPrice}</p>
                <p><strong>Applied Tax Rate:</strong> ${(response.appliedTaxRate * 100).toFixed(2)}%</p>
                <p><strong>Breakdown:</strong></p>
                <ul>
                    <li>State Tax: ${response.breakdown.stateTax}</li>
                    <li>County Tax: ${response.breakdown.countyTax}</li>
                    <li>City Tax: ${response.breakdown.cityTax}</li>
                    <li>Extra Taxes: ${response.breakdown.extraTax}</li>
                </ul>
            `);
        } catch (error) {
            console.error("Error:", error);
            $("#result").html("<p>Error calculating tax.</p>");
        }
    });
});

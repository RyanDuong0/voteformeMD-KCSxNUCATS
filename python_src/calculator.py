import csv
import os
from flask import Flask, render_template, request, jsonify

# Set paths for templates and static files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Current script's directory
TEMPLATES_DIR = os.path.abspath(os.path.join(BASE_DIR, "../templates"))
STATIC_DIR = os.path.abspath(os.path.join(BASE_DIR, "../static"))
TAX_DATA_DIR = os.path.join(BASE_DIR, "taxRateStates")  # Relative path to the 'taxRateStates' folder

app = Flask(__name__, template_folder=TEMPLATES_DIR, static_folder=STATIC_DIR)


def get_tax_rate(state, zip_code):
    """
    Fetch the tax rate details for a given state and zip code from a CSV file.
    """
    state = state.upper()
    file_path = os.path.join(TAX_DATA_DIR, f"{state}.csv")  # Use relative path

    try:
        with open(file_path, mode="r", encoding="utf-8") as file:
            reader = csv.reader(file)
            next(reader)  # Skip header

            for row in reader:
                if len(row) < 9:
                    continue
                state_code, zip_code_csv, tax_region_name, estimated_combined_rate, state_rate, estimated_county_rate, estimated_city_rate, estimated_special_rate, risk_level = row

                if zip_code_csv.strip() == zip_code.strip():
                    return {
                        "state_rate": float(state_rate),
                        "county_rate": float(estimated_county_rate),
                        "city_rate": float(estimated_city_rate),
                        "special_rate": float(estimated_special_rate),
                        "combined_rate": float(estimated_combined_rate),
                    }
    except FileNotFoundError:
        return None

    return None


@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        data = request.form
        print("Received Form Data: ", data)

        branch_zip = data.get("branchZip")
        branch_state = data.get("branchState")
        customer_zip = data.get("customerZip")
        customer_state = data.get("customerState")
        price = float(data.get("price", 0))
        quantity = int(data.get("quantity", 1))
        delivered = data.get("delivered")

        total_price_before_tax = price * quantity
        tax_info = get_tax_rate(branch_state, branch_zip) if delivered == "collected" else get_tax_rate(customer_state,
                                                                                                        customer_zip)

        if not tax_info:
            return jsonify({"error": "Tax data not found for the provided location."}), 400

        state_tax = total_price_before_tax * tax_info["state_rate"]
        county_tax = total_price_before_tax * tax_info["county_rate"]
        city_tax = total_price_before_tax * tax_info["city_rate"]
        special_tax = total_price_before_tax * tax_info["special_rate"]
        total_tax = total_price_before_tax * tax_info["combined_rate"]
        total_price_after_tax = total_price_before_tax + total_tax

        return jsonify({
            "before_tax": f"${total_price_before_tax:.2f}",
            "state_tax": f"${state_tax:.2f}",
            "county_tax": f"${county_tax:.2f}",
            "city_tax": f"${city_tax:.2f}",
            "special_tax": f"${special_tax:.2f}",
            "after_tax": f"${total_price_after_tax:.2f}",
        })

    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)

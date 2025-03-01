import csv
import os
from flask import Flask, render_template, request

# Set the correct templates folder path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.abspath(os.path.join(BASE_DIR, "../templates"))
TAX_DATA_DIR = "PLACEHOLDER"  # Directory where CSV files are stored
STATIC_DIR = os.path.abspath(os.path.join(BASE_DIR, "../static"))

app = Flask(__name__, template_folder=TEMPLATES_DIR, static_folder=STATIC_DIR)

@app.route("/", methods=["GET", "POST"])
def home():
    # if request.method == "GET":
    #     currency = request.form.get("currency")
    #     print(f"You selected: {currency}")
    #     return f"You selected: {currency}"
    return render_template("index.html")
TAX_DATA_DIR = "taxRateStates"  # Directory where CSV files for each state are stored


def get_tax_rate(state, zip_code):
    """
    Fetch the state tax rate for the given state and zip code from a CSV file.
    """
    state = state.upper()
    file_path = os.path.join(os.getcwd(), TAX_DATA_DIR, f"{state}.csv")



    with open(file_path, mode="r", encoding="utf-8") as file:
        reader = csv.reader(file)
        header = next(reader)  # Skip header

        available_zip_codes = []

        for row in reader:
            if len(row) < 9:
                continue
            state_code, zip_code_csv, tax_region_name, estimated_combined_rate, state_rate, estimated_county_rate, estimated_city_rate, estimated_special_rate, risk_level = row
            available_zip_codes.append(zip_code_csv.strip())

            if zip_code_csv.strip() == zip_code.strip():  # Match zip code
                return float(state_rate)  # Convert state rate to float

    return None


def main():
    state = input("Enter the state you are buying from in initials: ").strip()
    zip_code = input("Enter the zip code: ").strip()

    try:
        buy_amount_before = float(input("Enter purchase price before tax: "))
    except ValueError:
        print("Invalid input: Please enter a valid numeric value.")
        return

    state_tax_rate = get_tax_rate(state, zip_code)

    if state_tax_rate is None:
        print(f"Sorry, tax information for {state} (Zip Code: {zip_code}) is not available.")
        return

    # Calculate final amount with tax
    buy_amount_after = buy_amount_before * (1 + state_tax_rate)

    print(f"Final Price After Tax: ${buy_amount_after:.2f}")


# Run Flask app only
if __name__ == "__main__":
    app.run(debug=True)

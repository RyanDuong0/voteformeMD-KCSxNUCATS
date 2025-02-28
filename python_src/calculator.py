import csv
import os
from flask import Flask, render_template

# Set the correct templates folder path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.abspath(os.path.join(BASE_DIR, "../templates"))
TAX_DATA_DIR = "PLACEHOLDER"  # Directory where CSV files are stored
STATIC_DIR = os.path.abspath(os.path.join(BASE_DIR, "../static"))

app = Flask(__name__, template_folder=TEMPLATES_DIR, static_folder=STATIC_DIR)

@app.route("/")
def home():
    return render_template("index.html")

def get_tax_rate(state, zip_code):
    """
    Fetch the tax rate and currency for the given state and zip code from a CSV file.
    """
    state = state.upper()
    file_path = os.path.join(TAX_DATA_DIR, f"{state}.csv")

    if not os.path.exists(file_path):
        return None, None

    with open(file_path, mode="r", encoding="utf-8") as file:
        reader = csv.reader(file)
        next(reader)  # Skip header

        for row in reader:
            if len(row) < 4:
                continue
            zip_code_csv, state_name, tax_rate, currency = row
            if zip_code_csv.strip() == zip_code.strip():
                return float(tax_rate), currency

    return None, None

# Run Flask app only
if __name__ == "__main__":
    app.run(debug=True)

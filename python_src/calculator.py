import csv
import os

TAX_DATA_DIR = "PLACEHOLDER"  # Directory where CSV files for each state are stored

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
        header = next(reader)  # Skip header

        for row in reader:
            if len(row) < 4:
                continue
            zip_code_csv, state_name, tax_rate, currency = row
            if zip_code_csv.strip() == zip_code.strip():  # Match zip code
                return float(tax_rate), currency  # Convert tax_rate to float

    return None, None


def main():
    state = input("Enter the state you are buying from: ").strip()
    zip_code = input("Enter the zip code: ").strip()

    try:
        buy_amount_before = float(input("Enter purchase price before tax: "))
    except ValueError:
        print("Invalid input: Please enter a valid numeric value.")
        return

    tax_rate, currency = get_tax_rate(state, zip_code)

    if tax_rate is None:
        print(f"Sorry, tax information for {state} (Zip Code: {zip_code}) is not available.")
        return

    # Calculate final amount with tax
    buy_amount_after = buy_amount_before * (1 + (tax_rate / 100))

    print(f"Final Price After Tax: {currency}{buy_amount_after:.2f}")


if __name__ == "__main__":
    main()

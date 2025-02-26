import tax_constants  # Ensure tax_constants.py contains tax_rates_with_currency

def get_tax_rate(country, state_or_province=None):
    """
    Fetch the tax rate and currency for the given country and, if applicable, state or province.
    """
    country = country.upper()
    country_data = tax_constants.tax_rates_with_currency.get(country)

    if not country_data:
        return None, None

    # If the country has a single tax rate, return it
    if "Tax Rate" in country_data:
        return country_data["Tax Rate"], country_data["Currency"]

    # If the country has multiple tax regions (e.g., U.S. states, Canadian provinces)
    tax_rate = None

    if "States" in country_data and state_or_province:
        state_or_province = state_or_province.upper()
        tax_rate = country_data["States"].get(state_or_province)

    if "Provinces" in country_data and state_or_province:
        state_or_province = state_or_province.upper()
        tax_rate = country_data["Provinces"].get(state_or_province)

    # If a specific state/province is not found, return federal tax rate (if applicable)
    if tax_rate is None:
        tax_rate = country_data.get("Federal Tax Rate")

    return tax_rate, country_data["Currency"]

def main():
    user_country = input("Enter the country you are in: ").strip()
    buy_country = input("Enter the country you are buying from: ").strip()

    # Check if the country has multiple tax regions (USA & Canada)
    state_or_province = None
    if buy_country.upper() in ["USA", "CANADA"]:
        state_or_province = input(f"Enter the state/province in {buy_country}: ").strip()

    try:
        buy_amount_before = float(input("Enter purchase price before tax: "))
    except ValueError:
        print("Invalid input! Please enter a valid numeric value.")
        return

    tax_rate, currency = get_tax_rate(buy_country, state_or_province)

    if tax_rate is None:
        print(f"Sorry, tax information for {buy_country} or {state_or_province} is not available.")
        return

    # Calculate final amount with tax
    buy_amount_after = buy_amount_before * (1 + (tax_rate / 100))


    print(f"Final Price After Tax: {currency}{buy_amount_after:.2f}")

main()
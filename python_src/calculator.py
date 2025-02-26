import tax_constants

def get_tax_rate(country):
    country=country.upper()
    return tax_constants.country_tax_rates.get(country)

def main():
    user_country = input("Enter country you are in: ")
    buy_country = input("Enter country you are buying from: ")
    print(get_tax_rate("united kingdom"))

main()
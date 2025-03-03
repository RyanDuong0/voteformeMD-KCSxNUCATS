Hackathon Report: US Sales Tax Calculator

Introduction

The US Sales Tax Calculator is a web tool designed to calculate sales tax based on state tax rules. The frontend is built with HTML, CSS, and JavaScript and is hosted on GitHub Pages, while the backend is built with Node.js and Express, hosted on Render for dynamic tax calculations.

Project Overview

The tool allows users to:
	•	Enter seller and buyer details, including state and ZIP code
	•	Add multiple products with price and quantity
	•	Use either default tax rates or custom rates
	•	View a detailed tax breakdown including state, county, city, and special taxes

The original plan was to use Python and Flask for the backend, but it was difficult to integrate with the website, so we switched to Node.js and Express. Since a free tax API was not available, we downloaded a CSV file with current tax rates. For improvements, a paid API like Avalara could provide real-time tax data.

Technical Implementation
	•	Frontend (GitHub Pages): Collects user input and sends data to the backend via the Fetch API
	•	Backend (Node.js on Render): Reads tax rates from a CSV file, determines if tax is origin-based or destination-based, calculates total tax, and returns results in JSON format

Challenges and Improvements
	•	Challenge: No free API for tax rates, so we used a static CSV file
	•	Challenge: Initial difficulty linking Flask with the frontend, leading to a switch to Node.js
	•	Improvement: Future versions could use a paid API (e.g., Avalara) for real-time tax rates

Conclusion

This project automated sales tax calculations and provided experience in full-stack development, handling real-world tax data, and cloud deployment. Hosting the frontend on GitHub Pages and the backend on Render made the tool publicly accessible. Future work could focus on real-time tax data and performance improvements.

PricePulse
A full-stack pricing intelligence project that helps compare product prices against competitor websites and generate a recommended selling price using a Python-based pricing simulation plus rule-based business logic.

Overview
PricePulse is organized into 3 layers:

client/: React + Vite frontend
server/: Express + MongoDB backend API
ml-service/: Python pricing simulation service
The system stores products, competitor prices, and price history in MongoDB. The backend fetches that data, passes it to the Python ML layer, merges the prediction with business rules, and returns pricing insights to the frontend.

High-Level Architecture

User Browser
React Frontend
Axios API Client
Express API Server
MongoDB
Node Pricing Service
Python Pricing Simulator
Project Structure
Pricepulse/
├── client/        # React frontend
├── server/        # Express backend + MongoDB models + seed scripts
└── ml-service/    # Python pricing prediction logic
How The System Works
The frontend loads the product catalog from the backend.
The backend fetches:
products
competitor prices
historical prices
The backend sends that data to the Python ML service.
The Python service computes a simulated predicted price and related signals.
The Node backend combines that prediction with pricing rules.
The final pricing insight is returned to the frontend.
The frontend displays:
our offer price
ML predicted price
hybrid recommendation
competitor prices
price history chart
model notes and confidence
Frontend
Tech Stack
React
Vite
Axios
Plain CSS
Main UI Flow
Dashboard
Shows:

total products
number of predictions ready
tracked competitor offers
search by product name or category
featured/trending products
Product Details
Shows:

product name and category
our offer price
ML predicted price
hybrid recommendation
lowest competitor website offer
competitor list
historical price chart
model notes, trend, market position, confidence
Frontend Routing
The app uses a lightweight manual routing approach instead of react-router.

Routes in the browser:

/ -> Dashboard
/product/:id -> Product details page
Frontend API Usage
The client uses a base URL from:

VITE_API_BASE_URL
fallback: http://localhost:5001/api
Backend
Tech Stack
Node.js
Express
Mongoose
MongoDB
CORS
dotenv
Backend Responsibilities
connect to MongoDB
expose REST APIs
create and fetch products
create and fetch competitors
load price history
call Python pricing service
combine ML output with pricing rules
return enriched product responses
API Base Path
All routes are mounted under:

/api
API Routes
POST /api/suggest
Generate a pricing insight for one product.

Request

{
  "productId": "PRODUCT_ID"
}
Response

{
  "productId": "PRODUCT_ID",
  "productName": "Apple iPhone 15",
  "currentPrice": 69900,
  "ourPrice": 68490,
  "suggestedPrice": 68990,
  "pricingInsight": {}
}
POST /api/product
Create a new product.

Request

{
  "name": "Sample Product",
  "category": "Smartphones",
  "currentPrice": 49999
}
Behavior

creates product
automatically inserts first self price-history record
GET /api/products
Returns all products enriched with:

sorted competitors
computed pricing insight
computed ourPrice
GET /api/products/:productId
Returns one product with:

full product info
competitors
price history
pricing insight
computed ourPrice
POST /api/competitor
Create a competitor offer.

Request

{
  "productId": "PRODUCT_ID",
  "competitorName": "Amazon",
  "price": 47999
}
GET /api/competitors
Returns all competitor entries.

Database Models
Product
Fields:

name: string, required
category: string
currentPrice: number, required
timestamps
Competitor
Fields:

productId: ObjectId -> Product
competitorName: string, required
price: number, required
timestamps
PriceHistory
Fields:

productId: ObjectId -> Product
price: number, required
source: string, default "self"
date: date, default current time
timestamps
Pricing Engine
1. Python ML Layer
The active ML layer is in Python. It is not a saved trained model like .pkl or .pt. It is a simulation-based predictor using pricing features.

Inputs Used
current product price
competitor prices
average competitor price
minimum competitor price
product category
historical prices
price momentum
price volatility
deterministic product seed
Outputs Produced
predictedPrice
confidence
demandScore
trend
marketPosition
competitorAveragePrice
competitorMinPrice
competitorCount
predictedChangePct
drivers
featureSnapshot
modelVersion
ML Characteristics
deterministic simulation
category-based demand baseline
synthetic fallback history if history is missing
confidence depends on history depth, competitor count, and volatility
2. Rule-Based Pricing Layer
After the Python output is returned, Node applies business rules.

Rule Logic
if competitor price is lower than our current price:
reduce toward competitor price
if demand is strong:
slightly increase from current price
otherwise:
keep close to current price
Hybrid Combination
Final recommendation is blended using:

70% ML predicted price
30% rule-based price
Competitive Adjustment
The backend then:

caps offer price near competitor average/minimum
clamps offer within a safe range around current price
computes savings vs lowest and average competitor prices
So the final displayed pricing is not just the raw ML output. It is a hybrid recommendation.

Dataset
The project uses a synthetic generated catalog, not a real scraped or labeled dataset.

Dataset Source
Generated from:

category definitions
brand/model lists
pricing formulas
deterministic hash-based jitter
simulated competitor offers
simulated historical prices
Categories Included
Smartphones
Tablets
Laptops
Headphones
Earbuds
Smartwatches
Bluetooth Speakers
Seeded Data Contents
For each product, the dataset generates:

product name
category
current price
5 self price-history points
3 competitor offers:
Amazon
Flipkart
official brand website
Dataset Size
exactly 200 products
Data Seeding
The backend includes a seed script that:

generates the synthetic tech catalog
creates or updates products
deletes old competitor/history rows for those products
inserts fresh competitor and price-history data
Command:

npm run seed:tech
Request Lifecycle Example
Example: Loading Dashboard
frontend calls GET /api/products
backend loads all products from MongoDB
backend loads competitor prices and price history
backend sends each product bundle to Python
Python returns prediction results
Node merges ML prediction with business logic
frontend receives enriched products and renders cards
Example: Opening Product Detail
frontend calls GET /api/products/:productId
backend loads full product data
backend computes one pricing insight
frontend renders detail page and chart
Environment Variables
Client
VITE_API_BASE_URL=http://localhost:5001/api
Server
MONGO_URI=your_mongodb_connection_string
PORT=5001
PYTHON_BIN=python
PYTHON_BIN is optional and used if Python is not available as python.

Important Notes
the frontend currently does not call POST /api/suggest; it mainly uses the enriched product endpoints
the ML service is simulation-based, not a separately trained persisted model
the dataset is synthetic and seeded into MongoDB
there is no authentication system in the current project
there is no advanced validation layer beyond Mongoose schema constraints
routing on the frontend is custom and minimal
Summary
PricePulse is a pricing recommendation system for tech products. It combines:

a React catalog and analytics UI
an Express/MongoDB API layer
synthetic product/competitor/history data
a Python pricing simulation engine
a hybrid recommendation strategy that blends ML-style prediction with business rules
It is best described as a full-stack intelligent pricing demo for product comparison and offer recommendation.

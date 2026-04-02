# Pricepulse

A comprehensive price tracking and prediction platform that helps businesses optimize their pricing strategies through data-driven insights and machine learning.

## 🚀 Features

- **Real-time Price Tracking**: Monitor product prices across competitors
- **AI-Powered Price Predictions**: Machine learning models to forecast price changes
- **Interactive Dashboard**: Visualize price history and trends with charts
- **Competitor Analysis**: Track and compare competitor pricing
- **Product Management**: Manage your product catalog with detailed insights
- **Responsive Design**: Modern, mobile-friendly interface

## 🏗️ Architecture

This is a full-stack application with three main components:

### Frontend (Client)
- **Framework**: React 19 with Vite
- **Styling**: CSS with theme support (light/dark mode)
- **API Communication**: Axios for REST API calls
- **Routing**: Client-side routing with history API

### Backend (Server)
- **Runtime**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful API endpoints
- **Environment**: Configurable with dotenv

### ML Service
- **Language**: Python
- **Purpose**: Price prediction and analysis
- **Algorithm**: Synthetic price history generation with category-based demand modeling

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Python** (v3.8 or higher)
- **MongoDB** (local or cloud instance)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pricepulse
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `server` directory:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/pricepulse
   NODE_ENV=development
   ```

5. **Seed the database** (optional)
   ```bash
   cd server
   npm run seed:tech
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend client** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

### Production Build

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Start the backend**
   ```bash
   cd server
   npm start
   ```

## 📡 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/product` - Create new product

### Pricing
- `POST /api/suggest` - Get price suggestions

### Competitors
- `GET /api/competitors` - Get all competitors
- `POST /api/competitor` - Create new competitor

## 🧠 Machine Learning Service

The ML service provides price prediction capabilities:

- **Input**: Product details, category, current price
- **Output**: Predicted price changes, confidence scores
- **Algorithm**: Uses category-based demand modeling and synthetic historical data

Run the ML service independently:
```bash
cd ml-service
python predict_price.py
```

## 🗂️ Project Structure

```
pricepulse/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── assets/
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── scripts/           # Database seeding
│   ├── services/          # Business logic
│   ├── app.js
│   ├── server.js
│   └── package.json
├── ml-service/             # Python ML service
│   ├── predict_price.py
│   └── simulatedPriceModel.mjs
└── README.md
```

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Linting
```bash
cd client
npm run lint
```

<<<<<<< HEAD
##  Contributing
=======
## 🤝 Contributing
>>>>>>> 70ea106 (updated Loading UI since the render was taking too much time to GET products)

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

<<<<<<< HEAD
##  Acknowledgments
=======
## 🙏 Acknowledgments
>>>>>>> 70ea106 (updated Loading UI since the render was taking too much time to GET products)

- React and Vite for the frontend framework
- Express.js for the backend framework
- MongoDB for the database
- Python for machine learning capabilities
<<<<<<< HEAD
 

 
=======

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.
>>>>>>> 70ea106 (updated Loading UI since the render was taking too much time to GET products)

---

**Pricepulse** - Optimize your pricing strategy with data-driven insights.</content>
<<<<<<< HEAD
<parameter name="filePath">e:\Pricepulse\README.md
=======
<parameter name="filePath">e:\Pricepulse\README.md
>>>>>>> 70ea106 (updated Loading UI since the render was taking too much time to GET products)

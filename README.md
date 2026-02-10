# CareSync - Intelligent Patient Monitoring System

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-Expo-purple.svg)](https://expo.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6%2B-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Overview

CareSync is a comprehensive healthcare monitoring platform that provides real-time patient vital signs monitoring, machine learning-powered early warning systems, and seamless communication between healthcare providers. The system consists of three main applications:

1. **Backend API** - Node.js/Express server with ML integration
2. **Web Dashboard** - React/TypeScript frontend for doctors and administrators
3. **Mobile App** - React Native application for nurses

## ✨ Key Features

### 🏥 Real-Time Vital Signs Monitoring
- **Multi-sensor Integration**: Heart Rate (HR), Oxygen Saturation (SpO₂), Temperature, Respiratory Rate (RR), Fall Detection
- **In-Memory Caching**: Sub-second access to latest patient vitals
- **5-Second EWS Calculations**: Automated Early Warning Score calculations
- **Staleness Validation**: Intelligent data freshness checking

### 🤖 Machine Learning Intelligence
- **3-Model Combination**:
  - Early Warning Score (EWS) Model
  - Anomaly Detection Model
  - Trend Analysis Engine
- **Clinical Override System**: Priority-based decision logic for critical alerts
- **Predictive Analytics**: 30-reading historical trend analysis

### 🔐 Security & Authentication
- **JWT-based Authentication**: Secure token-based access control
- **OAuth 2.0 Integration**: Google OAuth support
- **Role-Based Access Control**: Patient, Nurse, Doctor, Admin roles
- **Password Security**: Bcrypt hashing with 12 salt rounds

### 📊 Comprehensive Dashboard
- **Multi-role Interfaces**: Specialized views for different user types
- **Real-time Charts**: ECG-style vitals visualization
- **Alert Management**: Priority-based notification system
- **Patient Management**: Complete patient records and history

### 📱 Mobile Application
- **Nurse-focused Interface**: Streamlined patient monitoring
- **Offline Support**: AsyncStorage for critical data
- **Push Notifications**: Real-time alerts
- **Pull-to-refresh**: Easy data updates

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND APPLICATIONS                    │
│  ┌──────────────────┐           ┌──────────────────┐       │
│  │  Web Dashboard   │           │   Mobile App     │       │
│  │  (React/Vite)    │           │ (React Native)   │       │
│  │  Port: 5173      │           │   (Expo)         │       │
│  └────────┬─────────┘           └─────────┬────────┘       │
└───────────┼───────────────────────────────┼────────────────┘
            │                               │
            │        REST API Calls         │
            │                               │
            └───────────────┬───────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                   BACKEND API SERVER                         │
│                 (Node.js/Express)                            │
│                    Port: 5000                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                 8-LAYER ARCHITECTURE                   │ │
│  │  1. Data Reception      (/api/vitals/data)            │ │
│  │  2. In-Memory Cache     (vitalCache.js)               │ │
│  │  3. EWS Timer (5sec)    (vitalsController.js)         │ │
│  │  4. Staleness Check     (Clinical validation)         │ │
│  │  5. 3-Model Combination (EWS/Anomaly/Trend)           │ │
│  │  6. Clinical Overrides  (Priority decision)           │ │
│  │  7. MongoDB Storage     (VitalReading model)          │ │
│  │  8. API Responses       (JSON formatted data)         │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│  ┌────────────────────────▼──────────────────────────────┐  │
│  │         Machine Learning Integration                  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │ Python ML    │  │   Clinical   │  │   Trend    │ │  │
│  │  │ Models       │  │   Override   │  │   Analysis │ │  │
│  │  │ (predict.py) │  │   Logic      │  │   Engine   │ │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    MONGODB DATABASE                          │
│  Collections:                                                │
│  • users          - User accounts & profiles                 │
│  • vitalreadings  - Historical vitals with EWS scores        │
│  • sessions       - Authentication sessions                  │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
CareSync/
├── backend/                        # Node.js API Server
│   ├── src/
│   │   ├── config/                # Database & OAuth config
│   │   ├── controllers/           # Business logic
│   │   │   ├── authController.js
│   │   │   └── vitalsController.js
│   │   ├── middleware/            # Authentication middleware
│   │   ├── models/                # Mongoose schemas
│   │   │   ├── User.js
│   │   │   └── VitalReading.js
│   │   ├── routes/                # API endpoints
│   │   ├── utils/                 # Utilities & ML integration
│   │   │   ├── clinicalOverrides.js
│   │   │   ├── mlModels.js
│   │   │   └── vitalCache.js
│   │   └── server.js              # Entry point
│   ├── docs/                      # Comprehensive documentation
│   ├── tests/                     # Test suites
│   ├── predict.py                 # Python ML predictor
│   └── package.json
│
├── frontend/                      # React Web Dashboard
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── admin/           # Admin-specific components
│   │   │   ├── charts/          # Chart visualizations
│   │   │   ├── dashboard/       # Dashboard widgets
│   │   │   ├── device/          # Device management
│   │   │   ├── layout/          # Layout components
│   │   │   └── ui/              # shadcn/ui components
│   │   ├── contexts/            # React contexts
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utilities & API client
│   │   ├── pages/               # Page components
│   │   │   ├── admin/
│   │   │   ├── doctor/
│   │   │   └── nurse/
│   │   └── main.tsx             # Entry point
│   ├── vite.config.ts
│   └── package.json
│
├── Nurse App/                    # React Native Mobile App
│   ├── src/
│   │   ├── components/          # Mobile components
│   │   ├── context/            # Authentication context
│   │   ├── navigation/         # Navigation structure
│   │   ├── screens/            # App screens
│   │   └── services/           # API client
│   ├── assets/                 # Images & fonts
│   ├── app.json
│   └── package.json
│
├── EWS_training_dataset.csv     # ML training data
├── PROJECT_STRUCTURE.md
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **MongoDB**: 6.x or higher (local or Atlas)
- **Python**: 3.8+ (for ML models)
- **Expo CLI**: For mobile app development
- **Git**: For version control

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/caresync.git
cd CareSync
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/caresync
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRES_IN=7d
SESSION_SECRET=your_session_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
EOF

# Start MongoDB (if running locally)
# Windows: mongod
# macOS/Linux: sudo systemctl start mongodb

# Start the backend server
npm start
```

The backend will start on **http://localhost:5000**

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env

# Start the development server
npm run dev
```

The frontend will start on **http://localhost:5173**

#### 4. Mobile App Setup

```bash
cd "Nurse App"

# Install dependencies
npm install

# Update API URL in src/services/api.js
# Change BASE_URL to your backend URL

# Start Expo development server
npx expo start

# Scan QR code with Expo Go app (iOS/Android)
# or press 'a' for Android emulator, 'i' for iOS simulator
```

### Python ML Environment Setup

```bash
cd backend

# Install Python dependencies
pip install numpy pandas scikit-learn joblib

# Test ML integration
python predict.py
node tests/test-ml-integration.js
```

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with credentials |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update user profile |
| PUT | `/api/auth/change-password` | Change password |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/google` | Google OAuth login |

### Vitals Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/vitals/data` | Submit vital signs data |
| GET | `/api/vitals/latest/:patientId` | Get latest cached vitals |
| GET | `/api/vitals/history/:patientId` | Get historical readings |
| GET | `/api/vitals/current-ews/:patientId` | Get current EWS score |

### Example: Submit Vital Signs

```bash
POST /api/vitals/data
Content-Type: application/json
Authorization: Bearer <token>

{
  "patientId": "507f1f77bcf86cd799439011",
  "vitals": {
    "HR": { "value": 82, "time": "2026-02-10T10:00:02Z" },
    "SpO2": { "value": 96, "time": "2026-02-10T10:00:02Z" },
    "Temp": { "value": 37.1, "time": "2026-02-10T10:00:01Z" },
    "RR": { "value": 18, "time": "2026-02-10T10:00:01Z" },
    "Fall": { "value": 0, "time": "2026-02-10T10:00:02Z" }
  }
}
```

### Response:

```json
{
  "success": true,
  "message": "Vitals received and cache updated",
  "updated": {
    "HR": true,
    "SpO2": true,
    "Temp": true,
    "RR": true,
    "Fall": true
  }
}
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Seed database with test data
node tests/seed.js

# Test vitals system
node tests/test-vitals.js

# Test continuous monitoring
node tests/test-vitals-continuous.js

# Test trend logic
node tests/test-trend-logic.js

# Test ML integration
node tests/test-ml-integration.js

# Test clinical overrides
node tests/test-clinical-overrides.js

# Test combined analysis
node tests/test-combined-analysis.js
```

### Using Postman

Import the collection: `backend/tests/CareSync_Vitals.postman_collection.json`

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/caresync

# Authentication
JWT_SECRET=your_jwt_secret_min_32_characters
JWT_EXPIRES_IN=7d
SESSION_SECRET=your_session_secret

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

### Staleness Thresholds

Configure in `backend/src/controllers/vitalsController.js`:

```javascript
const STALENESS_THRESHOLDS = {
  HR: 5000,      // 5 seconds
  SpO2: 5000,    // 5 seconds
  Temp: 10000,   // 10 seconds
  RR: 8000,      // 8 seconds
  Fall: 3000     // 3 seconds
};
```

### EWS Calculation Interval

Default: Every 5 seconds per patient

```javascript
const EWS_CALCULATION_INTERVAL = 5000; // milliseconds
```

## 📊 Machine Learning Models

### Model Files
- `EWS_model.pkl` - Early Warning Score classifier
- `Anomaly_model.pkl` - Anomaly detection model
- Training data: `EWS_training_dataset.csv`

### Model Integration Flow

```
Node.js Controller → Python predict.py → ML Models → JSON Output → Node.js
```

### Priority Decision System

```javascript
PRIORITY 1: Clinical Overrides (Immediate danger)
  - Cardiac arrest patterns
  - Severe hypoxia
  - Critical temperature
  - Confirmed falls

PRIORITY 2: ML Model Predictions
  - EWS Score: Normal/Warning/Critical
  - Anomaly Detection: Normal/Abnormal
  - Trend Analysis: Stable/Declining/Improving

PRIORITY 3: Combined Logic
  Final Status = highest priority alert
```

## 🎨 Frontend Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library
- **Recharts** - Data visualization
- **TanStack Query** - Data fetching
- **React Router** - Navigation

## 📱 Mobile App Technologies

- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation
- **Axios** - HTTP client
- **AsyncStorage** - Local storage
- **Context API** - State management

## 🔒 Security Features

### Password Security
- Bcrypt hashing with 12 salt rounds
- Strong password policy enforcement
- Secure comparison methods

### Token Security
- JWT with 7-day expiration
- HTTP-only cookies support
- Bearer token pattern
- Automatic token refresh

### API Security
- Role-based access control
- Request validation
- CORS configuration
- Rate limiting ready

## 📈 Performance Optimizations

- **In-memory caching** for vital signs
- **Debounced calculations** for EWS
- **Lazy loading** for frontend components
- **Optimized database queries** with indexing
- **Connection pooling** for MongoDB
- **Asset optimization** in production builds

## 🌐 Deployment

### Backend Deployment (Render/Heroku)

```bash
# Set environment variables in hosting platform
# Deploy from GitHub or using CLI

# Example: Heroku
heroku create caresync-backend
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=<your-mongodb-atlas-uri>
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)

```bash
# Build production bundle
cd frontend
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod --dir=dist
```

### Mobile App Deployment

```bash
# Build for iOS
cd "Nurse App"
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## 📚 Documentation

Comprehensive documentation available in:

- **Backend**:
  - [`backend/README.md`](backend/README.md) - Backend overview
  - [`backend/ARCHITECTURE.md`](backend/ARCHITECTURE.md) - System architecture
  - [`backend/QUICKSTART.md`](backend/QUICKSTART.md) - Quick start guide
  - [`backend/VITALS_SYSTEM.md`](backend/VITALS_SYSTEM.md) - Vitals system details
  - [`backend/docs/`](backend/docs/) - Detailed technical docs

- **Project**:
  - [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md) - File structure
  - [`Nurse App/README.md`](Nurse%20App/README.md) - Mobile app guide

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists with all required variables
- Run `npm install` to ensure dependencies are installed

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend

### Mobile app can't reach API
- Update `BASE_URL` in `Nurse App/src/services/api.js`
- Ensure backend is accessible from mobile device network
- For local development, use your computer's IP address

### ML models not loading
- Install Python dependencies: `pip install numpy pandas scikit-learn joblib`
- Verify model files exist in `backend/src/models/`
- Test with: `python backend/predict.py`

## 🗺️ Roadmap

- [ ] Real-time WebSocket notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Voice alerts for critical events
- [ ] Integration with hospital EMR systems
- [ ] Wearable device integration
- [ ] Telemedicine video consultation
- [ ] AI-powered diagnosis suggestions
- [ ] Offline mode for mobile app
- [ ] Export reports in PDF format

---

**Built with ❤️ for better healthcare**

# CareSync Backend - Authentication System

## 🔐 Security Features

### Password Security
- **Bcrypt Hashing**: Passwords are hashed using bcrypt with 12 salt rounds
- **Never Stored Plain**: Passwords are never stored in plain text
- **Secure Comparison**: Uses bcrypt's timing-attack resistant comparison
- **Strong Password Policy**: Requires uppercase, lowercase, and numbers

### Token Security
- **JWT Authentication**: Stateless authentication using JSON Web Tokens
- **7-Day Expiry**: Tokens automatically expire for security
- **HTTP-Only Cookies**: Prevent XSS attacks (when using sessions)
- **Secure Headers**: Authorization Bearer token pattern

### OAuth Integration
- **Google OAuth 2.0**: Secure third-party authentication
- **Account Linking**: Link OAuth accounts to existing emails
- **No Password Storage**: OAuth users don't need passwords
- **Profile Data**: Automatically imports name, email, and avatar

## 📡 API Endpoints

### Local Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "role": "patient",
  "phoneNumber": "+1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe Updated",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

#### Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass123"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### OAuth Authentication

#### Google Login
```http
GET /api/auth/google
```
Redirects to Google OAuth consent screen.

#### Google Callback
```http
GET /api/auth/google/callback
```
Automatically handled by Google OAuth. Redirects to:
- Success: `{FRONTEND_URL}/auth/success?token={jwt}`
- Failure: `{FRONTEND_URL}/login?error=oauth_failed`

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Update `.env` file with your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/caresync
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:8080

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Session Secret
SESSION_SECRET=your_session_secret_key_here
```

### 3. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Application type: Web application
6. Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
7. Copy Client ID and Client Secret to `.env`

### 4. Install and Start MongoDB

**Windows (using Chocolatey):**
```bash
choco install mongodb
mongod
```

**Or use MongoDB Atlas (Cloud):**
Update `MONGODB_URI` in `.env` with your Atlas connection string.

### 5. Start the Server

**Development mode with auto-reload:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## 🧪 Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"Test123\",\"name\":\"Test User\"}"
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"Test123\"}"
```

**Get Profile:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman or Thunder Client

Import the following collection or create requests manually with the endpoints above.

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── passport.js        # OAuth configuration
│   ├── controllers/
│   │   └── authController.js  # Authentication logic
│   ├── middleware/
│   │   └── auth.js            # JWT verification & authorization
│   ├── models/
│   │   └── User.js            # User schema with password hashing
│   ├── routes/
│   │   └── authRoutes.js      # API routes
│   ├── utils/
│   │   └── jwt.js             # JWT utilities
│   └── server.js              # Express server setup
├── .env                       # Environment variables
└── package.json
```

## 🛡️ Security Best Practices Implemented

1. **Password Hashing**: Bcrypt with 12 rounds
2. **JWT Tokens**: Secure, stateless authentication
3. **Input Validation**: Express-validator for all inputs
4. **SQL Injection Protection**: MongoDB prevents SQL injection
5. **XSS Protection**: HTTP-only cookies, sanitized inputs
6. **CORS**: Configured for specific frontend origin
7. **Rate Limiting**: (To be added for production)
8. **HTTPS**: Enable in production with proper certificates
9. **Environment Variables**: Sensitive data not in code
10. **Role-Based Access**: Authorization middleware

## 📝 User Roles

- **patient**: Default role for regular users
- **doctor**: Medical professionals
- **nurse**: Nursing staff
- **admin**: System administrators
- **staff**: General hospital staff

## 🔄 OAuth Flow

1. User clicks "Sign in with Google" on frontend
2. Frontend redirects to `/api/auth/google`
3. User authenticates with Google
4. Google redirects to `/api/auth/google/callback`
5. Backend creates/updates user account
6. Backend generates JWT token
7. Backend redirects to frontend with token
8. Frontend stores token and authenticates user

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- For Atlas, whitelist your IP address

**Google OAuth Not Working:**
- Verify Client ID and Secret in `.env`
- Check callback URL matches Google Console
- Ensure Google+ API is enabled

**Token Expired:**
- Tokens expire after 7 days by default
- User needs to login again
- Implement refresh token for longer sessions

## 📚 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **passport**: OAuth middleware
- **passport-google-oauth20**: Google OAuth strategy
- **express-validator**: Input validation
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables
- **cookie-parser**: Cookie parsing
- **express-session**: Session management

## 🚀 Next Steps

1. ✅ Authentication system complete
2. 📧 Email verification (optional)
3. 🔑 Password reset functionality
4. 👥 Patient management endpoints
5. 📅 Appointments system
6. 📊 Dashboard analytics
7. 🔔 Notifications system
8. 📱 Mobile API optimization

## 📞 Support

For issues or questions, please create an issue in the repository.

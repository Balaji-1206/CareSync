# CareSync Nurse Mobile App

A lightweight React Native mobile application for nurses to monitor assigned patients' vital signs in real-time.

## Features

✅ **User Authentication**
- Email/password login using CareSync backend
- Secure token-based authentication
- Auto-logout on token expiration

✅ **Patient Dashboard**
- View all assigned patients
- Real-time vital signs display (HR, SpO₂, Temp, RR)
- Status indicators (Normal, Warning, Critical)
- Pull-to-refresh functionality

✅ **Patient Details**
- Detailed vital signs view
- Fall detection status
- Color-coded vital ranges
- Last updated timestamps
- Critical alert banners

✅ **Alert System**
- Visual status badges (Green/Yellow/Red)
- Critical alerts with red banner
- Fall detection notifications

## Tech Stack

- **Framework:** React Native with Expo
- **Navigation:** React Navigation (Stack Navigator)
- **State Management:** Context API
- **HTTP Client:** Axios
- **Storage:** AsyncStorage
- **Backend API:** CareSync REST API

## Installation

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)

### Setup

1. **Install dependencies:**
```bash
cd "Nurse App"
npm install
```

2. **Update API endpoint:**
Edit `src/services/api.js` and update `API_URL` to match your backend:
```javascript
const API_URL = 'http://your-backend-ip:5000/api';
```

3. **Run the app:**

**For Expo Go (easiest):**
```bash
npm start
```
Then scan the QR code with Expo Go app on your phone.

**For Android Emulator:**
```bash
npm run android
```

**For iOS Simulator:**
```bash
npm run ios
```

## Demo Credentials

```
Email: nurse@hospital.com
Password: Nurse123
```

## Project Structure

```
Nurse App/
├── App.js                    # Main entry point
├── app.json                  # Expo configuration
├── package.json              # Dependencies
└── src/
    ├── context/
    │   └── AuthContext.js    # Authentication state
    ├── services/
    │   └── api.js            # API calls & axios setup
    ├── screens/
    │   ├── LoginScreen.js    # Login UI
    │   ├── NurseDashboardScreen.js  # Patient list
    │   └── PatientDetailScreen.js   # Patient vitals
    └── navigation/
        └── RootNavigator.js  # Navigation setup
```

## API Integration

The app connects to these backend endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `GET /api/vitals/latest/:patientId` - Latest vitals
- `GET /api/vitals/ews-status/:patientId` - EWS status
- `GET /api/vitals/history/:patientId` - Vital history

## Vital Signs Reference

- **HR (Heart Rate):** 60-100 bpm (normal), <50 or >120 critical
- **SpO₂ (Oxygen):** 95-100% (normal), <90 critical  
- **Temp (Temperature):** 36-37.5°C (normal), <35 or >38.5°C critical
- **RR (Respiration Rate):** 12-20 breaths/min (normal), <8 or >30 critical

## Color Coding

- 🟢 **Green:** Normal vitals
- 🟡 **Yellow:** Warning (outside normal range)
- 🔴 **Red:** Critical (immediate attention needed)

## Future Enhancements

- [ ] Push notifications for critical alerts
- [ ] Real-time data updates via WebSocket
- [ ] Charts and trend analysis
- [ ] Patient notes/observations
- [ ] Voice alerts
- [ ] Offline mode with sync
- [ ] Multiple language support

## Troubleshooting

**API Connection Issues:**
- Ensure backend is running on correct port (5000)
- Check API_URL in `src/services/api.js`
- Verify CORS is enabled on backend
- Use your local IP instead of localhost: `http://192.168.x.x:5000`

**Build Issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start --c
```

## Development

To modify the app:

1. Edit screen files in `src/screens/`
2. Add new endpoints in `src/services/api.js`
3. Update navigation in `src/navigation/RootNavigator.js`
4. Test with `npm start`

## License

MIT

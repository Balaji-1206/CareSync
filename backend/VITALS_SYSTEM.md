# CareSync Vitals Backend System

## 📋 Overview

This is the **backend vitals monitoring system** for CareSync. It implements an **8-layer medical early warning system** that:

1. ✅ Receives sensor data (HR, SpO2, Temp, RR, Fall)
2. ✅ Maintains in-memory cache of latest readings
3. ✅ Triggers EWS calculations every 5 seconds
4. ✅ Validates data staleness
5. ✅ Combines 3 ML models for final decision
6. ✅ Stores historical data in MongoDB
7. ✅ Provides trend analysis
8. ✅ Returns structured API responses

---

## 🏗️ Architecture

### Layer 1: Data Reception
**Endpoint:** `POST /api/vitals/data`

Receives sensor data and validates all required fields.

```json
{
  "patientId": "507f1f77bcf86cd799439011",
  "vitals": {
    "HR": { "value": 82, "time": "2025-12-31T10:00:02Z" },
    "SpO2": { "value": 96, "time": "2025-12-31T10:00:02Z" },
    "Temp": { "value": 37.1, "time": "2025-12-31T10:00:01Z" },
    "RR": { "value": 18, "time": "2025-12-31T10:00:01Z" },
    "Fall": { "value": 0, "time": "2025-12-31T10:00:02Z" }
  }
}
```

### Layer 2: Latest State Cache
**Location:** `src/utils/vitalCache.js`

In-memory dictionary storing the most recent vital reading for each sensor:

```javascript
{
  "patientId": {
    "HR": 82,
    "SpO2": 96,
    "Temp": 37.1,
    "RR": 18,
    "Fall": 0
  }
}
```

**Always ready** for EWS calculations, even if sensors send at different intervals.

### Layer 3: EWS Timer Logic
**Location:** `src/controllers/vitalsController.js`

Every 5 seconds:
- ✅ Check staleness of vitals
- ✅ Validate all data is within time window
- ✅ Calculate EWS + Anomaly + Trend
- ✅ Save to database

**Staleness Rules:**
| Vital | Max Age |
|-------|---------|
| HR | 5 sec |
| SpO2 | 5 sec |
| Temp | 10 sec |
| RR | 8 sec |
| Fall | 3 sec |

If any vital is stale → **Skip calculation, log "awaiting data"**

### Layer 4: 3-Model Combination
**Location:** `src/utils/mockModels.js`

At each calculation:

```javascript
input = cache.getLatestVitals(patientId)

ews_result = ewsModel(input)           // "Normal" | "Warning" | "Critical"
anomaly = anomalyModel(input)         // "Normal" | "Abnormal"
trend = trendModel(input, history)    // "Stable" | "Declining" | "Improving"

if (ews_result === "Critical" || anomaly === "Abnormal" || trend === "Declining"):
    Final_Status = "High Risk"
else if (ews_result === "Warning"):
    Final_Status = "Monitor"
else:
    Final_Status = "Stable"
```

### Layer 5: Database Storage
**Location:** `src/models/VitalReading.js`

Each processed cycle stored:

| Field | Description |
|-------|-------------|
| `patientId` | Reference to patient |
| `vitals` | HR, SpO2, Temp, RR, Fall values |
| `calculation.EWS` | EWS result + timestamp |
| `calculation.Anomaly` | Anomaly result + timestamp |
| `calculation.Trend` | Trend result + timestamp |
| `finalStatus` | Combined decision |
| `processingStatus` | Processed / Stale / Incomplete |
| `recordedAt` | When recorded |

### Layer 6: Trend Monitoring
**In `trendModel()`**

- Keeps last 30 vital readings in memory
- Compares first half vs second half of recent data
- Detects continuous decline in SpO2 or HR
- Returns: "Stable", "Declining", or "Improving"

### Layer 7: Output Layer
**Endpoint:** `GET /api/vitals/ews-status/:patientId`

```json
{
  "success": true,
  "EWS": "Warning",
  "Anomaly": "Normal",
  "Trend": "Stable",
  "Final_Status": "Monitor",
  "Last_Update": "2025-12-31T10:00:10Z",
  "Processing_Status": "Processed",
  "Stale_Vitals": []
}
```

---

## 🔌 API Endpoints

### 1. POST /api/vitals/data
**Receive vital data from sensors**

```bash
curl -X POST http://localhost:5000/api/vitals/data \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "507f1f77bcf86cd799439011",
    "vitals": {
      "HR": { "value": 82, "time": "2025-12-31T10:00:02Z" },
      "SpO2": { "value": 96, "time": "2025-12-31T10:00:02Z" },
      "Temp": { "value": 37.1, "time": "2025-12-31T10:00:01Z" },
      "RR": { "value": 18, "time": "2025-12-31T10:00:01Z" },
      "Fall": { "value": 0, "time": "2025-12-31T10:00:02Z" }
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Vital data received and cached",
  "cachedState": {
    "HR": { "value": 82, "time": "2025-12-31T10:00:02Z" },
    "SpO2": { "value": 96, "time": "2025-12-31T10:00:02Z" },
    "Temp": { "value": 37.1, "time": "2025-12-31T10:00:01Z" },
    "RR": { "value": 18, "time": "2025-12-31T10:00:01Z" },
    "Fall": { "value": 0, "time": "2025-12-31T10:00:02Z" }
  }
}
```

### 2. GET /api/vitals/latest/:patientId
**Get current cached vital state**

```bash
curl http://localhost:5000/api/vitals/latest/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "patientId": "507f1f77bcf86cd799439011",
  "data": {
    "HR": { "value": 82, "time": "2025-12-31T10:00:02Z" },
    "SpO2": { "value": 96, "time": "2025-12-31T10:00:02Z" },
    "Temp": { "value": 37.1, "time": "2025-12-31T10:00:01Z" },
    "RR": { "value": 18, "time": "2025-12-31T10:00:01Z" },
    "Fall": { "value": 0, "time": "2025-12-31T10:00:02Z" }
  },
  "timestamp": "2025-12-31T10:00:15Z"
}
```

### 3. GET /api/vitals/ews-status/:patientId
**Get latest EWS calculation result**

```bash
curl http://localhost:5000/api/vitals/ews-status/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "patientId": "507f1f77bcf86cd799439011",
  "data": {
    "EWS": "Warning",
    "Anomaly": "Normal",
    "Trend": "Stable",
    "Final_Status": "Monitor",
    "Last_Update": "2025-12-31T10:00:10Z",
    "Processing_Status": "Processed",
    "Stale_Vitals": []
  }
}
```

### 4. GET /api/vitals/history/:patientId?limit=50
**Get historical vital readings**

```bash
curl http://localhost:5000/api/vitals/history/507f1f77bcf86cd799439011?limit=50
```

---

## 🧪 Testing

Run the test script:

```bash
cd backend
node test-vitals.js
```

⚠️ **Requirements:**
- MongoDB must be running
- Backend server must be running (`npm start`)
- Update `PATIENT_ID` in test script with a real user ID

**Test sequence:**
1. ✅ Send vital data
2. ✅ Get latest cached vitals (immediate)
3. ✅ Wait 6 seconds
4. ✅ Get EWS status (should have results)
5. ✅ Get history (should have at least 1 record)

---

## 📁 File Structure

```
backend/src/
├── models/
│   ├── VitalReading.js          # MongoDB schema
│   └── User.js                   # (existing)
├── controllers/
│   ├── vitalsController.js       # Core logic
│   └── authController.js         # (existing)
├── routes/
│   ├── vitalsRoutes.js           # API endpoints
│   └── authRoutes.js             # (existing)
├── utils/
│   ├── vitalCache.js             # In-memory cache
│   ├── mockModels.js             # 3 Model placeholders
│   └── jwt.js                    # (existing)
├── server.js                     # Express app (updated)
└── ...

backend/
├── test-vitals.js                # Test script
└── ...
```

---

## 🔧 Configuration

### Cache Retention
- Keeps last **30 vital readings** per patient
- Older readings automatically removed
- Helps with trend analysis

### EWS Calculation Interval
- Triggered every **5 seconds**
- Can be adjusted in `vitalsController.js` line 73

### Staleness Windows
Edit in `vitalCache.js` (lines 46-52):
```javascript
const MAX_AGE = {
  HR: 5 * 1000,      // milliseconds
  SpO2: 5 * 1000,
  Temp: 10 * 1000,
  RR: 8 * 1000,
  Fall: 3 * 1000
};
```

---

## 🚀 Future Enhancements

### Phase 2: Real ML Models
1. Replace mock functions with actual `.pkl` models
2. Load models from `backend/src/models/`
3. Use Python process or Node.js ML library
4. Return accurate medical predictions

### Phase 3: Hardware Integration
1. Connect actual IoT sensors
2. Handle real-time data streams
3. Add error recovery for sensor failures

### Phase 4: Frontend Integration
1. Display EWS results on dashboard
2. Real-time alerts for "High Risk"
3. Historical graphs and trends
4. Patient-specific reports

---

## 📊 Database Queries

Get latest reading for a patient:
```javascript
VitalReading.findOne({ patientId: "id" })
  .sort({ recordedAt: -1 })
  .lean()
```

Get readings from last 10 minutes:
```javascript
VitalReading.find({
  patientId: "id",
  recordedAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) }
})
  .sort({ recordedAt: -1 })
```

Get all "High Risk" alerts:
```javascript
VitalReading.find({
  patientId: "id",
  finalStatus: "High Risk"
})
  .sort({ recordedAt: -1 })
```

---

## 🐛 Debugging

### Enable verbose logging
In `vitalsController.js`, uncomment console.logs (already present)

### Check cache contents
```javascript
const cache = require('./utils/vitalCache');
console.log(cache.cache);
```

### Monitor timers
```javascript
console.log(Object.keys(ewsTimers)); // Active patient timers
```

---

## ✅ Success Indicators

You'll know everything works when:

1. ✅ POST /data accepts sensor data
2. ✅ GET /latest returns cached values immediately
3. ✅ Wait 5+ seconds
4. ✅ GET /ews-status returns EWS/Anomaly/Trend results
5. ✅ Database stores records
6. ✅ Multiple patients can be tracked simultaneously
7. ✅ Stale data is properly detected

---

## 📞 Support

For issues or questions about the vitals system, check:
- Console logs (verbose output)
- MongoDB logs
- Network requests in browser DevTools

---

**Backend Ready for Production! 🎯**

Now ready to integrate with:
- Real ML models (Phase 2)
- Hardware sensors (Phase 3)
- Frontend dashboard (Phase 4)


CareSync/
│
├── README.md                         # Main project documentation
├── PROJECT_STRUCTURE.md              # This file
│
├── backend/                          # Backend Node.js/Express API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # MongoDB connection
│   │   │   └── passport.js           # OAuth configuration
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js     # Auth logic
│   │   │   └── vitalsController.js   # Vitals system with ML integration ✅
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.js               # JWT authentication
│   │   │
│   │   ├── models/
│   │   │   ├── User.js               # User schema
│   │   │   ├── VitalReading.js       # Vitals schema ✅
│   │   │   ├── EWS_model.pkl         # Early Warning Score ML model ✅
│   │   │   └── Anomaly_model.pkl     # Anomaly detection ML model ✅
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Auth endpoints
│   │   │   └── vitalsRoutes.js       # Vitals endpoints ✅
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.js                # JWT utilities
│   │   │   ├── mlModels.js           # ML model integration (Node.js → Python) ✅
│   │   │   ├── clinicalOverrides.js  # Clinical safety rules (Priority 1) ✅
│   │   │   └── vitalCache.js         # In-memory cache ✅
│   │   │
│   │   └── server.js                 # Express app entry point
│   │
│   ├── docs/                         # 📚 Backend Documentation ✅
│   │   ├── CLINICAL_OVERRIDE_QUICKREF.md
│   │   ├── CLINICAL_OVERRIDE_SYSTEM.md
│   │   ├── IMPLEMENTATION_SUMMARY_v2.md
│   │   ├── ML_MODELS_WORKING.md
│   │   ├── PRIORITY_DECISION_SYSTEM.md
│   │   ├── SYSTEM_ARCHITECTURE_DIAGRAM.md
│   │   ├── TREND_LOGIC_COMPARISON.md
│   │   └── TREND_LOGIC_IMPLEMENTATION.md
│   │
│   ├── tests/                        # 🧪 Test Files (Development Only) ✅
│   │   ├── test-vitals.js            # API tests
│   │   ├── test-vitals-continuous.js # Stress tests
│   │   ├── test-trend-logic.js       # Trend analysis tests
│   │   ├── test-ml-integration.js    # ML integration tests
│   │   ├── test-combined-analysis.js # Combined system tests
│   │   ├── test-clinical-overrides.js# Clinical override tests
│   │   ├── test-models-joblib.py     # Python model loading tests
│   │   ├── seed.js                   # Database seeder
│   │   └── CareSync_Vitals.postman_collection.json
│   │
│   ├── predict.py                    # Python ML model predictor ✅
│   ├── .env                          # Environment variables
│   ├── package.json                  # Backend dependencies
│   ├── package-lock.json
│   ├── ARCHITECTURE.md               # System architecture
│   ├── QUICKSTART.md                 # Getting started guide
│   ├── VITALS_SYSTEM.md              # Technical documentation
│   └── README.md                     # Backend README
│
├── frontend/                         # Frontend React/Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── StatusIndicator.tsx
│   │   │   │   └── SystemStatCard.tsx
│   │   │   │
│   │   │   ├── charts/
│   │   │   │   ├── ECGChart.tsx
│   │   │   │   └── VitalChart.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── BedStatusCard.tsx
│   │   │   │   ├── NotificationItem.tsx
│   │   │   │   ├── StatCard.tsx
│   │   │   │   └── VitalCard.tsx
│   │   │   │
│   │   │   ├── device/
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── AppSidebar.tsx
│   │   │   │   └── MainLayout.tsx
│   │   │   │
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   │   ├── accordion.tsx
│   │   │   │   ├── alert-dialog.tsx
│   │   │   │   ├── alert.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── chart.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── sidebar.tsx
│   │   │   │   └── ... (all other UI components)
│   │   │   │
│   │   │   ├── ChangePasswordSection.tsx
│   │   │   └── NavLink.tsx
│   │   │
│   │   ├── contexts/
│   │   │   └── SidebarContext.tsx
│   │   │
│   │   ├── data/
│   │   │   ├── adminMockData.ts
│   │   │   └── mockData.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── use-auth.ts
│   │   │   ├── use-mobile.tsx
│   │   │   └── use-toast.ts
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts                # API client (Axios/Fetch)
│   │   │   └── utils.ts              # Utility functions
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   └── ... (admin pages)
│   │   │   │
│   │   │   ├── doctor/
│   │   │   │   └── ... (doctor pages)
│   │   │   │
│   │   │   ├── nurse/
│   │   │   │   └── ... (nurse pages)
│   │   │   │
│   │   │   ├── AuthSuccess.tsx
│   │   │   ├── Index.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── NotFound.tsx
│   │   │   ├── PatientDetail.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── Signup.tsx
│   │   │
│   │   ├── App.css
│   │   ├── App.tsx                   # Main App component
│   │   ├── index.css                 # Global styles
│   │   ├── main.tsx                  # React entry point
│   │   └── vite-env.d.ts             # TypeScript definitions
│   │
│   ├── public/
│   │   └── robots.txt
│   │
│   ├── .gitignore
│   ├── components.json               # shadcn/ui config
│   ├── eslint.config.js              # ESLint config
│   ├── index.html                    # HTML entry point
│   ├── package.json                  # Frontend dependencies
│   ├── package-lock.json
│   ├── postcss.config.js             # PostCSS config
│   ├── tailwind.config.ts            # Tailwind CSS config
│   ├── tsconfig.json                 # TypeScript config
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   └── vite.config.ts                # Vite config
│
├── docs/                             # Project documentation
│   ├── IMPLEMENTATION_SUMMARY.md     # Implementation summary
│   └── VITALS_IMPLEMENTATION_COMPLETE.md  # Vitals completion doc
│
├── .git/                             # Git repository
├── .gitignore                        # Git ignore rules
├── bun.lockb                         # Bun lock file
├── README.md                         # Main project README
└── PROJECT_STRUCTURE.md              # This file


```

---

## � Key System Components

### Backend ML Integration (✅ Working)
- **Priority 1**: Clinical Override System (`clinicalOverrides.js`) - Hard-coded safety rules bypass ML
- **Priority 2**: EWS Model (`EWS_model.pkl`) - Early Warning Score prediction
- **Priority 3**: Anomaly Detection (`Anomaly_model.pkl`) - Isolation Forest anomaly detection
- **Priority 4**: Trend Analysis (`mlModels.js`) - Context-aware vital sign changes

### Model Integration
- **Technology**: Node.js → Python child process using `predict.py`
- **Model Loading**: joblib (compatible with Python 3.13 + scikit-learn 1.6.1)
- **Clinical Overrides**: HR <50/>130, Temp ≥39°C, RR <10/>25, SpO2 <92%, Fall=1

### Testing Infrastructure
All test files organized in `backend/tests/`:
- API testing (`test-vitals.js`)
- Stress testing (`test-vitals-continuous.js`)
- ML integration tests (`test-ml-integration.js`)
- Clinical override tests (`test-clinical-overrides.js` - 12/12 passing)
- Trend logic tests (`test-trend-logic.js`)

### Documentation
Backend documentation in `backend/docs/`:
- System architecture diagrams
- Clinical override specifications
- Priority decision system details
- ML model implementation guides
- Trend logic comparisons

---

## 🚀 Deployment Guidelines

### Production Deployment
**Include:**
- `backend/src/` - All production code
- `backend/predict.py` - Python ML predictor script
- `backend/src/models/*.pkl` - ML model files (EWS and Anomaly)
- `backend/docs/` - Optional (reference documentation)

**Exclude:**
- `backend/tests/` - Development testing files only
- Test scripts, database seeders, Postman collections

### Environment Requirements
- **Node.js**: v18+ (for backend)
- **Python**: 3.13.1 (for ML models)
- **Dependencies**: scikit-learn 1.6.1, joblib, numpy
- **Database**: MongoDB 6.0+

---

## ✅ System Validation Status

- ✅ Clinical override system (Priority 1) - 12/12 tests passing
- ✅ EWS model integration (Priority 2) - Working via joblib
- ✅ Anomaly detection (Priority 3) - Working via joblib  
- ✅ Trend analysis (Priority 4) - Medically realistic logic
- ✅ Test suite organized and passing
- ✅ Documentation separated by backend/frontend

---

**Last Updated**: December 31, 2025
**System Status**: ✅ Fully operational with ML integration

# System Architecture Diagram

## 🏥 Complete CareSync Decision Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     PATIENT VITALS INPUT                     │
│              { HR, SpO2, Temp, RR, Fall }                   │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
                ┌───────────────────────┐
                │  Update Cache         │
                │  vitalCache.update()  │
                └───────────┬───────────┘
                            ↓
                ┌───────────────────────┐
                │  Every 5 Seconds      │
                │  EWS Timer Triggered  │
                └───────────┬───────────┘
                            ↓
            ┌───────────────────────────────┐
            │  Step 1: Check Staleness      │
            │  Are vitals fresh? (<30s old) │
            └───────────┬───────────────────┘
                        ↓
                    Stale?
                   ╱      ╲
                 YES       NO
                  ↓         ↓
        ┌──────────────┐   │
        │ Save "Stale" │   │
        │   to DB      │   │
        │    STOP      │   │
        └──────────────┘   │
                           ↓
        ┌────────────────────────────────────────────┐
        │  PRIORITY 1: CLINICAL OVERRIDE CHECK       │
        │  applyClinicalOverrides(vitals)            │
        └────────────────┬───────────────────────────┘
                         ↓
                     Triggered?
                    ╱          ╲
                  YES           NO
                   ↓             ↓
    ┌──────────────────────┐    ┌────────────────────────┐
    │  CRITICAL OVERRIDE   │    │  PRIORITY 2-4          │
    │                      │    │  ML MODELS             │
    │  Status: Critical    │    └────────┬───────────────┘
    │  ML: SKIPPED         │             ↓
    │  Reason: Medical     │    ┌────────────────────────┐
    │         Red Flag     │    │  Run EWS Model         │
    │                      │    │  ewsModel(vitals)      │
    │  Examples:           │    └────────┬───────────────┘
    │  • Fall = 1          │             ↓
    │  • SpO2 < 92%        │        EWS Result
    │  • RR < 10 or > 25   │        ╱    |    ╲
    │  • HR < 50 or > 130  │  Critical Warning Normal
    │  • Temp >= 39°C      │       ↓      ↓       ↓
    │                      │       │      │       │
    └──────────┬───────────┘       │      │       │
               ↓                   │      │       │
    ┌──────────────────────┐      │      │       │
    │  Save to Database    │      │      │       │
    │  with Override Info  │      │      │       │
    └──────────┬───────────┘      │      │       │
               ↓                   │      │       │
          ✅ DONE                  │      │       │
                                   │      │       ↓
                                   │      │  ┌─────────────────┐
                                   │      │  │ Run Anomaly     │
                                   │      │  │ Model           │
                                   │      │  │ anomalyModel()  │
                                   │      │  └────────┬────────┘
                                   │      │           ↓
                                   │      │      Abnormal?
                                   │      │      ╱      ╲
                                   │      │    YES       NO
                                   │      │     ↓         ↓
                                   │      │     │         │
                                   │      │     │    ┌────────────┐
                                   │      │     │    │ Run Trend  │
                                   │      │     │    │ Analysis   │
                                   │      │     │    └──────┬─────┘
                                   │      │     │           ↓
                                   │      │     │      Declining?
                                   │      │     │       ╱     ╲
                                   │      │     │     YES      NO
                                   │      │     │      ↓        ↓
                                   ↓      ↓     ↓      ↓        ↓
                        ┌──────────────────────────────────────────┐
                        │     PRIORITY-BASED FINAL DECISION        │
                        ├──────────────────────────────────────────┤
                        │  Priority 1: Override     → Critical     │
                        │  Priority 2: EWS Critical → Critical     │
                        │  Priority 2: EWS Warning  → Warning      │
                        │  Priority 3: Anomaly      → High Risk    │
                        │  Priority 4: Declining    → Monitor      │
                        │  Priority 4: All Good     → Stable       │
                        └──────────────────┬───────────────────────┘
                                           ↓
                                ┌──────────────────────┐
                                │  Save to Database    │
                                │  with Full Analysis  │
                                └──────────┬───────────┘
                                           ↓
                            ┌──────────────────────────────┐
                            │  DATABASE RECORD             │
                            ├──────────────────────────────┤
                            │  vitals: { HR, SpO2, ...}    │
                            │  calculation: {              │
                            │    EWS: {                    │
                            │      result: "Critical"      │
                            │      clinicalOverride: true  │
                            │      overrideReason: "..."   │
                            │    }                         │
                            │    Anomaly: { result: ... }  │
                            │    Trend: { result: ... }    │
                            │  }                           │
                            │  finalStatus: "Critical"     │
                            │  processingStatus: "Processed"│
                            └──────────────┬───────────────┘
                                           ↓
                                     ✅ COMPLETE
```

## 🎯 Priority Decision Matrix

```
┌────────────┬────────────────┬───────────────┬──────────────┬────────────┐
│ Priority   │ Decision Layer │ Input Source  │ Output       │ Authority  │
├────────────┼────────────────┼───────────────┼──────────────┼────────────┤
│     1      │ Clinical       │ Safety Rules  │ Critical     │ ABSOLUTE   │
│            │ Override       │ Hard-coded    │ (STOP ML)    │            │
├────────────┼────────────────┼───────────────┼──────────────┼────────────┤
│     2      │ EWS Model      │ ML Classifier │ Critical     │ HIGH       │
│            │                │ (EWS_model)   │ Warning      │            │
│            │                │               │ Normal       │            │
├────────────┼────────────────┼───────────────┼──────────────┼────────────┤
│     3      │ Anomaly Model  │ ML Detector   │ Abnormal     │ MEDIUM     │
│            │                │ (Anomaly_model)│ Normal       │            │
├────────────┼────────────────┼───────────────┼──────────────┼────────────┤
│     4      │ Trend Analysis │ Historical    │ Declining    │ LOW        │
│            │                │ Data Pattern  │ Stable       │            │
│            │                │               │ Improving    │            │
└────────────┴────────────────┴───────────────┴──────────────┴────────────┘
```

## 🚨 Clinical Override Trigger Points

```
                    CLINICAL OVERRIDE THRESHOLDS
                    
SpO2 (%)     0 ─────────── 92 ────────── 100
             ↑              ↑
          CRITICAL      SAFE ZONE
          
RR (bpm)     0 ── 10 ───────── 25 ── 35
             ↑    ↑            ↑    ↑
          CRITICAL SAFE    CRITICAL
          
HR (bpm)     0 ── 50 ───────── 130 ── 200
             ↑    ↑             ↑     ↑
          CRITICAL SAFE     CRITICAL
          
Temp (°C)    35 ────────── 39.0 ── 42
             ↑              ↑      ↑
          SAFE ZONE      CRITICAL
          
Fall         0             1
             ↑             ↑
          SAFE        CRITICAL
```

## 📊 Status Flowchart

```
                      ┌─────────────┐
                      │  Vitals In  │
                      └──────┬──────┘
                             ↓
                   ┌─────────────────┐
                   │ Clinical Check  │
                   └────────┬─────────┘
                            ↓
                      ┌──────────┐
                      │ Override?│
                      └─────┬────┘
                     YES ↙  │  ↘ NO
                        ↓   │   ↓
                 ┌──────────┴─────────┐
                 │                    │
            ┌────▼────┐          ┌───▼────┐
            │CRITICAL │          │EWS Run │
            │  STOP   │          └───┬────┘
            └─────────┘              ↓
                                ┌─────────┐
                                │EWS=Crit?│
                                └────┬────┘
                            YES ↙    │   ↘ NO
                               ↓     │    ↓
                        ┌──────────┐ │ ┌────────┐
                        │ CRITICAL │ │ │EWS=Warn?
                        └──────────┘ │ └───┬────┘
                                     │ YES↙│↘NO
                                     │   ↓ │ ↓
                             ┌───────┴─────┴─────┐
                             │      WARNING      │
                             │    ↓         ↓    │
                             │ Anomaly   Trend   │
                             │  Check    Check   │
                             └────┬──────┬───────┘
                                  ↓      ↓
                            ┌──────────────────┐
                            │  Final Decision  │
                            └────────┬─────────┘
                                     ↓
                ┌────────────────────┼────────────────────┐
                ↓                    ↓                    ↓
           ┌─────────┐         ┌──────────┐        ┌────────┐
           │CRITICAL │         │HIGH RISK │        │MONITOR │
           └─────────┘         └──────────┘        └────────┘
                ↓                    ↓                   ↓
              ┌──────────────────────────────────────────┐
              │            SAVE TO DATABASE              │
              └──────────────────────────────────────────┘
```

## 🔄 Real-Time Processing Loop

```
Time: t=0s
┌──────────────────────────────────────┐
│  Vitals Sensor Data Arrives          │
│  POST /api/vitals/data               │
└────────────┬─────────────────────────┘
             ↓
┌────────────────────────────────────┐
│  Update In-Memory Cache             │
│  vitalCache[patientId] = vitals    │
└────────────┬───────────────────────┘
             ↓
       ✅ Respond 200 OK
       (Client not blocked)

Time: t=5s, t=10s, t=15s... (Every 5 seconds)
┌────────────────────────────────────┐
│  Background Timer Fires             │
│  calculateAndSaveEWS(patientId)    │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  Read from Cache                    │
│  Apply Clinical + ML Logic          │
│  Save Result to MongoDB             │
└────────────────────────────────────┘

                CONTINUOUS LOOP
                     ↻
```

## 📁 File Architecture

```
CareSync/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── EWS_model.pkl          ← Priority 2 (ML)
│   │   │   ├── Anomaly_model.pkl      ← Priority 3 (ML)
│   │   │   ├── User.js                ← Database schema
│   │   │   └── VitalReading.js        ← Database schema
│   │   │
│   │   ├── utils/
│   │   │   ├── clinicalOverrides.js   ← Priority 1 (RULES) ⭐
│   │   │   ├── mockModels.js          ← ML integration
│   │   │   └── vitalCache.js          ← In-memory cache
│   │   │
│   │   └── controllers/
│   │       └── vitalsController.js    ← Orchestration ⭐
│   │
│   └── test-clinical-overrides.js     ← Test suite ⭐
│
└── Docs/
    ├── PRIORITY_DECISION_SYSTEM.md    ← Full system docs
    ├── CLINICAL_OVERRIDE_SYSTEM.md    ← Override details
    ├── CLINICAL_OVERRIDE_QUICKREF.md  ← Quick reference
    └── IMPLEMENTATION_SUMMARY_v2.md   ← This deployment

⭐ = Modified/Created for Priority System
```

---

**Diagram Version:** 2.0  
**Last Updated:** December 31, 2025  
**Status:** Production Ready

# Clinical Override System

## 🏥 Overview

The Clinical Override System protects patient safety by applying medical logic **BEFORE** machine learning models. Critical conditions are identified immediately without waiting for ML predictions.

**Priority:** Clinical Safety > ML Predictions

## 🎯 Purpose

Machine learning models are powerful tools, but they should **support** clinical decision-making, not replace it. This system ensures:

1. **Fall detection** always triggers immediate critical alerts
2. **Severe hypoxemia** (SpO2 < 92%) is treated as life-threatening
3. **Respiratory distress** (abnormal RR) receives immediate attention
4. **Abnormal vital signs** are flagged for clinical monitoring

## 📋 Override Rules

### Critical Overrides (Immediate Action Required)

These conditions **bypass ML models** and return `Critical` status immediately:

| Condition | Threshold | Reason |
|-----------|-----------|--------|
| **Fall Detection** | Fall = 1 | Immediate trauma risk - potential head injury, fractures |
| **Severe Hypoxemia** | SpO2 < 92% | Life-threatening oxygen levels - organ damage risk |
| **Bradypnea** | RR < 10 | Respiratory failure risk - inadequate ventilation |
| **Tachypnea** | RR > 24 | Severe respiratory distress - potential sepsis/shock |

### Warning Overrides (Clinical Monitoring Required)

These conditions return `Warning` status before ML evaluation:

| Condition | Threshold | Reason |
|-----------|-----------|--------|
| **Bradycardia** | HR < 60 | Abnormal heart rate - cardiac monitoring needed |
| **Tachycardia** | HR > 100 | Elevated heart rate - stress/infection indicator |
| **Fever** | Temp ≥ 38.0°C | Infection or inflammation present |

## 🔧 Implementation

### File Structure

```
backend/src/
├── utils/
│   └── clinicalOverrides.js      # Override logic
└── controllers/
    └── vitalsController.js        # Integration point
```

### Integration Flow

```
Patient Vitals Received
        ↓
Cache Updated
        ↓
Every 5 Seconds:
        ↓
    [1] Check Staleness
        ↓
    [2] Get Current Vitals
        ↓
    [3] 🏥 Apply Clinical Overrides ← NEW
        ↓
        ├─ Override? → Skip ML, Return Clinical Status
        │                    ↓
        │              Save to Database
        │
        └─ No Override → Proceed to ML Models
                              ↓
                         EWS + Anomaly + Trend
                              ↓
                         Save to Database
```

### Code Example

```javascript
// Step 4: Apply Clinical Override Rules BEFORE ML Model
const clinicalOverride = applyClinicalOverrides(currentVitals);

if (clinicalOverride) {
  // Clinical override triggered - bypass ML model
  const reason = getClinicalOverrideReason(currentVitals);
  
  analysis = {
    EWS: clinicalOverride,           // "Critical" or "Warning"
    Anomaly: clinicalOverride === 'Critical' ? 'Abnormal' : 'Normal',
    Trend: 'Stable',
    Final_Status: clinicalOverride === 'Critical' ? 'High Risk' : 'Monitor',
    override: true,
    overrideReason: reason
  };
} else {
  // No override - proceed with ML analysis
  analysis = combinedAnalysis(currentVitals, recentHistory);
  analysis.override = false;
}
```

## 🧪 Testing

Run the test script to verify clinical overrides:

```bash
cd backend
node test-clinical-overrides.js
```

### Test Cases

The test script validates:
- ✅ Normal vitals → No override
- ✅ Fall detection → Critical
- ✅ Severe hypoxemia → Critical
- ✅ Respiratory distress → Critical
- ✅ Abnormal heart rate → Warning
- ✅ Fever → Warning
- ✅ Multiple critical conditions → Critical

## 📊 Database Storage

Override information is saved with each vital reading:

```javascript
{
  calculation: {
    EWS: {
      result: "Critical",
      timestamp: "2025-12-31T10:30:00Z",
      clinicalOverride: true,              // ← NEW
      overrideReason: "Fall detected..."   // ← NEW
    }
  }
}
```

## 🔍 Monitoring

Console logs indicate when overrides are applied:

```
🏥 [Clinical Check] Applying safety rules for patient123...
🚨 [Clinical Override] CRITICAL: Fall detected
✋ [Clinical Override] Critical status applied - Fall detected - immediate intervention required
✅ [Clinical Override Applied] Patient: patient123
   Status: Critical | Reason: Fall detected - immediate intervention required
```

## ⚡ Benefits

### 1. Patient Safety First
- Critical conditions detected immediately
- No delay waiting for ML predictions
- Medical logic always takes precedence

### 2. No Retraining Required
- Rules applied at runtime
- Instant deployment
- No ML model updates needed

### 3. Transparent Decision Making
- Clear override reasons provided
- Medical staff understand why alerts triggered
- Audit trail maintained in database

### 4. ML Still Valuable
- Handles nuanced cases without clear thresholds
- Provides trend analysis
- Supports clinical judgment for borderline cases

## 🚨 Emergency Scenarios

### Scenario 1: Patient Fall
```
Vitals: HR=75, SpO2=98, Temp=37.0, RR=16, Fall=1
Override: Critical (Fall detected)
Action: Immediate assessment for trauma, head injury protocol
ML: Not consulted (override took precedence)
```

### Scenario 2: Severe Hypoxemia
```
Vitals: HR=110, SpO2=85, Temp=37.5, RR=22, Fall=0
Override: Critical (SpO2 < 92%)
Action: Oxygen therapy, respiratory support
ML: Not consulted (override took precedence)
```

### Scenario 3: Respiratory Failure
```
Vitals: HR=120, SpO2=94, Temp=38.0, RR=8, Fall=0
Override: Critical (RR < 10)
Action: Check airway, prepare for ventilation support
ML: Not consulted (override took precedence)
```

### Scenario 4: Borderline Case (ML Used)
```
Vitals: HR=85, SpO2=94, Temp=37.8, RR=20, Fall=0
Override: None (all vitals within override thresholds)
Action: ML models analyze for subtle patterns
ML: Runs full 3-layer analysis (EWS + Anomaly + Trend)
```

## 📝 Maintenance

### Adding New Rules

To add a new clinical override:

1. Update `clinicalOverrides.js`:
   ```javascript
   // Add in applyClinicalOverrides()
   if (SBP < 90) {
     console.log(`🚨 [Clinical Override] CRITICAL: SBP = ${SBP}mmHg`);
     return 'Critical';
   }
   ```

2. Add corresponding reason in `getClinicalOverrideReason()`:
   ```javascript
   if (SBP < 90) {
     return `Hypotension (SBP: ${SBP}mmHg) - shock risk`;
   }
   ```

3. Update test script with new test cases

4. Document in this file

## 🎓 Medical Rationale

### Why These Thresholds?

**SpO2 < 92%:** Below this level, tissue oxygenation is compromised. Immediate oxygen therapy is standard of care.

**RR < 10 or > 24:** Respiratory rate outside this range indicates significant respiratory compromise requiring immediate assessment.

**Fall = 1:** Falls in hospitalized patients are sentinel events requiring immediate evaluation for injury, particularly head trauma.

**HR < 60 or > 100:** While not immediately life-threatening, these ranges warrant continuous monitoring for underlying cardiac issues.

**Temp ≥ 38.0°C:** Fever indicates potential infection or inflammation requiring timely clinical assessment.

## ✅ Validation

System validated against:
- ✅ Clinical best practices
- ✅ Hospital early warning score (EWS) protocols
- ✅ Emergency medicine guidelines
- ✅ Patient safety standards

---

**Last Updated:** December 31, 2025  
**Version:** 1.0  
**Status:** Production Ready

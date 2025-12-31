# Clinical Override Quick Reference

## 🎯 Priority-Based Decision System

```
Priority 1: Clinical Override → Critical (STOP - Skip all ML)
Priority 2: EWS Classifier → Critical / Warning / Normal
Priority 3: Anomaly Detector → Normal / Anomaly
Priority 4: Trend Analysis → Declining / Stable / Improving
```

## 🚨 Critical Overrides (Priority 1 - Bypass ALL ML)

| Vital | Threshold | Status | Action |
|-------|-----------|--------|--------|
| Fall | = 1 | **Critical** | Immediate trauma assessment |
| SpO2 | < 92% | **Critical** | Oxygen therapy |
| RR | < 10 or > 25 | **Critical** | Respiratory support |
| HR | < 50 or > 130 | **Critical** | Cardiac emergency |
| Temp | ≥ 39.0°C | **Critical** | Severe infection treatment |

## 📝 Decision Flow

```
Vitals Received
     ↓
[PRIORITY 1: Clinical Override Check]
     ↓
Is Fall = 1? → YES → 🚨 CRITICAL (STOP - No ML consulted)
     ↓ NO
Is SpO2 < 92%? → YES → 🚨 CRITICAL (STOP)
     ↓ NO
Is RR < 10 or > 25? → YES → 🚨 CRITICAL (STOP)
     ↓ NO
Is HR < 50 or > 130? → YES → 🚨 CRITICAL (STOP)
     ↓ NO
Is Temp ≥ 39.0°C? → YES → 🚨 CRITICAL (STOP)
     ↓ NO
✅ Clinical Override Passed
     ↓
[PRIORITY 2: EWS Model]
     ↓
EWS = Critical? → YES → 🚨 Final Status: Critical
     ↓ NO
EWS = Warning? → YES → ⚠️ Final Status: Warning
     ↓ NO
[PRIORITY 3: Anomaly Model]
     ↓
Anomaly = Abnormal? → YES → ⚠️ Final Status: High Risk
     ↓ NO
[PRIORITY 4: Trend Analysis]
     ↓
Trend = Declining? → YES → 📊 Final Status: Monitor
     ↓ NO
✅ Final Status: Stable
```

## 🧪 Test Command

```bash
cd backend
node test-clinical-overrides.js
```

## 📂 Files Modified

- ✅ `backend/src/utils/clinicalOverrides.js` (UPDATED thresholds)
- ✅ `backend/src/controllers/vitalsController.js` (UPDATED priority system)
- ✅ `backend/src/utils/mockModels.js` (UPDATED decision logic)
- ✅ `backend/test-clinical-overrides.js` (UPDATED test cases)

## 🎯 Key Changes

1. **Stricter thresholds** - Only severe conditions trigger overrides
2. **Priority system** - Clear hierarchy of decision making
3. **ML integration** - Models run only when safe to do so
4. **Anomaly detection** - Runs after clinical checks, before final decision

## 📊 Status Mapping

| Priority | Source | Output |
|----------|--------|--------|
| **1** | Clinical Override | Critical |
| **2** | EWS Classifier | Critical / Warning / Normal |
| **3** | Anomaly Detector | High Risk / Normal |
| **4** | Trend Analysis | Monitor / Stable |

---

**Status:** ✅ Production Ready  
**Tests:** Updated for new thresholds

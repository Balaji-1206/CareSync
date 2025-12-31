# Clinical Override Quick Reference

## 🚨 Critical Overrides (Bypass ML)

| Vital | Threshold | Status | Action |
|-------|-----------|--------|--------|
| Fall | = 1 | **Critical** | Immediate trauma assessment |
| SpO2 | < 92% | **Critical** | Oxygen therapy |
| RR | < 10 or > 24 | **Critical** | Respiratory support |

## ⚠️ Warning Overrides (Before ML)

| Vital | Threshold | Status | Action |
|-------|-----------|--------|--------|
| HR | < 60 or > 100 | **Warning** | Cardiac monitoring |
| Temp | ≥ 38.0°C | **Warning** | Infection assessment |

## 📝 Decision Flow

```
Vitals Received
     ↓
Is Fall = 1? → YES → ✋ CRITICAL (stop)
     ↓ NO
Is SpO2 < 92%? → YES → ✋ CRITICAL (stop)
     ↓ NO
Is RR < 10 or > 24? → YES → ✋ CRITICAL (stop)
     ↓ NO
Is HR < 60 or > 100? → YES → ✋ WARNING (stop)
     ↓ NO
Is Temp ≥ 38.0°C? → YES → ✋ WARNING (stop)
     ↓ NO
✅ Proceed to ML Models
```

## 🧪 Test Command

```bash
cd backend
node test-clinical-overrides.js
```

## 📂 Files Modified

- ✅ `backend/src/utils/clinicalOverrides.js` (NEW)
- ✅ `backend/src/controllers/vitalsController.js` (UPDATED)
- ✅ `backend/test-clinical-overrides.js` (NEW)

## 🎯 Key Points

1. **Clinical safety > ML predictions**
2. **No retraining needed** - rules apply at runtime
3. **Transparent decisions** - override reasons logged and saved
4. **ML still valuable** - handles nuanced cases

---

**Status:** ✅ Production Ready  
**Tests:** All 9 passing

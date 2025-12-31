/**
 * Vitals Controller
 * 
 * Responsibilities:
 * 1. Receive and validate sensor data
 * 2. Update in-memory cache
 * 3. Trigger EWS calculations every 5 seconds
 * 4. Run 3-layer analysis (EWS, Anomaly, Trend)
 * 5. Save results to database
 */

const VitalReading = require('../models/VitalReading');
const vitalCache = require('../utils/vitalCache');
const { combinedAnalysis } = require('../utils/mockModels');
const { applyClinicalOverrides, getClinicalOverrideReason } = require('../utils/clinicalOverrides');

// Track EWS timers per patient
const ewsTimers = {}; // { patientId: intervalId }
const historicalData = {}; // { patientId: [array of recent vitals] }

/**
 * POST /api/vitals/data
 * Receive sensor data and update cache
 */
const receiveVitalData = async (req, res) => {
  try {
    const { patientId, vitals } = req.body;

    // Validate required fields
    if (!patientId || !vitals) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: patientId, vitals'
      });
    }

    // Validate vital fields
    const requiredVitals = ['HR', 'SpO2', 'Temp', 'RR', 'Fall'];
    for (let vital of requiredVitals) {
      if (!vitals[vital] || typeof vitals[vital].value !== 'number') {
        return res.status(400).json({
          success: false,
          message: `Invalid vital data for ${vital}`
        });
      }
    }

    // Ensure all vitals have timestamps
    Object.keys(vitals).forEach(key => {
      if (!vitals[key].time) {
        vitals[key].time = new Date();
      }
    });

    console.log(`\n📥 [Vitals] Received data for patient: ${patientId}`);
    console.log(`   HR: ${vitals.HR.value}, SpO2: ${vitals.SpO2.value}, Temp: ${vitals.Temp.value}, RR: ${vitals.RR.value}, Fall: ${vitals.Fall.value}`);

    // Step 1: Update cache
    vitalCache.updateCache(patientId, vitals);

    // Step 2: Initialize EWS timer if not already running for this patient
    if (!ewsTimers[patientId]) {
      startEWSTimer(patientId);
    }

    // Step 3: Initialize historical data storage if needed
    if (!historicalData[patientId]) {
      historicalData[patientId] = [];
    }

    // Respond immediately with cache state
    res.json({
      success: true,
      message: 'Vital data received and cached',
      cachedState: vitalCache.getLatestState(patientId)
    });

  } catch (error) {
    console.error('[Vitals Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process vital data',
      error: error.message
    });
  }
};

/**
 * Start 5-second EWS calculation timer for a patient
 */
function startEWSTimer(patientId) {
  console.log(`⏰ [EWS Timer] Started for patient: ${patientId}`);

  ewsTimers[patientId] = setInterval(async () => {
    await calculateAndSaveEWS(patientId);
  }, 5000); // Every 5 seconds
}

/**
 * Calculate EWS and save to database
 * This is the core logic triggered every 5 seconds
 */
async function calculateAndSaveEWS(patientId) {
  try {
    // Step 1: Check staleness
    const stalenessCheck = vitalCache.checkStaleness(patientId);

    if (stalenessCheck.isStale) {
      console.log(`⚠️ [EWS] Stale data for ${patientId}. Missing/old: ${stalenessCheck.staleVitals.join(', ')}`);
      
      // Save to DB with "Stale" status
      const record = new VitalReading({
        patientId,
        vitals: {
          HR: { value: 0, time: new Date() },
          SpO2: { value: 0, time: new Date() },
          Temp: { value: 0, time: new Date() },
          RR: { value: 0, time: new Date() },
          Fall: { value: 0, time: new Date() }
        },
        processingStatus: 'Stale',
        stalePitals: stalenessCheck.staleVitals
      });

      await record.save();
      return; // Skip EWS calculation
    }

    // Step 2: Get current vital values from cache
    const currentVitals = vitalCache.getVitalValuesForModel(patientId);
    
    if (!currentVitals) {
      console.log(`⚠️ [EWS] No cached data for ${patientId}`);
      return;
    }

    // Step 3: Get historical data for trend analysis
    const recentHistory = historicalData[patientId] || [];

    // Step 4: Apply Clinical Override Rules BEFORE ML Model
    console.log(`🏥 [Clinical Check] Applying safety rules for ${patientId}...`);
    const clinicalOverride = applyClinicalOverrides(currentVitals);
    
    let analysis;
    
    if (clinicalOverride) {
      // Clinical override triggered - bypass ML model for safety
      const reason = getClinicalOverrideReason(currentVitals);
      console.log(`✋ [Clinical Override] ${clinicalOverride} status applied - ${reason}`);
      
      // Create override analysis result (ML models not used)
      analysis = {
        EWS: clinicalOverride,
        Anomaly: clinicalOverride === 'Critical' ? 'Abnormal' : 'Normal',
        Trend: 'Stable', // Trend not relevant for immediate clinical overrides
        Final_Status: clinicalOverride === 'Critical' ? 'High Risk' : 'Monitor',
        override: true,
        overrideReason: reason
      };
    } else {
      // No clinical override - proceed with ML model analysis
      console.log(`🧠 [EWS] Running ML analysis for ${patientId}...`);
      analysis = combinedAnalysis(currentVitals, recentHistory);
      analysis.override = false;
    }

    // Step 5: Store in historical data (keep last 30 points)
    recentHistory.push({
      HR: currentVitals.HR,
      SpO2: currentVitals.SpO2,
      Temp: currentVitals.Temp,
      RR: currentVitals.RR,
      Fall: currentVitals.Fall,
      timestamp: new Date()
    });

    if (recentHistory.length > 30) {
      recentHistory.shift(); // Remove oldest
    }
    historicalData[patientId] = recentHistory;

    // Step 6: Create and save vitals record to database
    const vitalReading = new VitalReading({
      patientId,
      vitals: {
        HR: { value: currentVitals.HR, time: new Date() },
        SpO2: { value: currentVitals.SpO2, time: new Date() },
        Temp: { value: currentVitals.Temp, time: new Date() },
        RR: { value: currentVitals.RR, time: new Date() },
        Fall: { value: currentVitals.Fall, time: new Date() }
      },
      calculation: {
        EWS: {
          result: analysis.EWS,
          timestamp: new Date(),
          clinicalOverride: analysis.override || false,
          overrideReason: analysis.overrideReason || null
        },
        Anomaly: {
          result: analysis.Anomaly,
          timestamp: new Date()
        },
        Trend: {
          result: analysis.Trend,
          timestamp: new Date()
        }
      },
      finalStatus: analysis.Final_Status,
      processingStatus: 'Processed'
    });

    await vitalReading.save();

    if (analysis.override) {
      console.log(`✅ [Clinical Override Applied] Patient: ${patientId}`);
      console.log(`   Status: ${analysis.EWS} | Reason: ${analysis.overrideReason}`);
    } else {
      console.log(`✅ [ML Analysis Complete] Patient: ${patientId}`);
      console.log(`   EWS: ${analysis.EWS} | Anomaly: ${analysis.Anomaly} | Trend: ${analysis.Trend} | Status: ${analysis.Final_Status}`);
    }

  } catch (error) {
    console.error(`[EWS Error] Patient ${patientId}:`, error.message);
  }
}

/**
 * GET /api/vitals/latest
 * Get latest cached state for a patient
 */
const getLatestVitals = (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'patientId is required'
      });
    }

    const latestState = vitalCache.getLatestState(patientId);

    if (!latestState) {
      return res.json({
        success: false,
        message: 'No vital data for this patient yet'
      });
    }

    res.json({
      success: true,
      patientId,
      data: latestState,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Get Latest Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve vital data',
      error: error.message
    });
  }
};

/**
 * GET /api/vitals/ews-status
 * Get latest EWS calculation result from database
 */
const getEWSStatus = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'patientId is required'
      });
    }

    const latestReading = await VitalReading.findOne({ patientId })
      .sort({ recordedAt: -1 })
      .select('vitals calculation finalStatus processingStatus recordedAt stalePitals');

    if (!latestReading) {
      return res.json({
        success: false,
        message: 'No EWS data available yet'
      });
    }

    res.json({
      success: true,
      patientId,
      data: {
        EWS: latestReading.calculation?.EWS?.result || 'N/A',
        Anomaly: latestReading.calculation?.Anomaly?.result || 'N/A',
        Trend: latestReading.calculation?.Trend?.result || 'N/A',
        Final_Status: latestReading.finalStatus,
        Last_Update: latestReading.recordedAt,
        Processing_Status: latestReading.processingStatus,
        Stale_Vitals: latestReading.stalePitals || []
      }
    });

  } catch (error) {
    console.error('[Get EWS Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve EWS status',
      error: error.message
    });
  }
};

/**
 * GET /api/vitals/history
 * Get historical vital readings for a patient
 */
const getVitalHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { limit = 50 } = req.query;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'patientId is required'
      });
    }

    const history = await VitalReading.find({ patientId })
      .sort({ recordedAt: -1 })
      .limit(parseInt(limit))
      .select('vitals calculation finalStatus processingStatus recordedAt');

    res.json({
      success: true,
      patientId,
      count: history.length,
      data: history
    });

  } catch (error) {
    console.error('[Get History Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve history',
      error: error.message
    });
  }
};

/**
 * Cleanup: Stop timer for a patient
 */
function stopEWSTimer(patientId) {
  if (ewsTimers[patientId]) {
    clearInterval(ewsTimers[patientId]);
    delete ewsTimers[patientId];
    delete historicalData[patientId];
    console.log(`⏹️ [EWS Timer] Stopped for patient: ${patientId}`);
  }
}

module.exports = {
  receiveVitalData,
  getLatestVitals,
  getEWSStatus,
  getVitalHistory,
  stopEWSTimer,
  startEWSTimer
};

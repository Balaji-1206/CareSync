/**
 * ML Model Integration Layer
 * 
 * This module bridges Node.js backend with Python .pkl models
 * Uses child_process to execute Python predictions
 * Includes fallback to mock logic if Python fails
 */

const { spawn } = require('child_process');
const path = require('path');

/**
 * Call Python ML model for prediction
 * @param {string} modelName - 'ews' or 'anomaly'
 * @param {object} vitals - { HR, SpO2, Temp, RR, Fall }
 * @returns {Promise<string>} - Prediction result
 */
async function callPythonModel(modelName, vitals) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '..', '..', 'predict.py');
    
    const args = [
      pythonScript,
      modelName,
      vitals.HR.toString(),
      vitals.SpO2.toString(),
      vitals.Temp.toString(),
      vitals.RR.toString(),
      vitals.Fall.toString()
    ];

    const python = spawn('python', args);
    
    let dataString = '';
    let errorString = '';

    python.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorString += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        console.error(`[ML Model Error] ${modelName}:`, errorString);
        reject(new Error(`Python process exited with code ${code}`));
        return;
      }

      try {
        const result = JSON.parse(dataString);
        if (result.success) {
          resolve(result.prediction);
        } else {
          reject(new Error(result.error));
        }
      } catch (error) {
        reject(new Error(`Failed to parse Python output: ${error.message}`));
      }
    });
  });
}

/**
 * EWS Model - Early Warning Score with Python ML model
 * Falls back to rule-based logic if Python fails
 */
async function ewsModel(vitals) {
  try {
    const prediction = await callPythonModel('ews', vitals);
    console.log(`[EWS Model] Python prediction: ${prediction}`);
    return prediction;
  } catch (error) {
    console.warn(`[EWS Model] Python failed, using fallback:`, error.message);
    return ewsModelFallback(vitals);
  }
}

/**
 * Anomaly Model - Anomaly Detection with Python ML model
 * Falls back to rule-based logic if Python fails
 */
async function anomalyModel(vitals) {
  try {
    const prediction = await callPythonModel('anomaly', vitals);
    console.log(`[Anomaly Model] Python prediction: ${prediction}`);
    return prediction;
  } catch (error) {
    console.warn(`[Anomaly Model] Python failed, using fallback:`, error.message);
    return anomalyModelFallback(vitals);
  }
}

/**
 * Fallback EWS logic (rule-based)
 */
function ewsModelFallback(vitals) {
  const { HR, SpO2, Temp, RR, Fall } = vitals;

  if (Fall === 1) return 'Critical';
  if (SpO2 < 90) return 'Critical';
  if (HR < 40 || HR > 120) return 'Warning';
  if (Temp < 36 || Temp > 39) return 'Warning';
  if (RR < 12 || RR > 25) return 'Warning';

  return 'Normal';
}

/**
 * Fallback Anomaly logic (rule-based)
 */
function anomalyModelFallback(vitals) {
  const { HR, SpO2, Temp, RR, Fall } = vitals;

  if (Fall === 1) return 'Abnormal';
  if (SpO2 < 85) return 'Abnormal';
  if (HR < 35 || HR > 150) return 'Abnormal';
  if (Temp < 35 || Temp > 40) return 'Abnormal';
  if (RR < 10 || RR > 30) return 'Abnormal';

  return 'Normal';
}

/**
 * Trend Model - Medically Realistic Trend Analysis (no ML, rule-based)
 * 
 * Analyzes patient vital trends with medical context:
 * - SpO2: Lower is always concerning
 * - Temperature: Rising fever is concerning
 * - Respiratory Rate: Any large change indicates instability
 * - Heart Rate: Context-dependent (tachycardia worsening vs bradycardia worsening)
 * 
 * @param {object} vitals - Current vital readings { HR, SpO2, Temp, RR, Fall }
 * @param {array} historicalData - Array of past vital readings
 * @returns {object} { status: string, reason: string, vital: string }
 */
function trendModel(vitals, historicalData = []) {
  // Need at least 3 data points to determine a trend
  if (!historicalData || historicalData.length < 3) {
    return {
      status: 'Stable',
      reason: 'Insufficient historical data for trend analysis',
      vital: 'None'
    };
  }

  // Use last 10 readings for trend analysis (or all if less than 10)
  const recentData = historicalData.slice(-10);
  
  if (recentData.length < 3) {
    return {
      status: 'Stable',
      reason: 'Insufficient recent data for trend analysis',
      vital: 'None'
    };
  }

  // Split data into first half and second half to compare trends
  const midpoint = Math.floor(recentData.length / 2);
  const firstHalf = recentData.slice(0, midpoint);
  const secondHalf = recentData.slice(midpoint);

  // Calculate averages for each vital in both halves
  const calculateAverage = (data, field) => {
    const validValues = data.filter(d => d[field] != null && !isNaN(d[field]));
    if (validValues.length === 0) return null;
    return validValues.reduce((sum, d) => sum + d[field], 0) / validValues.length;
  };

  const avgHRFirst = calculateAverage(firstHalf, 'HR');
  const avgHRSecond = calculateAverage(secondHalf, 'HR');
  const avgSpO2First = calculateAverage(firstHalf, 'SpO2');
  const avgSpO2Second = calculateAverage(secondHalf, 'SpO2');
  const avgTempFirst = calculateAverage(firstHalf, 'Temp');
  const avgTempSecond = calculateAverage(secondHalf, 'Temp');
  const avgRRFirst = calculateAverage(firstHalf, 'RR');
  const avgRRSecond = calculateAverage(secondHalf, 'RR');

  // PRIORITY 1: Check SpO2 trend (unambiguous - lower is always concerning)
  if (avgSpO2First != null && avgSpO2Second != null) {
    const spo2Trend = avgSpO2Second - avgSpO2First;
    
    if (spo2Trend <= -3) {
      return {
        status: 'Declining',
        reason: `SpO2 declining by ${Math.abs(spo2Trend).toFixed(1)}% (${avgSpO2First.toFixed(1)}% → ${avgSpO2Second.toFixed(1)}%)`,
        vital: 'SpO2'
      };
    }
  }

  // PRIORITY 2: Check Temperature trend (rising fever is concerning)
  if (avgTempFirst != null && avgTempSecond != null) {
    const tempTrend = avgTempSecond - avgTempFirst;
    
    if (tempTrend >= 1.5) {
      return {
        status: 'Declining',
        reason: `Temperature rising by ${tempTrend.toFixed(1)}°C (${avgTempFirst.toFixed(1)}°C → ${avgTempSecond.toFixed(1)}°C)`,
        vital: 'Temperature'
      };
    }
  }

  // PRIORITY 3: Check Respiratory Rate trend (large changes indicate instability)
  if (avgRRFirst != null && avgRRSecond != null) {
    const rrTrend = avgRRSecond - avgRRFirst;
    
    if (Math.abs(rrTrend) > 5) {
      return {
        status: 'Declining',
        reason: `Respiratory rate ${rrTrend > 0 ? 'increasing' : 'decreasing'} by ${Math.abs(rrTrend).toFixed(1)} bpm (${avgRRFirst.toFixed(1)} → ${avgRRSecond.toFixed(1)} bpm)`,
        vital: 'RR'
      };
    }
  }

  // PRIORITY 4: Check Heart Rate trend WITH CONTEXT
  if (avgHRFirst != null && avgHRSecond != null) {
    const hrTrend = avgHRSecond - avgHRFirst;
    const currentHR = vitals.HR || avgHRSecond;
    
    // Case 1: Tachycardia worsening (HR > 110 and increasing)
    if (currentHR > 110 && hrTrend >= 10) {
      return {
        status: 'Declining',
        reason: `Tachycardia worsening - HR increasing by ${hrTrend.toFixed(1)} bpm (${avgHRFirst.toFixed(1)} → ${avgHRSecond.toFixed(1)} bpm)`,
        vital: 'HR'
      };
    }
    
    // Case 2: Bradycardia worsening (HR < 55 and decreasing)
    if (currentHR < 55 && hrTrend <= -5) {
      return {
        status: 'Declining',
        reason: `Bradycardia worsening - HR decreasing by ${Math.abs(hrTrend).toFixed(1)} bpm (${avgHRFirst.toFixed(1)} → ${avgHRSecond.toFixed(1)} bpm)`,
        vital: 'HR'
      };
    }
    
    // Note: Other HR changes are context-dependent and not automatically concerning
    // Example: HR 120→110 is GOOD (tachycardia improving), not bad
  }

  // PRIORITY 5: Check for IMPROVEMENTS in concerning vitals
  
  // SpO2 improvement (was low, now improving)
  if (avgSpO2First != null && avgSpO2Second != null) {
    const spo2Trend = avgSpO2Second - avgSpO2First;
    
    if (avgSpO2First < 95 && spo2Trend >= 2) {
      return {
        status: 'Improving',
        reason: `SpO2 improving by ${spo2Trend.toFixed(1)}% from low baseline (${avgSpO2First.toFixed(1)}% → ${avgSpO2Second.toFixed(1)}%)`,
        vital: 'SpO2'
      };
    }
  }

  // Temperature improvement (was high, now dropping)
  if (avgTempFirst != null && avgTempSecond != null) {
    const tempTrend = avgTempSecond - avgTempFirst;
    
    if (avgTempFirst > 38 && tempTrend <= -0.5) {
      return {
        status: 'Improving',
        reason: `Fever resolving - Temperature dropping by ${Math.abs(tempTrend).toFixed(1)}°C (${avgTempFirst.toFixed(1)}°C → ${avgTempSecond.toFixed(1)}°C)`,
        vital: 'Temperature'
      };
    }
  }

  // No significant trends detected
  return {
    status: 'Stable',
    reason: 'No significant trends detected in vital signs',
    vital: 'None'
  };
}

/**
 * Combined Analysis with Priority-Based Decision
 * Now uses async ML model calls
 */
async function combinedAnalysis(vitals, historicalData = []) {
  // Run EWS Model (Priority 2) - with Python ML
  const ewsResult = await ewsModel(vitals);
  
  // Run Anomaly Model (Priority 3) - with Python ML
  const anomalyResult = await anomalyModel(vitals);
  
  // Run Trend Model (Priority 4) - rule-based with medical context
  const trendResult = trendModel(vitals, historicalData);

  // Priority-based Final Status Decision
  let finalStatus = 'Stable';
  
  if (ewsResult === 'Critical') {
    finalStatus = 'Critical';
  } else if (ewsResult === 'Warning') {
    finalStatus = 'Warning';
  } else if (anomalyResult === 'Abnormal') {
    finalStatus = 'High Risk';
  } else if (trendResult.status === 'Declining') {
    finalStatus = 'Monitor';
  } else {
    finalStatus = 'Stable';
  }

  return {
    EWS: ewsResult,
    Anomaly: anomalyResult,
    Trend: trendResult.status,
    Trend_Details: {
      reason: trendResult.reason,
      vital: trendResult.vital
    },
    Final_Status: finalStatus
  };
}

module.exports = {
  ewsModel,
  anomalyModel,
  trendModel,
  combinedAnalysis,
  // Export fallbacks for testing
  ewsModelFallback,
  anomalyModelFallback
};

/**
 * Mock ML Models - Temporary Placeholders
 * 
 * These will be replaced with actual .pkl models later
 * Format: backend/src/models/{modelName}.pkl
 */

/**
 * EWS Model - Early Warning Score
 * Input: { HR, SpO2, Temp, RR, Fall }
 * Output: "Normal" | "Warning" | "Critical"
 */
function ewsModel(vitals) {
  // Temporary logic for mock EWS
  const { HR, SpO2, Temp, RR, Fall } = vitals;

  // Simple thresholds for mock testing
  if (Fall === 1) return 'Critical'; // Fall detected = critical
  if (SpO2 < 90) return 'Critical'; // Low oxygen = critical
  if (HR < 40 || HR > 120) return 'Warning'; // Abnormal HR = warning
  if (Temp < 36 || Temp > 39) return 'Warning'; // Abnormal Temp = warning
  if (RR < 12 || RR > 25) return 'Warning'; // Abnormal RR = warning

  return 'Normal'; // All within normal ranges
}

/**
 * Anomaly Model - Anomaly Detection
 * Input: { HR, SpO2, Temp, RR, Fall }
 * Output: "Normal" | "Abnormal"
 */
function anomalyModel(vitals) {
  // Temporary logic for mock anomaly detection
  const { HR, SpO2, Temp, RR, Fall } = vitals;

  // Check for obvious anomalies
  if (Fall === 1) return 'Abnormal';
  if (SpO2 < 85) return 'Abnormal';
  if (HR < 35 || HR > 150) return 'Abnormal';
  if (Temp < 35 || Temp > 40) return 'Abnormal';
  if (RR < 10 || RR > 30) return 'Abnormal';

  return 'Normal';
}

/**
 * Trend Model - Trend Analysis
 * Checks if vitals are stable, declining, or improving
 * Input: { HR, SpO2, Temp, RR, Fall }, historicalData: [array]
 * Output: "Stable" | "Declining" | "Improving"
 */
function trendModel(vitals, historicalData = []) {
  // If we have less than 3 historical points, can't determine trend
  if (!historicalData || historicalData.length < 3) {
    return 'Stable';
  }

  // Mock trend logic: check if recent values show decline
  const recentData = historicalData.slice(-10); // Last 10 points
  
  if (recentData.length < 3) {
    return 'Stable';
  }

  // Simple trend detection: compare averages
  const firstHalf = recentData.slice(0, Math.floor(recentData.length / 2));
  const secondHalf = recentData.slice(Math.floor(recentData.length / 2));

  const avgHRFirst = firstHalf.reduce((sum, d) => sum + (d.HR || 0), 0) / firstHalf.length;
  const avgHRSecond = secondHalf.reduce((sum, d) => sum + (d.HR || 0), 0) / secondHalf.length;

  const avgSpO2First = firstHalf.reduce((sum, d) => sum + (d.SpO2 || 0), 0) / firstHalf.length;
  const avgSpO2Second = secondHalf.reduce((sum, d) => sum + (d.SpO2 || 0), 0) / secondHalf.length;

  const hrTrend = avgHRSecond - avgHRFirst; // Positive = increasing
  const spo2Trend = avgSpO2Second - avgSpO2First; // Positive = increasing

  // If SpO2 declining by 2+ or HR declining by 5+, it's declining
  if (spo2Trend < -2 || hrTrend < -5) {
    return 'Declining';
  }

  // If SpO2 improving by 2+ or HR improving by 5+, it's improving
  if (spo2Trend > 2 || hrTrend > 5) {
    return 'Improving';
  }

  return 'Stable';
}

/**
 * Combine all 3 models into a final decision
 * @param {object} vitals - Current vital readings
 * @param {array} historicalData - Array of past vital readings
 * @returns {object} Combined analysis result
 */
function combinedAnalysis(vitals, historicalData = []) {
  const ewsResult = ewsModel(vitals);
  const anomalyResult = anomalyModel(vitals);
  const trendResult = trendModel(vitals, historicalData);

  // Determine final status
  let finalStatus = 'Stable';
  if (ewsResult === 'Critical' || anomalyResult === 'Abnormal' || trendResult === 'Declining') {
    finalStatus = 'High Risk';
  } else if (ewsResult === 'Warning') {
    finalStatus = 'Monitor';
  }

  return {
    EWS: ewsResult,
    Anomaly: anomalyResult,
    Trend: trendResult,
    Final_Status: finalStatus
  };
}

module.exports = {
  ewsModel,
  anomalyModel,
  trendModel,
  combinedAnalysis
};

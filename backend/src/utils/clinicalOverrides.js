/**
 * Clinical Override Rules
 * 
 * These rules protect patient safety by applying medical logic BEFORE ML models.
 * Critical conditions should never rely on ML predictions - they require immediate action.
 * 
 * Priority: Clinical Safety > ML Predictions
 */

/**
 * Apply clinical override rules to vital signs
 * Returns override status if critical rules are met, otherwise null
 * 
 * @param {object} vitals - { HR, SpO2, Temp, RR, Fall }
 * @returns {string|null} - "Critical" | "Warning" | null (if no override needed)
 */
function applyClinicalOverrides(vitals) {
  const { HR, SpO2, Temp, RR, Fall } = vitals;

  // ==========================================
  // CRITICAL OVERRIDES - Immediate Patient Safety
  // These conditions ALWAYS return Critical, bypassing ML
  // ==========================================

  // Fall Detection - Always Critical
  if (Fall === 1) {
    console.log('🚨 [Clinical Override] CRITICAL: Fall detected');
    return 'Critical';
  }

  // Severe Hypoxemia - Life-threatening oxygen levels
  if (SpO2 < 92) {
    console.log(`🚨 [Clinical Override] CRITICAL: SpO2 = ${SpO2}% (< 92%)`);
    return 'Critical';
  }

  // Severe Respiratory Distress
  if (RR < 10 || RR > 24) {
    console.log(`🚨 [Clinical Override] CRITICAL: RR = ${RR} (< 10 or > 24)`);
    return 'Critical';
  }

  // ==========================================
  // WARNING OVERRIDES - Require Clinical Attention
  // These conditions return Warning before ML evaluation
  // ==========================================

  // Abnormal Heart Rate
  if (HR < 60 || HR > 100) {
    console.log(`⚠️ [Clinical Override] WARNING: HR = ${HR} (< 60 or > 100)`);
    return 'Warning';
  }

  // Fever Detection
  if (Temp >= 38.0) {
    console.log(`⚠️ [Clinical Override] WARNING: Temp = ${Temp}°C (>= 38.0°C)`);
    return 'Warning';
  }

  // No override needed - proceed to ML model
  return null;
}

/**
 * Get human-readable explanation for clinical override
 * @param {object} vitals - { HR, SpO2, Temp, RR, Fall }
 * @returns {string} - Explanation of which rule triggered
 */
function getClinicalOverrideReason(vitals) {
  const { HR, SpO2, Temp, RR, Fall } = vitals;

  // Check critical conditions
  if (Fall === 1) {
    return 'Fall detected - immediate intervention required';
  }
  if (SpO2 < 92) {
    return `Severe hypoxemia (SpO2: ${SpO2}%) - oxygen therapy needed`;
  }
  if (RR < 10) {
    return `Bradypnea (RR: ${RR}) - respiratory failure risk`;
  }
  if (RR > 24) {
    return `Tachypnea (RR: ${RR}) - respiratory distress`;
  }

  // Check warning conditions
  if (HR < 60) {
    return `Bradycardia (HR: ${HR}) - cardiac monitoring required`;
  }
  if (HR > 100) {
    return `Tachycardia (HR: ${HR}) - cardiac monitoring required`;
  }
  if (Temp >= 38.0) {
    return `Fever (Temp: ${Temp}°C) - infection or inflammation`;
  }

  return 'No clinical override applied';
}

module.exports = {
  applyClinicalOverrides,
  getClinicalOverrideReason
};

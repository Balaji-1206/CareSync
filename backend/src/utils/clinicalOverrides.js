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
  if (RR < 10 || RR > 25) {
    console.log(`🚨 [Clinical Override] CRITICAL: RR = ${RR} (< 10 or > 25)`);
    return 'Critical';
  }

  // Extreme Heart Rate - Critical cardiac conditions
  if (HR < 50 || HR > 130) {
    console.log(`🚨 [Clinical Override] CRITICAL: HR = ${HR} (< 50 or > 130)`);
    return 'Critical';
  }

  // High Fever - Severe infection/inflammation
  if (Temp >= 39.0) {
    console.log(`🚨 [Clinical Override] CRITICAL: Temp = ${Temp}°C (>= 39.0°C)`);
    return 'Critical';
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
  if (RR > 25) {
    return `Tachypnea (RR: ${RR}) - respiratory distress`;
  }
  if (HR < 50) {
    return `Severe bradycardia (HR: ${HR}) - cardiac emergency`;
  }
  if (HR > 130) {
    return `Severe tachycardia (HR: ${HR}) - cardiac emergency`;
  }
  if (Temp >= 39.0) {
    return `High fever (Temp: ${Temp}°C) - severe infection risk`;
  }

  return 'No clinical override applied';
}

module.exports = {
  applyClinicalOverrides,
  getClinicalOverrideReason
};

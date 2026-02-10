/**
 * In-Memory Cache Manager for Latest Vital Readings
 * Stores the most recent reading for each patient + each vital
 * 
 * Structure:
 * {
 *   patientId: {
 *     HR: { value: 82, time: "2025-12-31T10:00:02Z" },
 *     SpO2: { value: 96, time: "2025-12-31T10:00:02Z" },
 *     ...
 *   }
 * }
 */

class VitalCache {
  constructor() {
    this.cache = {}; // { patientId: { HR, SpO2, Temp, RR, Fall } }
    this.timestamps = {}; // { patientId: { HR, SpO2, Temp, RR, Fall } }
  }

  /**
   * Update cache with new vital reading
   * @param {string} patientId - Patient MongoDB ID
   * @param {object} vitals - { HR, SpO2, Temp, RR, Fall } each with { value, time }
   */
  updateCache(patientId, vitals) {
    if (!this.cache[patientId]) {
      this.cache[patientId] = {};
      this.timestamps[patientId] = {};
    }

    // Update each vital with its value and timestamp
    Object.keys(vitals).forEach(vitalKey => {
      this.cache[patientId][vitalKey] = vitals[vitalKey].value;
      this.timestamps[patientId][vitalKey] = new Date(vitals[vitalKey].time);
    });

    console.log(`[Cache] Updated patient ${patientId}:`, {
      HR: this.cache[patientId].HR,
      SpO2: this.cache[patientId].SpO2,
      Temp: this.cache[patientId].Temp,
      RR: this.cache[patientId].RR,
      ECG: this.cache[patientId].ECG
    });
  }

  /**
   * Get latest cache state for a patient
   * @param {string} patientId - Patient MongoDB ID
   * @returns {object} Complete vital readings with timestamps
   */
  getLatestState(patientId) {
    if (!this.cache[patientId]) {
      return null;
    }

    const state = {};
    Object.keys(this.cache[patientId]).forEach(vitalKey => {
      state[vitalKey] = {
        value: this.cache[patientId][vitalKey],
        time: this.timestamps[patientId][vitalKey].toISOString()
      };
    });

    return state;
  }

  /**
   * Check staleness of vitals based on max age rules
   * @param {string} patientId - Patient MongoDB ID
   * @returns {object} { isStale: boolean, staleVitals: [array], allValid: object }
   */
  checkStaleness(patientId) {
    const MAX_AGE = {
      HR: 5 * 1000, // 5 seconds
      SpO2: 5 * 1000,
      Temp: 10 * 1000,
      RR: 8 * 1000,
      Fall: 3 * 1000
    };

    if (!this.cache[patientId] || !this.timestamps[patientId]) {
      return {
        isStale: true,
        staleVitals: ['HR', 'SpO2', 'Temp', 'RR', 'Fall'],
        allValid: {}
      };
    }

    const now = Date.now();
    const staleVitals = [];
    const allValid = {};

    Object.keys(MAX_AGE).forEach(vitalKey => {
      const lastUpdateTime = this.timestamps[patientId][vitalKey];
      
      if (!lastUpdateTime) {
        staleVitals.push(vitalKey);
      } else {
        const age = now - lastUpdateTime.getTime();
        if (age > MAX_AGE[vitalKey]) {
          staleVitals.push(vitalKey);
        } else {
          allValid[vitalKey] = true;
        }
      }
    });

    console.log(`[Cache] Staleness check for ${patientId}:`, {
      staleVitals,
      validVitals: Object.keys(allValid)
    });

    return {
      isStale: staleVitals.length > 0,
      staleVitals,
      allValid
    };
  }

  /**
   * Get all vital values in format ready for model prediction
   * @param {string} patientId - Patient MongoDB ID
   * @returns {object} { HR, SpO2, Temp, RR, Fall } with numeric values
   */
  getVitalValuesForModel(patientId) {
    if (!this.cache[patientId]) {
      return null;
    }

    return {
      HR: this.cache[patientId].HR,
      SpO2: this.cache[patientId].SpO2,
      Temp: this.cache[patientId].Temp,
      RR: this.cache[patientId].RR,
      Fall: this.cache[patientId].Fall
    };
  }

  /**
   * Clear cache for a specific patient (optional)
   */
  clearPatient(patientId) {
    delete this.cache[patientId];
    delete this.timestamps[patientId];
    console.log(`[Cache] Cleared patient ${patientId}`);
  }

  /**
   * Get all patients in cache
   */
  getAllPatients() {
    return Object.keys(this.cache);
  }
}

module.exports = new VitalCache();

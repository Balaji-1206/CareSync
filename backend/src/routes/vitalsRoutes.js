const express = require('express');
const router = express.Router();
const {
  receiveVitalData,
  getLatestVitals,
  getEWSStatus,
  getVitalHistory
} = require('../controllers/vitalsController');

/**
 * POST /api/vitals/data
 * Receive vital data from sensors/simulation
 * 
 * Body: {
 *   patientId: "123",
 *   vitals: {
 *     HR: { value: 82, time: "2025-12-31T10:00:02Z" },
 *     SpO2: { value: 96, time: "2025-12-31T10:00:02Z" },
 *     Temp: { value: 37.1, time: "2025-12-31T10:00:01Z" },
 *     RR: { value: 18, time: "2025-12-31T10:00:01Z" },
 *     Fall: { value: 0, time: "2025-12-31T10:00:02Z" }
 *   }
 * }
 */
router.post('/data', receiveVitalData);

/**
 * GET /api/vitals/latest/:patientId
 * Get the latest cached vital readings
 */
router.get('/latest/:patientId', getLatestVitals);

/**
 * GET /api/vitals/ews-status/:patientId
 * Get the latest EWS calculation result
 */
router.get('/ews-status/:patientId', getEWSStatus);

/**
 * GET /api/vitals/history/:patientId?limit=50
 * Get historical vital readings
 */
router.get('/history/:patientId', getVitalHistory);

module.exports = router;

const mongoose = require('mongoose');

const vitalReadingSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient ID is required'],
    index: true
  },
  vitals: {
    HR: {
      value: { type: Number, required: true },
      time: { type: Date, required: true }
    },
    SpO2: {
      value: { type: Number, required: true },
      time: { type: Date, required: true }
    },
    Temp: {
      value: { type: Number, required: true },
      time: { type: Date, required: true }
    },
    RR: {
      value: { type: Number, required: true },
      time: { type: Date, required: true }
    },
    Fall: {
      value: { type: Number, required: true },
      time: { type: Date, required: true }
    }
  },
  calculation: {
    EWS: {
      result: { type: String, enum: ['Normal', 'Warning', 'Critical'], default: 'Normal' },
      timestamp: Date
    },
    Anomaly: {
      result: { type: String, enum: ['Normal', 'Abnormal'], default: 'Normal' },
      timestamp: Date
    },
    Trend: {
      result: { type: String, enum: ['Stable', 'Declining', 'Improving'], default: 'Stable' },
      timestamp: Date
    }
  },
  finalStatus: {
    type: String,
    enum: ['Stable', 'Monitor', 'High Risk'],
    default: 'Stable'
  },
  processingStatus: {
    type: String,
    enum: ['Pending', 'Processed', 'Stale', 'Incomplete'],
    default: 'Pending'
  },
  stalePitals: [String], // List of stale vitals (if any)
  recordedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for faster queries
vitalReadingSchema.index({ patientId: 1, recordedAt: -1 });

module.exports = mongoose.model('VitalReading', vitalReadingSchema);

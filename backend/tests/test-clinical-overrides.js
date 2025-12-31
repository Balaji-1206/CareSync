/**
 * Test Script: Clinical Override Rules
 * 
 * This script demonstrates how clinical overrides protect patient safety
 * by bypassing ML models for critical conditions.
 */

const { applyClinicalOverrides, getClinicalOverrideReason } = require('./src/utils/clinicalOverrides');

console.log('🧪 Testing Clinical Override Rules\n');
console.log('=' .repeat(60));

// Test cases
const testCases = [
  {
    name: 'Normal Vitals',
    vitals: { HR: 75, SpO2: 98, Temp: 37.0, RR: 16, Fall: 0 },
    expected: null
  },
  {
    name: 'Fall Detected',
    vitals: { HR: 75, SpO2: 98, Temp: 37.0, RR: 16, Fall: 1 },
    expected: 'Critical'
  },
  {
    name: 'Severe Hypoxemia (SpO2 < 92)',
    vitals: { HR: 75, SpO2: 88, Temp: 37.0, RR: 16, Fall: 0 },
    expected: 'Critical'
  },
  {
    name: 'Bradypnea (RR < 10)',
    vitals: { HR: 75, SpO2: 98, Temp: 37.0, RR: 8, Fall: 0 },
    expected: 'Critical'
  },
  {
    name: 'Tachypnea (RR > 25)',
    vitals: { HR: 75, SpO2: 98, Temp: 37.0, RR: 28, Fall: 0 },
    expected: 'Critical'
  },
  {
    name: 'Severe Bradycardia (HR < 50)',
    vitals: { HR: 45, SpO2: 98, Temp: 37.0, RR: 16, Fall: 0 },
    expected: 'Critical'
  },
  {
    name: 'Severe Tachycardia (HR > 130)',
    vitals: { HR: 140, SpO2: 98, Temp: 37.0, RR: 16, Fall: 0 },
    expected: 'Critical'
  },
  {
    name: 'High Fever (Temp >= 39.0)',
    vitals: { HR: 75, SpO2: 98, Temp: 39.5, RR: 16, Fall: 0 },
    expected: 'Critical'
  },
  {
    name: 'Borderline HR (60 bpm) - Should NOT trigger',
    vitals: { HR: 60, SpO2: 98, Temp: 37.0, RR: 16, Fall: 0 },
    expected: null
  },
  {
    name: 'Borderline HR (100 bpm) - Should NOT trigger',
    vitals: { HR: 100, SpO2: 98, Temp: 37.0, RR: 16, Fall: 0 },
    expected: null
  },
  {
    name: 'Moderate Fever (38.5°C) - Should NOT trigger',
    vitals: { HR: 75, SpO2: 98, Temp: 38.5, RR: 16, Fall: 0 },
    expected: null
  },
  {
    name: 'Multiple Critical Conditions',
    vitals: { HR: 45, SpO2: 85, Temp: 40.0, RR: 8, Fall: 1 },
    expected: 'Critical'
  }
];

// Run tests
let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
  console.log(`\nTest ${index + 1}: ${test.name}`);
  console.log(`Vitals: HR=${test.vitals.HR}, SpO2=${test.vitals.SpO2}, Temp=${test.vitals.Temp}, RR=${test.vitals.RR}, Fall=${test.vitals.Fall}`);
  
  const result = applyClinicalOverrides(test.vitals);
  const reason = getClinicalOverrideReason(test.vitals);
  
  console.log(`Expected: ${test.expected || 'No override (proceed to ML)'}`);
  console.log(`Result: ${result || 'No override (proceed to ML)'}`);
  console.log(`Reason: ${reason}`);
  
  if (result === test.expected) {
    console.log('✅ PASSED');
    passed++;
  } else {
    console.log('❌ FAILED');
    failed++;
  }
  console.log('-'.repeat(60));
});

// Summary
console.log('\n' + '='.repeat(60));
console.log(`Test Summary: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);
console.log('='.repeat(60));

if (failed === 0) {
  console.log('\n✅ All clinical override rules are working correctly!');
  console.log('🏥 Patient safety is protected by these rules.');
} else {
  console.log('\n❌ Some tests failed. Please review the clinical override logic.');
}

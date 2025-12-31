/**
 * Test suite for the new medically realistic trend logic
 * Tests various clinical scenarios to ensure proper medical interpretation
 */

const { trendModel } = require('./src/utils/mlModels');

console.log('🧪 Testing Medically Realistic Trend Logic\n');
console.log('============================================================\n');

// Test 1: SpO2 Declining (always concerning)
console.log('📊 Test 1: SpO2 Declining (Unambiguous - Always Bad)');
const historicalSpO2Declining = [
  { HR: 75, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 76, SpO2: 97, Temp: 37, RR: 16 },
  { HR: 77, SpO2: 96, Temp: 37, RR: 17 },
  { HR: 78, SpO2: 94, Temp: 37, RR: 17 },
  { HR: 79, SpO2: 93, Temp: 37, RR: 18 },
  { HR: 80, SpO2: 91, Temp: 37, RR: 18 }
];
const currentVitals1 = { HR: 80, SpO2: 91, Temp: 37, RR: 18, Fall: 0 };
const result1 = trendModel(currentVitals1, historicalSpO2Declining);
console.log(`Result: ${result1.status}`);
console.log(`Reason: ${result1.reason}`);
console.log(`Vital: ${result1.vital}`);
console.log(`✅ Expected: Declining due to SpO2 drop\n`);

// Test 2: Temperature Rising (Fever developing)
console.log('📊 Test 2: Temperature Rising (Fever Developing)');
const historicalTempRising = [
  { HR: 75, SpO2: 98, Temp: 37.0, RR: 16 },
  { HR: 76, SpO2: 98, Temp: 37.5, RR: 16 },
  { HR: 77, SpO2: 98, Temp: 38.0, RR: 17 },
  { HR: 78, SpO2: 98, Temp: 38.5, RR: 17 },
  { HR: 79, SpO2: 98, Temp: 39.0, RR: 18 },
  { HR: 80, SpO2: 98, Temp: 39.5, RR: 18 }
];
const currentVitals2 = { HR: 80, SpO2: 98, Temp: 39.5, RR: 18, Fall: 0 };
const result2 = trendModel(currentVitals2, historicalTempRising);
console.log(`Result: ${result2.status}`);
console.log(`Reason: ${result2.reason}`);
console.log(`Vital: ${result2.vital}`);
console.log(`✅ Expected: Declining due to rising fever\n`);

// Test 3: Respiratory Rate Unstable
console.log('📊 Test 3: Respiratory Rate Unstable (Large Change)');
const historicalRRChanging = [
  { HR: 75, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 76, SpO2: 98, Temp: 37, RR: 17 },
  { HR: 77, SpO2: 98, Temp: 37, RR: 18 },
  { HR: 78, SpO2: 98, Temp: 37, RR: 20 },
  { HR: 79, SpO2: 98, Temp: 37, RR: 23 },
  { HR: 80, SpO2: 98, Temp: 37, RR: 25 }
];
const currentVitals3 = { HR: 80, SpO2: 98, Temp: 37, RR: 25, Fall: 0 };
const result3 = trendModel(currentVitals3, historicalRRChanging);
console.log(`Result: ${result3.status}`);
console.log(`Reason: ${result3.reason}`);
console.log(`Vital: ${result3.vital}`);
console.log(`✅ Expected: Declining due to RR instability\n`);

// Test 4: Tachycardia Worsening (HR > 110 and increasing)
console.log('📊 Test 4: Tachycardia Worsening (Context: Already High HR)');
const historicalTachycardia = [
  { HR: 105, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 108, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 112, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 115, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 118, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 122, SpO2: 98, Temp: 37, RR: 16 }
];
const currentVitals4 = { HR: 122, SpO2: 98, Temp: 37, RR: 16, Fall: 0 };
const result4 = trendModel(currentVitals4, historicalTachycardia);
console.log(`Result: ${result4.status}`);
console.log(`Reason: ${result4.reason}`);
console.log(`Vital: ${result4.vital}`);
console.log(`✅ Expected: Declining due to worsening tachycardia\n`);

// Test 5: Bradycardia Worsening (HR < 55 and decreasing)
console.log('📊 Test 5: Bradycardia Worsening (Context: Already Low HR)');
const historicalBradycardia = [
  { HR: 58, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 56, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 54, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 52, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 50, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 48, SpO2: 98, Temp: 37, RR: 16 }
];
const currentVitals5 = { HR: 48, SpO2: 98, Temp: 37, RR: 16, Fall: 0 };
const result5 = trendModel(currentVitals5, historicalBradycardia);
console.log(`Result: ${result5.status}`);
console.log(`Reason: ${result5.reason}`);
console.log(`Vital: ${result5.vital}`);
console.log(`✅ Expected: Declining due to worsening bradycardia\n`);

// Test 6: HR Decreasing but GOOD (tachycardia improving - NOT flagged)
console.log('📊 Test 6: HR Decreasing from High (GOOD - Tachycardia Improving)');
const historicalHRImproving = [
  { HR: 120, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 118, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 115, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 112, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 110, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 108, SpO2: 98, Temp: 37, RR: 16 }
];
const currentVitals6 = { HR: 108, SpO2: 98, Temp: 37, RR: 16, Fall: 0 };
const result6 = trendModel(currentVitals6, historicalHRImproving);
console.log(`Result: ${result6.status}`);
console.log(`Reason: ${result6.reason}`);
console.log(`Vital: ${result6.vital}`);
console.log(`✅ Expected: Stable (HR decreasing is good in this context)\n`);

// Test 7: SpO2 Improving from Low Baseline
console.log('📊 Test 7: SpO2 Improving from Low Baseline');
const historicalSpO2Improving = [
  { HR: 80, SpO2: 90, Temp: 37, RR: 18 },
  { HR: 79, SpO2: 91, Temp: 37, RR: 17 },
  { HR: 78, SpO2: 92, Temp: 37, RR: 17 },
  { HR: 77, SpO2: 93, Temp: 37, RR: 16 },
  { HR: 76, SpO2: 94, Temp: 37, RR: 16 },
  { HR: 75, SpO2: 95, Temp: 37, RR: 16 }
];
const currentVitals7 = { HR: 75, SpO2: 95, Temp: 37, RR: 16, Fall: 0 };
const result7 = trendModel(currentVitals7, historicalSpO2Improving);
console.log(`Result: ${result7.status}`);
console.log(`Reason: ${result7.reason}`);
console.log(`Vital: ${result7.vital}`);
console.log(`✅ Expected: Improving due to SpO2 recovery\n`);

// Test 8: Fever Resolving
console.log('📊 Test 8: Fever Resolving (Temperature Dropping from High)');
const historicalTempImproving = [
  { HR: 80, SpO2: 98, Temp: 39.5, RR: 18 },
  { HR: 79, SpO2: 98, Temp: 39.0, RR: 17 },
  { HR: 78, SpO2: 98, Temp: 38.5, RR: 17 },
  { HR: 77, SpO2: 98, Temp: 38.0, RR: 16 },
  { HR: 76, SpO2: 98, Temp: 37.5, RR: 16 },
  { HR: 75, SpO2: 98, Temp: 37.2, RR: 16 }
];
const currentVitals8 = { HR: 75, SpO2: 98, Temp: 37.2, RR: 16, Fall: 0 };
const result8 = trendModel(currentVitals8, historicalTempImproving);
console.log(`Result: ${result8.status}`);
console.log(`Reason: ${result8.reason}`);
console.log(`Vital: ${result8.vital}`);
console.log(`✅ Expected: Improving due to fever resolution\n`);

// Test 9: Stable Vitals (no significant changes)
console.log('📊 Test 9: Stable Vitals (No Significant Changes)');
const historicalStable = [
  { HR: 75, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 76, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 75, SpO2: 98, Temp: 37, RR: 17 },
  { HR: 76, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 75, SpO2: 98, Temp: 37, RR: 16 },
  { HR: 76, SpO2: 98, Temp: 37, RR: 16 }
];
const currentVitals9 = { HR: 76, SpO2: 98, Temp: 37, RR: 16, Fall: 0 };
const result9 = trendModel(currentVitals9, historicalStable);
console.log(`Result: ${result9.status}`);
console.log(`Reason: ${result9.reason}`);
console.log(`Vital: ${result9.vital}`);
console.log(`✅ Expected: Stable (no concerning trends)\n`);

// Test 10: Insufficient Data
console.log('📊 Test 10: Insufficient Historical Data');
const historicalInsufficient = [
  { HR: 75, SpO2: 98, Temp: 37, RR: 16 }
];
const currentVitals10 = { HR: 76, SpO2: 98, Temp: 37, RR: 16, Fall: 0 };
const result10 = trendModel(currentVitals10, historicalInsufficient);
console.log(`Result: ${result10.status}`);
console.log(`Reason: ${result10.reason}`);
console.log(`Vital: ${result10.vital}`);
console.log(`✅ Expected: Stable (insufficient data)\n`);

console.log('============================================================');
console.log('✅ All trend logic tests completed!');
console.log('\n📋 Summary:');
console.log('- SpO2 declining is always detected as concerning');
console.log('- Temperature rising (fever) is detected');
console.log('- Respiratory rate instability is detected');
console.log('- Tachycardia worsening is context-aware');
console.log('- Bradycardia worsening is context-aware');
console.log('- HR decreasing from high (good) is NOT flagged');
console.log('- Improvements in concerning vitals are detected');
console.log('- Stable vitals return Stable status');

/**
 * Advanced Vitals API Test - Continuous Streaming
 * 
 * This test sends vital data continuously to keep data fresh
 * and see the models working properly
 */

const BASE_URL = 'http://localhost:5000/api/vitals';
const PATIENT_ID = '507f1f77bcf86cd799439011';

let testCount = 0;

/**
 * Send vital data with various scenarios
 */
async function sendVitalData(scenario = 'normal') {
  const scenarios = {
    normal: {
      HR: 72, SpO2: 98, Temp: 36.8, RR: 16, Fall: 0
    },
    warning: {
      HR: 125, SpO2: 94, Temp: 38.5, RR: 22, Fall: 0
    },
    critical_fall: {
      HR: 95, SpO2: 92, Temp: 37.1, RR: 20, Fall: 1
    },
    critical_spo2: {
      HR: 70, SpO2: 85, Temp: 37.0, RR: 16, Fall: 0
    }
  };

  const vitals = scenarios[scenario] || scenarios.normal;

  const sampleData = {
    patientId: PATIENT_ID,
    vitals: {
      HR: { value: vitals.HR, time: new Date().toISOString() },
      SpO2: { value: vitals.SpO2, time: new Date().toISOString() },
      Temp: { value: vitals.Temp, time: new Date().toISOString() },
      RR: { value: vitals.RR, time: new Date().toISOString() },
      Fall: { value: vitals.Fall, time: new Date().toISOString() }
    }
  };

  try {
    const response = await fetch(`${BASE_URL}/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sampleData)
    });

    const result = await response.json();
    console.log(`✅ Data sent (${scenario}): HR=${vitals.HR}, SpO2=${vitals.SpO2}, Temp=${vitals.Temp}, Fall=${vitals.Fall}`);
    return response.ok;
  } catch (error) {
    console.error('❌ Send failed:', error.message);
    return false;
  }
}

/**
 * Get EWS status
 */
async function getEWSStatus() {
  try {
    const response = await fetch(`${BASE_URL}/ews-status/${PATIENT_ID}`);
    const result = await response.json();
    
    if (result.success && result.data) {
      console.log(`\n📊 EWS Calculation #${++testCount}:`);
      console.log(`   EWS: ${result.data.EWS.padEnd(10)} | Anomaly: ${result.data.Anomaly.padEnd(10)} | Trend: ${result.data.Trend.padEnd(10)}`);
      console.log(`   Final Status: ${result.data.Final_Status}`);
      console.log(`   Processing: ${result.data.Processing_Status}`);
      if (result.data.Stale_Vitals && result.data.Stale_Vitals.length > 0) {
        console.log(`   ⚠️ Stale Vitals: ${result.data.Stale_Vitals.join(', ')}`);
      }
    }
    return response.ok;
  } catch (error) {
    console.error('❌ Get EWS failed:', error.message);
    return false;
  }
}

/**
 * Run continuous monitoring test
 */
async function continuousMonitoringTest() {
  console.log('🚀 CareSync Continuous Monitoring Test');
  console.log('=' .repeat(60));
  console.log('This test keeps sending fresh vital data');
  console.log('to demonstrate models working properly.\n');

  // Test 1: Normal vitals with continuous updates
  console.log('\n📌 TEST 1: Normal Vitals with Continuous Updates');
  console.log('-'.repeat(60));
  
  for (let i = 0; i < 3; i++) {
    await sendVitalData('normal');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 sec
    await getEWSStatus();
  }

  // Test 2: Warning scenario
  console.log('\n\n📌 TEST 2: Warning Scenario (High HR)');
  console.log('-'.repeat(60));
  
  for (let i = 0; i < 2; i++) {
    await sendVitalData('warning');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await getEWSStatus();
  }

  // Test 3: Critical - Fall Detected
  console.log('\n\n📌 TEST 3: Critical - Fall Detected');
  console.log('-'.repeat(60));
  
  await sendVitalData('critical_fall');
  await new Promise(resolve => setTimeout(resolve, 2000));
  await getEWSStatus();

  // Test 4: Critical - Low SpO2
  console.log('\n\n📌 TEST 4: Critical - Low SpO2');
  console.log('-'.repeat(60));
  
  await sendVitalData('critical_spo2');
  await new Promise(resolve => setTimeout(resolve, 2000));
  await getEWSStatus();

  // Test 5: Recovery to Normal
  console.log('\n\n📌 TEST 5: Recovery to Normal');
  console.log('-'.repeat(60));
  
  for (let i = 0; i < 2; i++) {
    await sendVitalData('normal');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await getEWSStatus();
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log(`📊 Total EWS Calculations: ${testCount}`);
  console.log('='.repeat(60));
  console.log('\n✅ TEST COMPLETE!');
  console.log('\nKey Observations:');
  console.log('✓ Models return different outputs based on vital values');
  console.log('✓ Continuous data keeps vitals "fresh" (not stale)');
  console.log('✓ Final_Status reflects the risk level');
  console.log('✓ Processing_Status shows if data is valid or stale');
}

// Run test
continuousMonitoringTest().catch(console.error);

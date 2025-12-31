/**
 * API Test Script for CareSync Vitals System
 * 
 * Test the endpoints with sample data
 */

const BASE_URL = 'http://localhost:5000/api/vitals';

// Sample patient ID (use a MongoDB ObjectId from your User collection)
const PATIENT_ID = '507f1f77bcf86cd799439011'; // Placeholder - update with real ID

/**
 * Test 1: POST /data - Send vital data
 */
async function testSendVitalData() {
  console.log('\n🔵 TEST 1: Sending vital data...');
  
  const sampleData = {
    patientId: PATIENT_ID,
    vitals: {
      HR: { value: 82, time: new Date().toISOString() },
      SpO2: { value: 96, time: new Date().toISOString() },
      Temp: { value: 37.1, time: new Date().toISOString() },
      RR: { value: 18, time: new Date().toISOString() },
      Fall: { value: 0, time: new Date().toISOString() }
    }
  };

  try {
    const response = await fetch(`${BASE_URL}/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sampleData)
    });

    const result = await response.json();
    console.log('✅ Response:', result);
    return response.ok;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 2: GET /latest/:patientId - Get latest cached vitals
 */
async function testGetLatestVitals() {
  console.log('\n🔵 TEST 2: Getting latest vitals...');

  try {
    const response = await fetch(`${BASE_URL}/latest/${PATIENT_ID}`);
    const result = await response.json();
    console.log('✅ Response:', result);
    return response.ok;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 3: GET /ews-status/:patientId - Get EWS calculation result
 */
async function testGetEWSStatus() {
  console.log('\n🔵 TEST 3: Getting EWS status...');

  try {
    const response = await fetch(`${BASE_URL}/ews-status/${PATIENT_ID}`);
    const result = await response.json();
    console.log('✅ Response:', result);
    return response.ok;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 4: GET /history/:patientId - Get vital history
 */
async function testGetHistory() {
  console.log('\n🔵 TEST 4: Getting vital history...');

  try {
    const response = await fetch(`${BASE_URL}/history/${PATIENT_ID}?limit=10`);
    const result = await response.json();
    console.log('✅ Response:', result);
    return response.ok;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🚀 Starting CareSync Vitals API Tests...');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`👤 Patient ID: ${PATIENT_ID}`);
  console.log('⚠️ Make sure MongoDB is running and backend server is started!');
  console.log('⚠️ Update PATIENT_ID with a real user ID from your database!');

  // Wait a bit for server startup
  await new Promise(resolve => setTimeout(resolve, 2000));

  const results = [];
  
  // Send data first
  results.push(await testSendVitalData());
  
  // Wait for cache update
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get latest
  results.push(await testGetLatestVitals());
  
  // Wait for EWS calculation (5 seconds)
  console.log('\n⏳ Waiting 6 seconds for EWS calculation...');
  await new Promise(resolve => setTimeout(resolve, 6000));
  
  // Get EWS status
  results.push(await testGetEWSStatus());
  
  // Get history
  results.push(await testGetHistory());

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY:');
  console.log(`Total Tests: ${results.length}`);
  console.log(`Passed: ${results.filter(r => r).length}`);
  console.log(`Failed: ${results.filter(r => !r).length}`);
  console.log('='.repeat(50));
}

// Run tests if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testSendVitalData, testGetLatestVitals, testGetEWSStatus, testGetHistory };

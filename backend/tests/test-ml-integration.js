/**
 * Test ML Model Integration
 * 
 * Tests the full stack: Node.js → Python → ML Models → Results
 */

const { ewsModel, anomalyModel, combinedAnalysis } = require('./src/utils/mlModels');

async function testMLModels() {
  console.log('🧪 Testing ML Model Integration (Node.js → Python)\n');
  console.log('='.repeat(60));

  // Test Case 1: Normal Vitals
  console.log('\n📊 Test 1: Normal Vitals');
  const normalVitals = { HR: 75, SpO2: 98, Temp: 37.0, RR: 16, Fall: 0 };
  console.log('Input:', normalVitals);
  
  try {
    const ewsResult = await ewsModel(normalVitals);
    console.log('✅ EWS Result:', ewsResult);
    
    const anomalyResult = await anomalyModel(normalVitals);
    console.log('✅ Anomaly Result:', anomalyResult);
    
    const combined = await combinedAnalysis(normalVitals, []);
    console.log('✅ Combined Analysis:', combined);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Test Case 2: Critical Vitals
  console.log('\n🚨 Test 2: Critical Vitals');
  const criticalVitals = { HR: 45, SpO2: 88, Temp: 40.0, RR: 8, Fall: 1 };
  console.log('Input:', criticalVitals);
  
  try {
    const ewsResult = await ewsModel(criticalVitals);
    console.log('✅ EWS Result:', ewsResult);
    
    const anomalyResult = await anomalyModel(criticalVitals);
    console.log('✅ Anomaly Result:', anomalyResult);
    
    const combined = await combinedAnalysis(criticalVitals, []);
    console.log('✅ Combined Analysis:', combined);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Test Case 3: Warning Vitals
  console.log('\n⚠️  Test 3: Warning Vitals');
  const warningVitals = { HR: 110, SpO2: 93, Temp: 38.5, RR: 22, Fall: 0 };
  console.log('Input:', warningVitals);
  
  try {
    const ewsResult = await ewsModel(warningVitals);
    console.log('✅ EWS Result:', ewsResult);
    
    const anomalyResult = await anomalyModel(warningVitals);
    console.log('✅ Anomaly Result:', anomalyResult);
    
    const combined = await combinedAnalysis(warningVitals, []);
    console.log('✅ Combined Analysis:', combined);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Test Case 4: Anomalous Pattern
  console.log('\n🔍 Test 4: Anomalous Pattern');
  const anomalousVitals = { HR: 180, SpO2: 70, Temp: 41.0, RR: 35, Fall: 0 };
  console.log('Input:', anomalousVitals);
  
  try {
    const ewsResult = await ewsModel(anomalousVitals);
    console.log('✅ EWS Result:', ewsResult);
    
    const anomalyResult = await anomalyModel(anomalousVitals);
    console.log('✅ Anomaly Result:', anomalyResult);
    
    const combined = await combinedAnalysis(anomalousVitals, []);
    console.log('✅ Combined Analysis:', combined);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ All ML model tests completed!\n');
}

// Run tests
testMLModels().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

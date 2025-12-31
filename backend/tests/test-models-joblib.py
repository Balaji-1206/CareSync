"""
Alternative Model Loader using joblib
joblib is often more robust for sklearn models than pickle
"""

import sys
import joblib
import numpy as np
from pathlib import Path

def test_with_joblib():
    """Test loading models with joblib instead of pickle"""
    models_dir = Path(__file__).parent / 'src' / 'models'
    
    print("🧪 Testing ML Model Loading with joblib\n")
    print("=" * 60)
    
    # Test EWS Model
    print("\n📊 Testing EWS Model...")
    ews_path = models_dir / 'EWS_model.pkl'
    
    if not ews_path.exists():
        print(f"❌ EWS model not found: {ews_path}")
    else:
        try:
            ews_model = joblib.load(ews_path)
            print(f"✅ EWS model loaded successfully with joblib")
            print(f"   Type: {type(ews_model)}")
            print(f"   Has predict method: {hasattr(ews_model, 'predict')}")
            
            # Try a test prediction
            test_input = np.array([[75, 98, 37.0, 16, 0]])  # Normal vitals
            try:
                prediction = ews_model.predict(test_input)
                print(f"   ✅ Test prediction: {prediction}")
                print(f"   Prediction type: {type(prediction[0])}")
                
                # Test with critical vitals
                critical_input = np.array([[45, 88, 40.0, 8, 1]])
                critical_pred = ews_model.predict(critical_input)
                print(f"   ✅ Critical test: {critical_pred}")
            except Exception as e:
                print(f"   ⚠️ Test prediction failed: {e}")
                
        except Exception as e:
            print(f"❌ Failed to load EWS model with joblib: {e}")
    
    # Test Anomaly Model
    print("\n🔍 Testing Anomaly Model...")
    anomaly_path = models_dir / 'Anomaly_model.pkl'
    
    if not anomaly_path.exists():
        print(f"❌ Anomaly model not found: {anomaly_path}")
    else:
        try:
            anomaly_model = joblib.load(anomaly_path)
            print(f"✅ Anomaly model loaded successfully with joblib")
            print(f"   Type: {type(anomaly_model)}")
            print(f"   Has predict method: {hasattr(anomaly_model, 'predict')}")
            
            # Try a test prediction
            test_input = np.array([[75, 98, 37.0, 16, 0]])  # Normal vitals
            try:
                prediction = anomaly_model.predict(test_input)
                print(f"   ✅ Test prediction: {prediction}")
                print(f"   Prediction type: {type(prediction[0])}")
                
                # Test with anomalous vitals
                anomaly_input = np.array([[180, 70, 41.0, 35, 1]])
                anomaly_pred = anomaly_model.predict(anomaly_input)
                print(f"   ✅ Anomaly test: {anomaly_pred}")
            except Exception as e:
                print(f"   ⚠️ Test prediction failed: {e}")
                
        except Exception as e:
            print(f"❌ Failed to load Anomaly model with joblib: {e}")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    test_with_joblib()

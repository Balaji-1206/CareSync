"""
ML Model Predictor Service

This script loads the trained .pkl models and makes predictions.
Called by Node.js backend via child_process.

Usage:
    python predict.py <model_name> <HR> <SpO2> <Temp> <RR> <Fall>

Models:
    - ews: Early Warning Score classifier
    - anomaly: Anomaly detection model
"""

import sys
import joblib  # Changed from pickle to joblib
import json
import numpy as np
from pathlib import Path

def load_model(model_name):
    """Load a .pkl model from src/models directory using joblib"""
    model_path = Path(__file__).parent / 'src' / 'models' / f'{model_name}_model.pkl'
    
    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found: {model_path}")
    
    # Use joblib instead of pickle for better sklearn compatibility
    model = joblib.load(model_path)
    
    return model

def predict_ews(vitals):
    """
    Predict Early Warning Score using RandomForestClassifier
    Returns: "Normal", "Warning", or "Critical"
    """
    try:
        model = load_model('EWS')
        
        # Prepare input: [HR, SpO2, Temp, RR, Fall]
        X = np.array([[
            vitals['HR'],
            vitals['SpO2'],
            vitals['Temp'],
            vitals['RR'],
            vitals['Fall']
        ]])
        
        # Get prediction - model already returns string labels
        prediction = model.predict(X)[0]
        
        # Model outputs: "Normal", "Warning", or "Critical"
        return str(prediction)
            
    except Exception as e:
        # Fallback to rule-based logic if model fails
        print(f"EWS Model Error: {e}", file=sys.stderr)
        return fallback_ews(vitals)

def predict_anomaly(vitals):
    """
    Predict Anomaly Detection using IsolationForest
    Returns: "Normal" or "Abnormal"
    """
    try:
        model = load_model('Anomaly')
        
        # Prepare input: [HR, SpO2, Temp, RR, Fall]
        X = np.array([[
            vitals['HR'],
            vitals['SpO2'],
            vitals['Temp'],
            vitals['RR'],
            vitals['Fall']
        ]])
        
        # Get prediction
        # IsolationForest returns: -1 = anomaly (outlier), 1 = normal (inlier)
        prediction = model.predict(X)[0]
        
        return 'Abnormal' if prediction == -1 else 'Normal'
            
    except Exception as e:
        # Fallback to rule-based logic if model fails
        print(f"Anomaly Model Error: {e}", file=sys.stderr)
        return fallback_anomaly(vitals)

def fallback_ews(vitals):
    """Fallback rule-based EWS when model is unavailable"""
    HR, SpO2, Temp, RR, Fall = vitals['HR'], vitals['SpO2'], vitals['Temp'], vitals['RR'], vitals['Fall']
    
    if Fall == 1 or SpO2 < 90:
        return 'Critical'
    if HR < 40 or HR > 120 or Temp < 36 or Temp > 39 or RR < 12 or RR > 25:
        return 'Warning'
    return 'Normal'

def fallback_anomaly(vitals):
    """Fallback rule-based anomaly detection when model is unavailable"""
    HR, SpO2, Temp, RR, Fall = vitals['HR'], vitals['SpO2'], vitals['Temp'], vitals['RR'], vitals['Fall']
    
    if Fall == 1 or SpO2 < 85 or HR < 35 or HR > 150 or Temp < 35 or Temp > 40 or RR < 10 or RR > 30:
        return 'Abnormal'
    return 'Normal'

def main():
    if len(sys.argv) != 7:
        print(json.dumps({
            "error": "Invalid arguments",
            "usage": "python predict.py <model_name> <HR> <SpO2> <Temp> <RR> <Fall>"
        }))
        sys.exit(1)
    
    try:
        model_name = sys.argv[1]
        vitals = {
            'HR': float(sys.argv[2]),
            'SpO2': float(sys.argv[3]),
            'Temp': float(sys.argv[4]),
            'RR': float(sys.argv[5]),
            'Fall': int(sys.argv[6])
        }
        
        if model_name == 'ews':
            result = predict_ews(vitals)
        elif model_name == 'anomaly':
            result = predict_anomaly(vitals)
        else:
            raise ValueError(f"Unknown model: {model_name}")
        
        # Output as JSON
        print(json.dumps({
            "success": True,
            "model": model_name,
            "prediction": result,
            "vitals": vitals
        }))
        
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()

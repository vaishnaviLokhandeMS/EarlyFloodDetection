import os
import joblib
import numpy as np
import pandas as pd

# Load preprocessing objects and model
MODEL_DIR = os.path.join(os.path.dirname(__file__), "../ml_model")
scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))
label_encoder = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))
model = joblib.load(os.path.join(MODEL_DIR, "flood_model.pkl"))

def predict_flood(data):
    """
    Predict flood risk based on input features.
    """
    # Convert input data into a DataFrame
    df = pd.DataFrame([data], columns=[
        "Station_Names", "Year", "Month", "Max_Temp", "Min_Temp", "Rainfall",
        "Relative_Humidity", "Wind_Speed", "Cloud_Coverage", "Bright_Sunshine",
        "Station_Number", "X_COR", "Y_COR", "LATITUDE", "LONGITUDE", "ALT", "Period"
    ])

    # Encode categorical variable
    df["Station_Names"] = label_encoder.transform(df["Station_Names"])

    # Scale numerical values
    df_scaled = scaler.transform(df)

    # Make prediction
    prediction = model.predict(df_scaled)
    probability = model.predict_proba(df_scaled)[:, 1]  # Probability of flood

    return int(prediction[0]), round(float(probability[0]), 4)

if __name__ == "__main__":
    # Example input: Change values as needed for testing
    sample_data = ["Barisal", 2025, 7, 34.5, 26.5, 400, 85, 1.5, 4.5, 6.5, 41950, 536809.8, 510151.9, 22.7, 90.36, 4, 2025.07]
    
    # Predict flood risk
    result, probability = predict_flood(sample_data)
    print(f"🌊 Flood Prediction: {'Yes' if result == 1 else 'No'} (Risk: {probability * 100:.2f}%)")

import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder

def preprocess_data(csv_path):
    # Load dataset
    df = pd.read_csv(csv_path)

    # Drop unnecessary columns
    if 'Sl' in df.columns:
        df.drop(columns=['Sl'], inplace=True)

    # Encode categorical variables (e.g., Station_Names)
    label_encoder = LabelEncoder()
    df['Station_Names'] = label_encoder.fit_transform(df['Station_Names'])

    # Split features and target variable
    X = df.drop(columns=['Flood?'])
    y = df['Flood?']

    # Normalize numeric features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Ensure the directory exists before saving models
    MODEL_DIR = os.path.join(os.path.dirname(__file__), "../ml_model")
    os.makedirs(MODEL_DIR, exist_ok=True)

    # Save preprocessing objects
    joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler.pkl"))
    joblib.dump(label_encoder, os.path.join(MODEL_DIR, "label_encoder.pkl"))

    return train_test_split(X_scaled, y, test_size=0.2, random_state=42)

if __name__ == "__main__":
    # Use absolute path for dataset
    DATA_PATH = r"H:\WaterHigh\KrishnaRIver\FloodWarning\pre-flood-detection\backend\data\flood_data.csv"
    
    # Process data
    X_train, X_test, y_train, y_test = preprocess_data(DATA_PATH)
    print("✅ Data Preprocessing Completed!")

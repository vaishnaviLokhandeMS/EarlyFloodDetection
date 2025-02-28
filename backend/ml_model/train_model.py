import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from preprocess import preprocess_data

# Load preprocessed data
DATA_PATH = r"H:\WaterHigh\KrishnaRIver\FloodWarning\pre-flood-detection\backend\data\flood_data.csv"
X_train, X_test, y_train, y_test = preprocess_data(DATA_PATH)

# Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"✅ Model Training Completed! Accuracy: {accuracy:.4f}")

# Ensure the directory exists before saving the model
MODEL_DIR = os.path.join(os.path.dirname(__file__), "../ml_model")
os.makedirs(MODEL_DIR, exist_ok=True)

# Save the trained model
joblib.dump(model, os.path.join(MODEL_DIR, "flood_model.pkl"))

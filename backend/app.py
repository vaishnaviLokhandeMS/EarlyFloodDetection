from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load trained model and preprocessing tools
model = joblib.load("ml_model/flood_model.pkl")
scaler = joblib.load("ml_model/scaler.pkl")
label_encoder = joblib.load("ml_model/label_encoder.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json["features"]
        data = np.array(data).reshape(1, -1)
        data_scaled = scaler.transform(data)
        prediction = model.predict(data_scaled)
        return jsonify({"prediction": int(prediction[0])})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True, port=5000)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ml_model.predict import predict_flood
import pandas as pd

# Initialize FastAPI app
app = FastAPI()

# Enable CORS to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load flood dataset
df = pd.read_csv("data/flood_data.csv")

# Define input schema
class FloodInput(BaseModel):
    Station_Names: str
    Year: int
    Month: int
    Max_Temp: float
    Min_Temp: float
    Rainfall: float
    Relative_Humidity: int
    Wind_Speed: float
    Cloud_Coverage: float
    Bright_Sunshine: float
    Station_Number: int
    X_COR: float
    Y_COR: float
    LATITUDE: float
    LONGITUDE: float
    ALT: int
    Period: float

@app.post("/predict")
async def predict_flood_risk(data: FloodInput):
    """
    API endpoint to predict flood risk.
    """
    try:
        # Convert input to expected format
        input_data = [
            data.Station_Names, data.Year, data.Month, data.Max_Temp, data.Min_Temp,
            data.Rainfall, data.Relative_Humidity, data.Wind_Speed, data.Cloud_Coverage,
            data.Bright_Sunshine, data.Station_Number, data.X_COR, data.Y_COR,
            data.LATITUDE, data.LONGITUDE, data.ALT, data.Period
        ]

        # Get flood prediction
        result, probability = predict_flood(input_data)

        return {
            "flood_prediction": "Yes" if result == 1 else "No",
            "risk_percentage": round(probability * 100, 2)  # Properly formatted
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/stations")
async def get_station_data():
    """
    API endpoint to fetch flood-related data for charts.
    """
    try:
        # Use correct column names based on your dataset
        station_rainfall = df.groupby("Station_Names")["Rainfall"].sum().reset_index()
        station_floods = df.groupby("Station_Names")["Flood?"].sum().reset_index()
        monthly_rainfall = df.groupby("Month")["Rainfall"].mean().reset_index()
        flood_correlation = df.groupby("Rainfall")["Flood?"].mean().reset_index()

        response_data = {
            "stations": station_rainfall.to_dict(orient="records"),
            "floods": station_floods.to_dict(orient="records"),
            "monthly_rainfall": monthly_rainfall.to_dict(orient="records"),
            "rainfall_flood_correlation": flood_correlation.to_dict(orient="records"),
        }
        return response_data
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

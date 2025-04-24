from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ml_model.predict import predict_flood
import pandas as pd
from twilio.rest import Client
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from email.message import EmailMessage
import bcrypt
import smtplib
import os

# Load environment variables (like MongoDB URI)
load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)
db = client["flood_alert_system"]
users_collection = db["users"]

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load flood dataset
df = pd.read_csv("data/flood_data.csv")

# ======================= MODELS =======================

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

class AlertRequest(BaseModel):
    message: str

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    contact_number: str
    profession: str

class LoginRequest(BaseModel):
    email: str
    password: str

# ======================= WHATSAPP ALERT =======================

TWILIO_ACCOUNT_SID = 'ACef2e76361c794fb29705a634f814b41b'
TWILIO_AUTH_TOKEN = '2ab95028f5d547f161f217ec0a0f20d0'
TWILIO_WHATSAPP_NUMBER = '+13465478463'
PERSONAL_WHATSAPP_NUMBER = '+917841856258'

@app.post("/trigger-alert")
async def trigger_alert(data: AlertRequest):
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    try:
        message = client.messages.create(
            body=data.message,
            from_=TWILIO_WHATSAPP_NUMBER,
            to=PERSONAL_WHATSAPP_NUMBER
        )
        return {"status": "success", "message": "WhatsApp message sent successfully!"}
    except Exception as e:
        return {"error": str(e)}

# ======================= LOGIN & SIGNUP =======================

@app.post("/signup")
async def signup(user: SignupRequest):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        return {"error": "User already exists"}

    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())

    user_dict = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password.decode('utf-8'),
        "contact_number": user.contact_number,
        "profession": user.profession,
    }

    await users_collection.insert_one(user_dict)
    return {"message": "Signup successful"}

@app.post("/login")
async def login(data: LoginRequest):
    user = await users_collection.find_one({"email": data.email})
    if not user:
        return {"error": "Invalid email or password"}

    if bcrypt.checkpw(data.password.encode('utf-8'), user["password"].encode('utf-8')):
        return {
            "message": "Login successful",
            "user": {"name": user["name"], "email": user["email"]}
        }
    return {"error": "Invalid email or password"}

# ======================= FLOOD PREDICTION =======================

@app.post("/predict")
async def predict_flood_risk(data: FloodInput):
    try:
        input_data = [
            data.Station_Names, data.Year, data.Month, data.Max_Temp, data.Min_Temp,
            data.Rainfall, data.Relative_Humidity, data.Wind_Speed, data.Cloud_Coverage,
            data.Bright_Sunshine, data.Station_Number, data.X_COR, data.Y_COR,
            data.LATITUDE, data.LONGITUDE, data.ALT, data.Period
        ]

        result, probability = predict_flood(input_data)

        return {
            "flood_prediction": "Yes" if result == 1 else "No",
            "risk_percentage": round(probability * 100, 2)
        }
    except Exception as e:
        return {"error": str(e)}

# ======================= CHARTS & STATION DATA =======================

@app.get("/stations")
async def get_station_data():
    try:
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

@app.get("/station-data/{station_name}")
async def get_station_data(station_name: str):
    try:
        station_name = station_name.strip().title()
        filtered_df = df[
            (df["Station_Names"].str.strip().str.title() == station_name) & (df["Flood?"] == 1)
        ]
        if filtered_df.empty:
            return {"message": f"No flood data available for {station_name}."}

        data = filtered_df[["Year", "Rainfall", "Max_Temp"]].to_dict(orient="records")
        return {"station": station_name, "data": data}
    except Exception as e:
        return {"error": str(e)}

@app.get("/station-yearly-data/{station_name}")
async def get_station_yearly_data(station_name: str):
    try:
        station_name = station_name.strip().title()
        station_df = df[df["Station_Names"].str.strip().str.title() == station_name]

        if station_df.empty:
            return {"message": f"No data available for {station_name}."}

        yearly_data = (
            station_df.groupby("Year")[["Rainfall", "Max_Temp"]].mean().reset_index()
        )
        return {"station": station_name, "data": yearly_data.to_dict(orient="records")}
    except Exception as e:
        return {"error": str(e)}

# ======================= RUN APP =======================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)

import { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styles from "./StationDetails.module.css";

const StationDetails = () => {
  const [formData, setFormData] = useState({
    Station_Names: "",
    Year: "",
    Month: "",
    Max_Temp: "",
    Min_Temp: "",
    Rainfall: "",
    Relative_Humidity: "",
    Wind_Speed: "",
    Cloud_Coverage: "",
    Bright_Sunshine: "",
    Station_Number: "",
    X_COR: "",
    Y_COR: "",
    LATITUDE: "",
    LONGITUDE: "",
    ALT: "",
    Period: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [alertSent, setAlertSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertSent(false);

    try {
      const response = await fetch("http://localhost:8002/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
  };

  const sendAlert = async () => {
    try {
      const response = await fetch("http://localhost:8002/trigger-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `⚠️ Flood Alert: Flood risk is ${prediction ? prediction.risk_percentage.toFixed(2) : 'unknown'}% at station ${formData.Station_Names}`,
        }),
      });

      const result = await response.json();
      if (result.status === "success") {
        setAlertSent(true);
        alert("🚨 Alert sent successfully!");
      } else {
        alert("❌ Failed to send alert.");
      }
    } catch (err) {
      console.error("Alert error:", err);
      alert("❌ Error sending alert.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Flood Prediction Input</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input className={styles.inputField} type="text" name="Station_Names" placeholder="Station Name" onChange={handleChange} required />
        <input className={styles.inputField} type="number" name="Year" placeholder="Year" onChange={handleChange} required />
        <input className={styles.inputField} type="number" name="Month" placeholder="Month" onChange={handleChange} required />
        <input className={styles.inputField} type="number" name="Max_Temp" placeholder="Max Temp (°C)" step="any" onChange={handleChange} required />
        <input className={styles.inputField} type="number" name="Min_Temp" placeholder="Min Temp (°C)" step="any" onChange={handleChange} required />
        <input className={styles.inputField} type="number" name="Rainfall" placeholder="Rainfall (mm)" step="any" onChange={handleChange} required />
        <input className={styles.inputField} type="number" name="Relative_Humidity" placeholder="Relative Humidity (%)" step="any" onChange={handleChange} required />
        <input className={styles.inputField} type="number" name="Wind_Speed" placeholder="Wind Speed (m/s)" step="any" onChange={handleChange} required />
        <input className={styles.inputField} type="number" name="Cloud_Coverage" placeholder="Cloud Coverage (%)" step="any" onChange={handleChange} required />
        <input className={styles.inputField} type="number" name="Bright_Sunshine" placeholder="Bright Sunshine (hrs)" step="any" onChange={handleChange} required />
        <input className={styles.inputField} type="number" name="Station_Number" placeholder="Station Number" onChange={handleChange} required />
        <input className={styles.inputField} type="number" name="X_COR" placeholder="X Coordinate" step="any" onChange={handleChange} required />
        <input className={styles.inputField} type="number" name="Y_COR" placeholder="Y Coordinate" step="any" onChange={handleChange} required />
        <input className={styles.inputField} type="number" name="LATITUDE" placeholder="Latitude" step="any" onChange={handleChange} required />
        <input className={styles.inputField} type="number" name="LONGITUDE" placeholder="Longitude" step="any" onChange={handleChange} required />
        <input className={styles.inputField} type="number" name="ALT" placeholder="Altitude" onChange={handleChange} required />
        <input className={styles.inputField} type="number" name="Period" placeholder="Period" step="any" onChange={handleChange} required />

        <button type="submit" className={styles.submitBtn}>Predict Flood Risk</button>
      </form>

      {/* Moved the Alert button outside the prediction check */}
      <button onClick={sendAlert} className={styles.alertButton}>
        🚨 Send Emergency Alert
      </button>
      {alertSent && <p className={styles.alertSuccess}>✅ Alert Sent Successfully!</p>}

      {prediction && (
        <div className={styles.result}>
          <h3>Prediction Result</h3>
          <p className={styles.floodPrediction}>
            <strong>Flood Prediction:</strong> {prediction.flood_prediction}
          </p>

          <div className={styles.progressWrapper}>
            <p className={styles.riskLabel}>Flood Risk Prediction</p>
            <div className={styles.progressContainer}>
              <CircularProgressbar
                value={prediction.risk_percentage}
                text={`${prediction.risk_percentage.toFixed(2)}%`}
                styles={buildStyles({
                  textColor: "#ffffff",
                  pathColor: prediction.risk_percentage > 70 ? "#ff4c4c" : "#00cc99",
                  trailColor: "#222233",
                  textSize: "16px",
                })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationDetails;

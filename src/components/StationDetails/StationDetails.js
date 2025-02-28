import { useState } from "react";
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/predict", {
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

      {prediction && (
        <div className={styles.result}>
          <h3>Prediction Result</h3>
          <p><strong>Flood Prediction:</strong> {prediction.flood_prediction}</p>
          <p><strong>Risk Percentage:</strong> {prediction.risk_percentage.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};

export default StationDetails;

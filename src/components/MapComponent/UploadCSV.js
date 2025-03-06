import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import styles from "./UploadCSV.module.css";

const UploadCSV = ({ setStations }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      setFile(e.dataTransfer.files[0]);
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    if (e.target.files.length) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please upload a CSV file.");
      return;
    }

    setLoading(true);
    setError("");

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: async (results) => {
        let stationsWithRisk = [];

        for (const row of results.data) {
          if (!row.Station_Names || !row.LATITUDE || !row.LONGITUDE) continue;

          const station = {
            Station_Names: row.Station_Names.toString().trim(),
            Year: parseInt(row.Year),
            Month: parseInt(row.Month),
            Max_Temp: parseFloat(row.Max_Temp),
            Min_Temp: parseFloat(row.Min_Temp),
            Rainfall: parseFloat(row.Rainfall),
            Relative_Humidity: parseFloat(row.Relative_Humidity),
            Wind_Speed: parseFloat(row.Wind_Speed),
            Cloud_Coverage: parseFloat(row.Cloud_Coverage),
            Bright_Sunshine: parseFloat(row.Bright_Sunshine),
            Station_Number: parseInt(row.Station_Number),
            X_COR: parseFloat(row.X_COR),
            Y_COR: parseFloat(row.Y_COR),
            LATITUDE: parseFloat(row.LATITUDE),
            LONGITUDE: parseFloat(row.LONGITUDE),
            ALT: parseFloat(row.ALT),
            Period: parseFloat(row.Period),
          };

          try {
            const response = await axios.post("http://localhost:8000/predict", station, {
              headers: { "Content-Type": "application/json" },
            });

            const risk = response.data.risk_percentage;

            stationsWithRisk.push({
              id: row.Station_Number,
              name: row.Station_Names,
              lat: row.LATITUDE,
              lng: row.LONGITUDE,
              risk,
            });
          } catch (error) {
            console.error("Error predicting risk for:", station.Station_Names, error.response?.data || error.message);
          }
        }

        setStations(stationsWithRisk);
        setLoading(false);
      },
      error: (error) => {
        console.error("CSV Parsing Error:", error);
        setError("Error processing CSV file.");
        setLoading(false);
      },
    });
  };

  return (
    <div className={styles.uploadContainer} onDrop={handleDrop} onDragOver={handleDragOver}>
      <label className={styles.dragDropArea}>
        {fileName}
        <input type="file" accept=".csv" onChange={handleFileChange} className={styles.fileInput} />
      </label>
      <button onClick={handleUpload} className={styles.uploadButton} disabled={loading}>
        {loading ? "Processing..." : "Upload & Predict"}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default UploadCSV;

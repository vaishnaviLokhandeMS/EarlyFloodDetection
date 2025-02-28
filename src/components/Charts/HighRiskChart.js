import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./HighRiskChart.module.css";

const StationChart = () => {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [chartData, setChartData] = useState([]);
  const [yearlyRainfallData, setYearlyRainfallData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch unique station names
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("http://localhost:8000/stations");
        const result = await response.json();
        console.log("📌 Available Stations:", result.stations);
        setStations(result.stations.map((s) => s.Station_Names));
      } catch (error) {
        console.error("❌ Error fetching stations:", error);
      }
    };
    fetchStations();
  }, []);

  // ✅ Fetch data when a station is selected
  useEffect(() => {
    if (!selectedStation) return;

    const fetchChartData = async () => {
      setLoading(true);
      try {
        // Fetch flood-related station data
        const response = await fetch(`http://localhost:8000/station-data/${selectedStation}`);
        const result = await response.json();
        console.log("📊 Flood Data for Station:", result);
        setChartData(result.data || []);
      } catch (error) {
        console.error("❌ Error fetching station flood data:", error);
      }

      try {
        // Fetch only relevant YEARLY RAINFALL data (No Temperature, No Extra Years)
        const yearlyResponse = await fetch(`http://localhost:8000/station-yearly-data/${selectedStation}`);
        const yearlyResult = await yearlyResponse.json();
        console.log("📆 Yearly Rainfall Data:", yearlyResult);

        // ✅ Filter relevant years (e.g., last 20 years)
        const filteredData = yearlyResult.data?.filter((item) => item.Year >= 2000) || [];
        setYearlyRainfallData(filteredData);
      } catch (error) {
        console.error("❌ Error fetching yearly rainfall data:", error);
      }

      setLoading(false);
    };

    fetchChartData();
  }, [selectedStation]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Flood & Rainfall Analysis by Station</h2>

      {/* ✅ Dropdown for selecting station */}
      <div className={styles.dropdownWrapper}>
        <label>Select Station:</label>
        <select
          value={selectedStation}
          onChange={(e) => setSelectedStation(e.target.value)}
          className={styles.selectDropdown}
        >
          <option value="">-- Select a Station --</option>
          {stations.map((station, index) => (
            <option key={index} value={station}>
              {station}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Display charts */}
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          {/* 🚀 Chart 1: Flood Analysis for Selected Station */}
          {chartData.length > 0 && (
            <div className={styles.chartWrapper}>
              <h3>📊 Flood Analysis for {selectedStation}</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Year" />
                  <YAxis yAxisId="left" label={{ value: "Rainfall (mm)", angle: -90, position: "insideLeft" }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: "Temperature (°C)", angle: 90, position: "insideRight" }} />
                  <Tooltip
                    formatter={(value, name) => {
                      const formattedValue = parseFloat(value).toFixed(2);
                      return name === "Rainfall" ? [`${formattedValue} mm`, "Rainfall"] : [`${formattedValue}°C`, "Temperature"];
                    }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="Rainfall" stroke="#00aaff" dot={{ r: 5 }} />
                  <Line yAxisId="right" type="monotone" dataKey="Max_Temp" stroke="#ff5733" dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* 🚀 Chart 2: Yearly Rainfall Trends (NO Temperature, Only Recent Years) */}
          {yearlyRainfallData.length > 0 && (
            <div className={styles.chartWrapper}>
              <h3>🌧️ Yearly Rainfall Trends</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={yearlyRainfallData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Year" />
                  <YAxis label={{ value: "Rainfall (mm)", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    formatter={(value) => {
                      return [`${parseFloat(value).toFixed(2)} mm`, "Rainfall"];
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Rainfall" stroke="#00cc44" dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StationChart;

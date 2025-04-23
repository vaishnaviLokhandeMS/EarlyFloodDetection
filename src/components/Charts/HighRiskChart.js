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
  const [filteredData, setFilteredData] = useState([]);
  const [yearlyRainfallData, setYearlyRainfallData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAllData, setShowAllData] = useState(false);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("http://localhost:8002/stations");
        const result = await response.json();
        setStations(result.stations.map((s) => s.Station_Names));
      } catch (error) {
        console.error("❌ Error fetching stations:", error);
      }
    };
    fetchStations();
  }, []);

  useEffect(() => {
    if (!selectedStation) return;

    const fetchChartData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8002/station-data/${selectedStation}`);
        const result = await response.json();
        console.log(result)
        setChartData(result.data || []);
        setFilteredData(result.data.filter((item) => item.Year >= 2000) || []);
      } catch (error) {
        console.error("❌ Error fetching station flood data:", error);
      }
 
      try {
        const yearlyResponse = await fetch(`http://localhost:8002/station-yearly-data/${selectedStation}`);
        const yearlyResult = await yearlyResponse.json();
        const filteredYearlyData = yearlyResult.data?.filter((item) => item.Year >= 2000) || [];
        setYearlyRainfallData(filteredYearlyData);
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
      <div className={styles.dropdownWrapper}>
        <label>Select Station:  </label>
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

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className={styles.chartsGrid}>
        {filteredData.length > 0 && (
          <div className={styles.chartWrapper}>
            <div className={styles.chartHeader}>
              <h3>📊 Flood Analysis for {selectedStation}</h3>
              <button onClick={() => setShowAllData(!showAllData)} className={styles.toggleButton}>
                {showAllData ? "Show Recent Data (2000+)" : "Show All Data"}
              </button>
            </div>
            <hr />
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={showAllData ? chartData : filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Year" />
                <YAxis yAxisId="left" label={{ value: "Rainfall (mm)", angle: -90, position: "insideLeft" }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: "Temperature (°C)", angle: 90, position: "insideRight" }} />
                <Tooltip formatter={(value, name) => [`${parseFloat(value).toFixed(2)}${name === "Rainfall" ? " mm" : "°C"}`, name]} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="Rainfall" stroke="#00aaff" dot={{ r: 5 }} />
                <Line yAxisId="right" type="monotone" dataKey="Max_Temp" stroke="#ff5733" dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      
        {yearlyRainfallData.length > 0 && (
          <div className={styles.chartWrapper}>
            <div className={styles.chartHeader}>
              <h3>🌧️ Yearly Rainfall Trends</h3>
            </div>
            <hr />
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yearlyRainfallData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Year" />
                <YAxis label={{ value: "Rainfall (mm)", angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(value) => [`${parseFloat(value).toFixed(2)} mm`, "Rainfall"]} />
                <Legend />
                <Line type="monotone" dataKey="Rainfall" stroke="#00cc44" dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      
      )}
    </div>
  );
};

export default StationChart;

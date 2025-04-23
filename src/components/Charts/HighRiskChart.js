import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./HighRiskChart.module.css";

const COLORS = [
  "#00a19f",
  "#ff5733",
  "#28b463",
  "#ffc197",
  "#8e44ad",
  "#ff1493",
  "#ff4500",
  "#32cd32",
  "#1e90ff",
  "#ffd700",
  "#dc143c",
  "#321080",
  "#740000",
  "#871954",
];

const StationChart = () => {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [chartData, setChartData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [yearlyRainfallData, setYearlyRainfallData] = useState([]);
  const [monthlyRainfallData, setMonthlyRainfallData] = useState([]);
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
        setChartData(result.data || []);
        setFilteredData(result.data?.filter((item) => item.Year >= 2000) || []);
      } catch (error) {
        console.error("❌ Error fetching station data:", error);
      }

      try {
        const yearlyResponse = await fetch(`http://localhost:8002/station-yearly-data/${selectedStation}`);
        const yearlyResult = await yearlyResponse.json();
        setYearlyRainfallData(
          yearlyResult.data?.filter((item) => item.Year >= 2000) || []
        );
      } catch (error) {
        console.error("❌ Error fetching yearly rainfall data:", error);
      }

      try {
        const monthlyResponse = await fetch(
          `http://localhost:8002/station-monthly-data/${selectedStation}`
        );
        const monthlyResult = await monthlyResponse.json();
        setMonthlyRainfallData(monthlyResult.data || []);
      } catch (error) {
        console.error("❌ Error fetching monthly rainfall data:", error);
      }

      setLoading(false);
    };

    fetchChartData();
  }, [selectedStation]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        📊 Flood & Rainfall Analysis by Station
      </h2>
      <div className={styles.dropdownWrapper}>
        <label>Select Station: </label>
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
          {/* Flood Analysis Chart */}
          {filteredData.length > 0 && (
            <div className={styles.chartWrapper}>
              <h3>🌊 Flood Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={showAllData ? chartData : filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Year" />
                  <YAxis
                    yAxisId="left"
                    label={{
                      value: "Rainfall (mm)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "Temperature (°C)",
                      angle: 90,
                      position: "insideRight",
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="Rainfall"
                    stroke="#00aaff"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="Max_Temp"
                    stroke="#ff5733"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Yearly Rainfall Chart */}
          {yearlyRainfallData.length > 0 && (
            <div
              className={`${styles.chartWrapper} ${styles.yearlyRainfallChart}`}
            >
              <h3>🌧️ Yearly Rainfall Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearlyRainfallData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Year" />
                  <YAxis />
                  <Tooltip formatter={(value) => value.toFixed(3)} /> <Legend />
                  <Bar dataKey="Rainfall" fill="#218067" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Monthly Rainfall Bar Chart */}
          {monthlyRainfallData.length > 0 && (
            <div className={styles.chartWrapper}>
              <h3>📅 Monthly Rainfall Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRainfallData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Rainfall" fill="#00d4ff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Temperature Trend Area Chart */}
          {filteredData.length > 0 && (
            <div className={styles.chartWrapper}>
              <h3>🌡️ Temperature Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="Max_Temp"
                    stroke="#ff5733"
                    fill="#ff5733a0"
                  />
                  {/* <Area
                    type="monotone"
                    dataKey="Min_Temp"
                    stroke="#007bff"
                    fill="#007bffa0"
                  /> */}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Pie Chart for Rainfall Distribution */}
          {yearlyRainfallData.length > 0 && (
            <div className={styles.chartWrapper}>
              <h3>📊 Rainfall Distribution</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={yearlyRainfallData}
                    dataKey="Rainfall"
                    nameKey="Year"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    stroke="none"
                  >
                    {yearlyRainfallData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        opacity={0.8}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toFixed(3)} />{" "}
                  <Legend
                    verticalAlign="bottom"
                    iconSize={10}
                    layout="horizontal"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StationChart;

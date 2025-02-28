import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import styles from "./HighRiskChart.module.css";

const HighRiskChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/stations");
        const result = await response.json();
        console.log("API Response:", result);
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading charts...</p>;
  if (error) return <p>Error fetching data: {error}</p>;
  if (!data) return <p>No data available.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Flood & Rainfall Analysis</h2>

      {/* Bar Chart: Total Rainfall by Station */}
      <div className={styles.chartWrapper}>
        <h3>📊 Total Rainfall by Station</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data.stations}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Station_Na" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Rainfall" fill="#00aaff" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart: Monthly Rainfall Trends */}
      <div className={styles.chartWrapper}>
        <h3>📈 Average Monthly Rainfall</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data.monthly_rainfall}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Rainfall" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Scatter Chart: Correlation between Rainfall & Floods */}
      <div className={styles.chartWrapper}>
        <h3>🌊 Correlation Between Rainfall & Floods</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart>
            <CartesianGrid />
            <XAxis dataKey="Rainfall" name="Rainfall (mm)" />
            <YAxis dataKey="Flood?" name="Flood Probability" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            <Scatter name="Rainfall vs Floods" data={data.rainfall_flood_correlation} fill="#ff0000" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart: Flood Incidents Per Station */}
      <div className={styles.chartWrapper}>
        <h3>🚨 Total Flood Incidents Per Station</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data.floods}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Station_Na" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Flood?" fill="#ff3300" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HighRiskChart;

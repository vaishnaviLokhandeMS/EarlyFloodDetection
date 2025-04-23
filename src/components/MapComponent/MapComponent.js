import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import UploadCSV from "./UploadCSV";
import styles from "./MapComponent.module.css";

const getMarkerProperties = (risk) => {
  let color;
  let radius = 10;

  if (risk > 60) {
    color = "red";
    radius = 15;
  } else if (risk > 40) {
    color = "blue";
    radius = 12;
  } else {
    color = "green";
  }

  return { color, radius };
};

const MapBounds = ({ stations }) => {
  const map = useMap();
  useEffect(() => {
    if (stations.length > 0) {
      const bounds = stations.map((station) => [station.lat, station.lng]);
      map.fitBounds(bounds);
    }
  }, [stations, map]);
  return null;
};

const MapComponent = () => {
  const [stations, setStations] = useState([]);

  return (
    <div className={styles.mapContainer}>
      <h2 className={styles.title}>Flood Risk Prediction Map</h2>

      <UploadCSV setStations={setStations} />

      <MapContainer center={[19.07, 72.87]} zoom={7} className={styles.map}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapBounds stations={stations} />

        {stations.map((station) => {
          const { color, radius } = getMarkerProperties(station.risk);
          return (
            <CircleMarker
              key={station.id}
              center={[station.lat, station.lng]}
              radius={radius}
              color={color}
              fillColor={color}
              fillOpacity={0.6}
            >
              <Popup>
                <strong>{station.name}</strong> <br />
                <strong>Risk:</strong>{" "}
                {station.risk !== undefined
                  ? `${station.risk.toFixed(2)}%`
                  : "Data Pending"}{" "}
                <br />
                <strong>Status:</strong>
                {station.risk > 60
                  ? "🔴 High Alert"
                  : station.risk > 40
                  ? "🔵 Moderate Risk"
                  : "🟢 Low Risk"}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;

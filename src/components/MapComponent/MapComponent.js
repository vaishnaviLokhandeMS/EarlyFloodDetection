import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MapComponent.module.css";

const MapComponent = () => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get("/api/stations");
        setStations(response.data);
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };
    fetchStations();
  }, []);

  return (
    <div className={styles.mapContainer}>
      {/* Y-Axis Labels */}
      <div className={styles.yAxis}>
        <span>52.3</span>
        <span>52.2</span>
        <span>52.1</span>
        <span>52.0</span>
      </div>

      {/* Leaflet Map */}
      <MapContainer center={[16.85, 74.57]} zoom={10} className={styles.map}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {stations.map((station) => (
          <Marker key={station.id} position={[station.lat, station.lng]}>
            <Popup>
              <strong>{station.name}</strong> <br />
              <a href={`/station/${station.id}`}>View Details</a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* X-Axis Labels */}
      <div className={styles.xAxis}>
        <span>-0.1</span>
        <span>0</span>
        <span>0.1</span>
        <span>0.2</span>
        <span>0.3</span>
      </div>

      {/* Description Below Map */}
      <p className={styles.mapDescription}>
        Real-time flood monitoring map displaying active stations and flood-prone areas.
      </p>
    </div>
  );
};

export default MapComponent;

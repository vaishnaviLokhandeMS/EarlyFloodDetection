import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MapComponent.module.css";
import L from "leaflet";

// Custom Marker Icon (Fix for Leaflet default icon issue)
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Component to Adjust Map Bounds
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

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get("/api/stations"); // Replace with actual API
        console.log("Fetched stations:", response.data);
        setStations(response.data);
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };
    fetchStations();
  }, []);

  return (
    <div className={styles.mapContainer}>
      <h2 className={styles.title}>Flood Monitoring Stations</h2>

      <MapContainer center={[16.85, 74.57]} zoom={10} className={styles.map}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapBounds stations={stations} />
        {stations.length > 0 ? (
          stations.map((station) =>
            station.lat && station.lng ? (
              <Marker key={station.id} position={[station.lat, station.lng]} icon={customIcon}>
                <Popup>
                  <strong>{station.name}</strong> <br />
                  <a href={`/station/${station.id}`}>View Details</a>
                </Popup>
              </Marker>
            ) : null
          )
        ) : (
          <p className={styles.noData}>No stations available</p>
        )}
      </MapContainer>

      <p className={styles.mapDescription}>
        Real-time flood monitoring map displaying active stations and flood-prone areas.
      </p>
    </div>
  );
};

export default MapComponent;

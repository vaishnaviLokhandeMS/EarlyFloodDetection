import "../styles/globals.css"; 

import dynamic from "next/dynamic";
import Navbar from "../components/Navbar/Navbar";
import StationDetails from "../components/StationDetails/StationDetails";
import HighRiskCharts from "../components/Charts/HighRiskChart";
import Footer from "../components/Footer/Footer";
import Login from "../components/Login/Login";
import Signup from "../components/Signup/Signup";

const MapComponent = dynamic(
  () => import("../components/MapComponent/MapComponent"),
  { ssr: false }
);

export default function Home() {
  return (
    <div>
      {/* <Login />
      <Signup /> */}
      <Navbar />
      <MapComponent />
      <StationDetails />
      <HighRiskCharts />
      <Footer />
    </div>
  );
}

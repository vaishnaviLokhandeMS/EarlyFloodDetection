"use client";

import React from "react";
import Navbar from "../../src/components/Navbar/Navbar";
import StationDetails from "../../src/components/StationDetails/StationDetails";
import HighRiskCharts from "../../src/components/Charts/HighRiskChart";
import Footer from "../../src/components/Footer/Footer";
import Contacts from "../../src/components/contacts/Contacts";
import ScrollToTop from "../../src/components/ScrollToTop/ScrollToTop";
import dynamic from "next/dynamic";

import "../../src/styles/dashboard.css";

const MapComponent = dynamic(
  () => import("../../src/components/MapComponent/MapComponent"),
  { ssr: false }
);

const page = () => {
  return (
    <div className="dashboard-wrapper">
      <Navbar />

      <section id="dashboard">
        <MapComponent />
      </section>

      <section id="predictions">
        <StationDetails />
      </section>

      <section id="reports">
        <HighRiskCharts />
      </section>

      <section id="contact">
        <Contacts />
      </section>

      <section id="footer">
        <Footer />
      </section>

      <ScrollToTop />
    </div>
  );
};

export default page;

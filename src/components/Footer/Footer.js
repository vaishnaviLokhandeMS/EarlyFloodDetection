import React, { useEffect, useState } from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  const [year, setYear] = useState(null);

  useEffect(() => {
    setYear(new Date().getFullYear()); // Ensure it runs only on the client
  }, []);

  return (
    <footer className={styles.footer}>
      <p>© {year ?? "Loading..."} Early Flood Detection. All rights reserved.</p>
    </footer>
  );
};

export default Footer;

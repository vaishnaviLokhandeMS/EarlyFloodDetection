import styles from "./Navbar.module.css";
import { FaWater } from "react-icons/fa"; // Water droplet icon for flood theme

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <FaWater className={styles.icon} />
        <h1>Flood Detection</h1>
      </div>
      <ul className={styles.navLinks}>
        <li><a href="#">Home</a></li>
        <li><a href="#">Dashboard</a></li>
        <li><a href="#">Predictions</a></li>
        <li><a href="#">Reports</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
      <button className={styles.loginBtn}>Login</button>
    </nav>
  );
};

export default Navbar;

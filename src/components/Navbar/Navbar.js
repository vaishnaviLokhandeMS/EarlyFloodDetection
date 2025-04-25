"use client";

import styles from "../Navbar/Navbar.module.css";
import { FaWater } from "react-icons/fa";
import { signOut } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <FaWater className={styles.icon} />
        <h1>Flood Detection</h1>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link href="#dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="#predictions">Predictions</Link>
        </li>
        <li>
          <Link href="#reports">Reports</Link>
        </li>
        <li>
          <Link href="#contact">Contact</Link>
        </li>
        <li>
          <button className={styles.logoutBtn} onClick={handleSignOut}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

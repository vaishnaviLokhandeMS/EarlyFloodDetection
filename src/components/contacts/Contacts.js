"use client";

import { useRef } from "react";
import styles from "./Contacts.module.css";

export default function Contacts() {
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = formRef.current;
    const formData = new FormData(form);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      form.reset(); // ✅ reset the form
      alert("Thank you! Your message has been sent.");
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>📩 Contact Us</h2>
      <p className={styles.subtext}>Fill the form below to get in touch.</p>

      <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
        <input
          type="hidden"
          name="access_key"
          value="aa80c95e-c5c0-463e-88a2-5f353a2b27fe"
        />

        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          className={styles.input}
        />

        <label htmlFor="message" className={styles.label}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          className={styles.textarea}
        />

        <button type="submit" className={styles.button}>
          Send
        </button>
      </form>
    </div>
  );
}

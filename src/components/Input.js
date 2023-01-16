import React from "react";
import "../styles/modal.css";

export default function Input({ type, label, id }) {
  return (
    <div className="label-input">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        required
        minLength={type === "password" ? 8 : 0}
      />
    </div>
  );
}

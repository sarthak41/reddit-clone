import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect } from "react";
import { auth, firestore } from "../firebase/index";
import { doc, getDoc } from "firebase/firestore";
import Input from "./Input";
import closeIcon from "../images/svgs/close.svg";
import "../styles/modal.css";

export default function Login({
  toggleModals,
  closeModals,
  alertMsg,
  setAlertMsg,
  setUser,
}) {
  const login = async () => {
    if (alertMsg === "") {
      const email = document.getElementById("email");
      const password = document.getElementById("password");

      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        setAlertMsg("Logged in!");
        const user = await getDoc(doc(firestore, "User", auth.currentUser.uid));
        setUser({ uid: user.id, ...user.data() });
        setTimeout(closeModals, 1500);
      } catch (error) {
        let errorCode = error.code
          .slice(error.code.indexOf("/") + 1)
          .split("-")
          .join(" ");

        errorCode = errorCode[0].toUpperCase() + errorCode.slice(1);
        setAlertMsg(errorCode);
        email.parentNode.style.border = "1px solid var(--red)";
      }
    }
  };

  const clientValidate = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const form = document.querySelector("form");

    email.addEventListener("input", (event) => {
      if (email.validity.valueMissing) {
        setAlertMsg("Need an email");
      } else if (!email.validity.valid) {
        setAlertMsg(
          "Email incorrect. A correct email would be example@gmail.com"
        );
      } else {
        setAlertMsg("");
      }
    });

    password.addEventListener("input", (event) => {
      if (password.validity.valueMissing) {
        setAlertMsg("Need a password");
      } else if (password.validity.tooShort) {
        setAlertMsg("Password needs to be atleast 8 characters");
      } else {
        setAlertMsg("");
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (email.validity.valueMissing) {
        setAlertMsg("Need an email");
      } else if (!email.validity.valid) {
        setAlertMsg(
          "Email incorrect. A correct email would be example@gmail.com"
        );
      } else {
        setAlertMsg("");
      }

      if (password.validity.valueMissing) {
        setAlertMsg("Need a password");
      } else if (password.validity.tooShort) {
        setAlertMsg("Password needs to be atleast 8 characters");
      } else {
        setAlertMsg("");
      }
    });
  };

  useEffect(() => {
    clientValidate();
  });

  return (
    <div className="overlay">
      <div className="modal">
        <div className={`err-msg ${alertMsg ? "" : "inherit-bg"}`}>
          {alertMsg}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          <Input type="email" label="Email" id="email" />
          <Input type="password" label="Password" id="password" />
          <button type="submit">Login</button>
        </form>
        <button className="close-btn" onClick={closeModals}>
          <img src={closeIcon} alt="Close Signup" />
        </button>
        <div>
          Don't have an account?{" "}
          <button className="btn-link" onClick={toggleModals}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

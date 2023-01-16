import {
  // getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import React, { useEffect } from "react";
import { auth } from "../firebase/index";
import Input from "./Input";
import closeIcon from "../images/svgs/close.svg";
import "../styles/modal.css";

export default function Signup({
  toggleModals,
  closeModals,
  alertMsg,
  setAlertMsg,
}) {
  const signup = () => {
    if (alertMsg === "") {
      const email = document.getElementById("email");
      const password = document.getElementById("password");
      const uname = document.getElementById("username");

      //creates account
      createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
          // const user = userCredential.user;
          setAlertMsg("Account created! Redirecting to login page...");

          //set username
          updateProfile(auth.currentUser, {
            displayName: uname.value,
          })
            .then(() => {
              alert("updated");
            })
            .catch((e) => {
              alert(e);
            });

          signOut(auth);

          //redirect to login page
          setTimeout(toggleModals, 1500);
        })
        .catch((error) => {
          //error messages
          let errorCode = error.code
            .slice(error.code.indexOf("/") + 1)
            .split("-")
            .join(" ");

          errorCode = errorCode[0].toUpperCase() + errorCode.slice(1);
          setAlertMsg(errorCode);
          email.parentNode.style.border = "1px solid var(--red)";
        });
    }
  };

  const clientValidate = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const cpass = document.getElementById("cpass");
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

    cpass.addEventListener("input", (event) => {
      if (alertMsg === "") {
        if (cpass.value !== password.value) {
          setAlertMsg("Passwords don't match");
          cpass.parentElement.style.border = "1px solid var(--red)";
        } else {
          setAlertMsg("");
          cpass.parentElement.style.border = "1px solid var(--green)";
        }
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

      if (cpass.value !== password.value) {
        setAlertMsg("Passwords don't match");
        cpass.parentElement.style.border = "1px solid var(--red)";
      } else {
        setAlertMsg("");
        cpass.parentElement.style.border = "1px solid var(--green)";
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
            signup();
          }}
        >
          <Input type="email" label="Email" id="email" />
          <Input type="text" label="Username" id="username" />
          <Input type="password" label="Password" id="password" />
          <Input type="password" label="Confirm Password" id="cpass" />
          <button type="submit">Sign Up</button>
        </form>
        <button className="close-btn" onClick={closeModals}>
          <img src={closeIcon} alt="Close Signup" />
        </button>
      </div>
    </div>
  );
}

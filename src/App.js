import "./App.css";
import "./styles/global.css";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import { auth } from "./firebase/index";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import Login from "./components/Login";

function App() {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const toggleModals = () => {
    setShowLoginModal(!showLoginModal);
    setShowSignupModal(!showSignupModal);
    setAlertMsg("");
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    setAlertMsg("");
  };

  useEffect(() => {
    if (showSignupModal && showLoginModal) {
      let bodyClick = document.body.style.pointerEvents;
      if (bodyClick === "none") document.body.style.pointerEvents = "auto";
      else document.body.style.pointerEvents = "none";
    }
  }, [showSignupModal, showLoginModal]);

  return (
    <>
      <button onClick={() => setShowSignupModal(true)}>Sign up</button>
      <button onClick={() => setShowLoginModal(true)}>Login</button>
      {showSignupModal && (
        <Signup
          toggleModals={toggleModals}
          closeModals={closeModals}
          alertMsg={alertMsg}
          setAlertMsg={setAlertMsg}
        />
      )}

      {showLoginModal && (
        <Login
          toggleModals={toggleModals}
          closeModals={closeModals}
          alertMsg={alertMsg}
          setAlertMsg={setAlertMsg}
        />
      )}
      {auth.currentUser && (
        <div>
          {auth.currentUser.uid} {auth.currentUser.displayName}
        </div>
      )}

      <button
        onClick={() => {
          console.log(auth.currentUser);
        }}
      >
        dekh
      </button>
      <button
        onClick={() => {
          signOut(auth);
        }}
      >
        Logout
      </button>
    </>
  );
}

export default App;

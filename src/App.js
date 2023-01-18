import "./App.css";
import "./styles/global.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import { auth } from "./firebase/index";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Nav from "./components/Nav";

function App() {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [user, setUser] = useState(null);

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
      <BrowserRouter>
        <Nav
          user={user}
          setShowLoginModal={setShowLoginModal}
          setUser={setUser}
        />
      </BrowserRouter>

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
          setUser={setUser}
        />
      )}
    </>
  );
}

export default App;

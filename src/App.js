import "./App.css";
import "./styles/global.css";
import "./styles/other.css";
import { auth } from "./firebase/index";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Nav from "./components/Nav";
import Submit from "./components/Submit";
import Home from "./components/Home";
import Post from "./components/Post";
import Subreddit from "./components/Subreddit";

function App() {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [user, setUser] = useState(auth.currentUser);
  const [subreddit, setSubreddit] = useState(null);

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

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/submit"
            element={
              <Submit
                user={user}
                setShowLoginModal={setShowLoginModal}
                subreddit={subreddit}
                setSubreddit={setSubreddit}
              />
            }
          />
          <Route path="r/:subId" element={<Subreddit />} />
          <Route
            path="r/:subId/post/:postId"
            element={<Post setShowLoginModal={setShowLoginModal} user={user} />}
          />
        </Routes>
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

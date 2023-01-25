import React from "react";
import { Link } from "react-router-dom";
import "../styles/nav.css";
import createIcon from "../images/svgs/plus.svg";
import expandIcon from "../images/svgs/expandmore.svg";

import { auth } from "../firebase/index";
import { signOut } from "firebase/auth";

export default function Nav({ user, setShowLoginModal, setUser }) {
  return (
    <nav>
      <ul className="items">
        <div className="flex">
          <li>
            <Link to="/">
              <h1>reddit</h1>
            </Link>
          </li>
        </div>
        <div className="flex">
          <li>
            <Link to="/submit">
              <button className="action-btn" title="Create Post">
                <img src={createIcon} alt="cart" />
              </button>
            </Link>
          </li>

          <li className="dropdown">
            <button
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {user ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "start",
                    }}
                  >
                    <span>{user.username}</span>
                    <span style={{ color: "var(--dark-gray)" }}>
                      {(user.karma / 1000).toFixed(1)}k karma
                    </span>
                  </div>
                  <img src={expandIcon} alt="dropdown" />
                </>
              ) : (
                <button className="btn" onClick={() => setShowLoginModal(true)}>
                  Login
                </button>
              )}
            </button>
            {user && (
              <ul className="dropdown-items">
                <li>Delete Account</li>
                <li>
                  <button
                    onClick={() => {
                      signOut(auth);
                      setUser(null);
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </li>
        </div>
      </ul>
    </nav>
  );
}

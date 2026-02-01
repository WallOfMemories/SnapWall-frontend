import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Topbar from "./components/Topbar.jsx";
import bgVideo from "./assets/background.mp4";
import "./App.css";

function App() {
  const location = useLocation();

  /* 🔍 GLOBAL SEARCH STATE */
  const [searchQuery, setSearchQuery] = useState("");

  const hideTopbar =
    ["/login", "/signup", "/forgot", "/otp-verify", "/profile-details", "/success"]
      .includes(location.pathname);

  /* 🔄 RESET SEARCH ON PAGE CHANGE */
  useEffect(() => {
    setSearchQuery("");
  }, [location.pathname]);

  return (
    <div className="app-root">
      {/* 🎥 VIDEO BACKGROUND */}
      <video
        className="bg-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* 🌫 Overlay for readability */}
      <div className="bg-overlay" />

      {/* 🧩 APP CONTENT */}
      <div className="app-content">
        {!hideTopbar && <Topbar onSearch={setSearchQuery} />}
        <Outlet context={{ searchQuery }} />
      </div>
    </div>
  );
}

export default App;

import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Topbar from "./components/Topbar.jsx";
import "./App.css";

const backgrounds = [
  "#f5efe3",
  "#f3ead8",
  "#f2f6f1",
  "#e6efe9",
  "#f6f0f8",
  "#ede4f3"
];

function App() {
  const location = useLocation();
  const [bgIndex, setBgIndex] = useState(0);

  /* 🔍 GLOBAL SEARCH STATE */
  const [searchQuery, setSearchQuery] = useState("");

  const hideTopbar =
    ["/login", "/signup", "/forgot", "/otp-verify", "/profile-details", "/success"]
      .includes(location.pathname);

  /* 🎨 Background animation */
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  /* 🔄 RESET SEARCH ON PAGE CHANGE */
  useEffect(() => {
    setSearchQuery("");
  }, [location.pathname]);

  return (
    <div
      className="app-root"
      style={{ background: backgrounds[bgIndex] }}
    >
      {!hideTopbar && (
        <Topbar onSearch={setSearchQuery} />
      )}

      <Outlet context={{ searchQuery }} />
    </div>
  );
}

export default App;

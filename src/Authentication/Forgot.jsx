import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Forgot.css";

import img1 from "../assets/image-1.png";
import img2 from "../assets/image-2.png";
import img3 from "../assets/image-3.png";
import img4 from "../assets/image-4.png";
import img5 from "../assets/image-5.png";

const images = [img1, img2, img3, img4, img5];

// ✅ Email validation
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // image slider
  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => {
        setIndex(nextIndex);
        setNextIndex((nextIndex + 1) % images.length);
        setAnimate(false);
      }, 350);
    }, 6000);

    return () => clearInterval(interval);
  }, [nextIndex]);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const res = await fetch(
        "https://snap-wall-backend.vercel.app/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess("Password reset link sent to your email");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Failed to send reset link");
    }
  };

  return (
    <div className="login-wrapper">
      {/* LEFT IMAGE */}
      <div className="login-image">
        <img
          src={images[index]}
          className={`slide-image current ${animate ? "slide-out" : ""}`}
          alt=""
        />
        <img
          src={images[nextIndex]}
          className={`slide-image next ${animate ? "slide-in" : ""}`}
          alt=""
        />
      </div>

      {/* RIGHT FORM */}
      <div className="login-form">
        <h1 className="hero-title">Forgot Password</h1>

        <p className="hero-subtitle">
          Enter your email to reset your password
        </p>

        <input
          type="email"
          placeholder="Enter email"
          className={`input-box ${
            error && !isValidEmail(email) ? "input-error" : ""
          }`}
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
        />

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <button
          className="verify-btn"
          onClick={handleSubmit}
          disabled={!email || !isValidEmail(email)}
        >
          Send Link
        </button>

        <p className="signup-text">
          Remembered your password?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

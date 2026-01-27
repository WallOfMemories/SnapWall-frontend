import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

import img1 from "../assets/image-1.png";
import img2 from "../assets/image-2.png";
import img3 from "../assets/image-3.png";
import img4 from "../assets/image-4.png";
import img5 from "../assets/image-5.png";

const images = [img1, img2, img3, img4, img5];

// Email validation
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Password validation
const validatePassword = (value) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/.test(
    value
  );

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Image slider
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

  const handleSignup = async () => {
    if (loading) return;

    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must include uppercase, lowercase, number & special character"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://snap-wall-backend.vercel.app/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("OTP send failed");

      // Store temporarily for OTP step
      localStorage.setItem("signupEmail", email.toLowerCase());
      localStorage.setItem("signupPassword", password);

      navigate("/otp-verify");
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    email &&
    password &&
    confirmPassword &&
    isValidEmail(email) &&
    validatePassword(password) &&
    password === confirmPassword;

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
        <h1 className="hero-title">
          Capture. Share.
          <br />
          Enjoy.
        </h1>

        <p className="hero-subtitle">
          Join thousands of people sharing their
          <br />
          best moments with the world
        </p>

        <h2 className="login-title">Signup</h2>
        <p className="login-desc">Create your account to continue</p>

        <input
          type="email"
          placeholder="Enter email"
          className="input-box"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Enter password"
          className="input-box"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Confirm password"
          className="input-box"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />

        {error && <p className="error-text">{error}</p>}

        <button
          className="verify-btn"
          onClick={handleSignup}
          disabled={!isFormValid || loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <p className="signup-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;

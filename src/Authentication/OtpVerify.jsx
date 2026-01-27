import React, { useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./OtpVerify.css";

import img1 from "../assets/image-1.png";
import img2 from "../assets/image-2.png";
import img3 from "../assets/image-3.png";
import img4 from "../assets/image-4.png";
import img5 from "../assets/image-5.png";

const images = [img1, img2, img3, img4, img5];

const OtpVerify = () => {
  const navigate = useNavigate();

  // slider
  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [animate, setAnimate] = useState(false);

  // otp
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);

  // ui states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleChange = (value, idx) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);

    if (value && idx < 5) {
      inputsRef.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1].focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter complete OTP");
      return;
    }

    if (loading) return;

    setLoading(true);
    setError("");

    const email = localStorage.getItem("signupEmail");
    const password = localStorage.getItem("signupPassword");

    try {
      // 1️⃣ Verify OTP (backend)
      const res = await fetch(
        "https://snap-wall-backend.vercel.app/api/otp/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: code }),
        }
      );

      if (!res.ok) throw new Error("Invalid OTP");

      // 2️⃣ Create OR sign in Firebase user
      let userCred;
      try {
        userCred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } catch (err) {
        if (err.code === "auth/email-already-in-use") {
          userCred = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
        } else {
          throw err;
        }
      }

      const token = await userCred.user.getIdToken();

      localStorage.setItem("firebaseUid", userCred.user.uid);
      localStorage.setItem("firebaseToken", token);

      navigate("/profile-details");
    } catch (err) {
      console.error(err);
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const isOtpComplete = otp.every((d) => d !== "");

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

      {/* RIGHT CONTENT */}
      <div className="otp-wrapper">
        <h2 className="otp-title">Enter OTP</h2>
        <p className="otp-subtitle">
          Please enter the OTP sent to your email
        </p>

        <div className="otp-inputs">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="otp-box"
              disabled={loading}
            />
          ))}
        </div>

        {error && <p className="error-text">{error}</p>}

        <button
          className="verify-btn"
          onClick={handleVerify}
          disabled={!isOtpComplete || loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
};

export default OtpVerify;

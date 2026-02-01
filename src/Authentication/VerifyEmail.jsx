import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");

  const checkVerification = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setChecking(true);
    await user.reload(); // refresh user data

    if (user.emailVerified) {
      navigate("/profile-details");
    } else {
      setMessage("Email not verified yet");
    }

    setChecking(false);
  };

  const resendEmail = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await sendEmailVerification(user);
    setMessage("Verification email sent again");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Verify your email</h2>
      <p>Please check your inbox and click the verification link.</p>

      <button onClick={checkVerification} disabled={checking}>
        I have verified
      </button>

      <br /><br />

      <button onClick={resendEmail}>
        Resend Email
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default VerifyEmail;

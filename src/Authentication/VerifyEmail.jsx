import React, { useEffect, useState } from "react";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");

  // 🔄 Auto-check when page loads
  useEffect(() => {
    checkVerification();
  }, []);

  // ✅ Function to check verification status
  const checkVerification = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      navigate("/signup");
      return;
    }

    setChecking(true);
    await user.reload(); // ⭐ refresh from Firebase

    if (user.emailVerified) {
      navigate("/profile-details");
    } else {
      setMessage("Email not verified yet");
    }

    setChecking(false);
  };

  // 📩 Resend verification email
  const resendEmail = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    await sendEmailVerification(user);
    setMessage("Verification email sent again. Check spam if not in inbox.");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Verify your email</h2>
      <p>Please check your inbox and click the verification link.</p>

      <button onClick={checkVerification} disabled={checking}>
        {checking ? "Checking..." : "I have verified"}
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

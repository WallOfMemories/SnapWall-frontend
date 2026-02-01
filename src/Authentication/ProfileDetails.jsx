import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileDetails.css";
import { getAuth } from "firebase/auth";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

import img1 from "../assets/image-1.png";
import img2 from "../assets/image-2.png";
import img3 from "../assets/image-3.png";
import img4 from "../assets/image-4.png";
import img5 from "../assets/image-5.png";

const images = [img1, img2, img3, img4, img5];

const ProfileDetails = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [instagram, setInstagram] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // slider
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

    useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) {
      navigate("/signup");
      return;
    }

    if (!user.emailVerified) {
      navigate("/verify-email");
    }
  }, []);


  // IMAGE UPLOAD
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    setError("");
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // SAVE PROFILE
  const handleSave = async () => {
    setError("");

    if (!imageFile)
      return setError("Profile image is required");

    if (!username.trim())
      return setError("Username is required");

    if (!instagram.trim())
      return setError("Instagram ID is required");

    try {
      setLoading(true);

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        navigate("/signup");
        return;
      }

      const token = await user.getIdToken();
      const uid = user.uid;
      const email = user.email;

      // Upload image
      const imageRef = ref(storage, `profiles/${uid}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      // Backend call
      const res = await fetch(
        "https://snap-wall-backend.vercel.app/api/auth/create-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            uid,
            email,
            username,
            instagram,
            imageUrl,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      navigate("/success");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    username.trim() && instagram.trim() && imageFile && !loading;

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
      <div className="profile-wrapper">
        <h2 className="profile-title">Profile Details</h2>
        <p className="profile-subtitle">
          Enter your details to continue
        </p>

        <div className="avatar-section">
          <div className="avatar-circle">
            {preview ? <img src={preview} alt="avatar" /> : <span>+</span>}
          </div>

          <label className="upload-btn">
            Upload Image *
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </label>
        </div>

        <input
          type="text"
          placeholder="Create SnapWall Username *"
          className="input-box"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Instagram Id *"
          className="input-box"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
        />

        {error && <p className="error-text">{error}</p>}

        <button
          className="verify-btn"
          onClick={handleSave}
          disabled={!isFormValid}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default ProfileDetails;

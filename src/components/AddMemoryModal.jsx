import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Country, State, City } from "country-state-city";
import { getAuth } from "firebase/auth";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./AddMemoryModal.css";
import ShareMemoryModal from "./ShareMemoryModal.jsx";

const AddMemoryModal = ({ onClose }) => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("form");
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");
  const [shareLink, setShareLink] = useState("");


  const handleSubmit = async () => {
    if (!image || !caption || !countryCode || !stateCode || !city) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in");
        setLoading(false);
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert("User profile not found");
        setLoading(false);
        return;
      }

      const userData = userSnap.data();
      const username = userData.username || "Anonymous";
      const profileImage =
        userData.imageUrl || "https://ui-avatars.com/api/?name=User";

      // Upload image
      const imageRef = ref(storage, `memories/${user.uid}/${Date.now()}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      setUploadedImage(imageUrl);

      const now = new Date();
      const postedDate = `${String(now.getDate()).padStart(2, "0")}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${now.getFullYear()}`;

      const docRef = await addDoc(collection(db, "memories"), {
  imageUrl,
  caption,
  country: Country.getCountryByCode(countryCode)?.name,
  state: State.getStateByCodeAndCountry(stateCode, countryCode)?.name,
  city,
  userId: user.uid,
  username,
  profileImage,
  createdAt: serverTimestamp(),
  postedDate,
});

// 🔥 Link points to HOME with memory id
const shareUrl = `${window.location.origin}/?memory=${docRef.id}`;

setUploadedImage(imageUrl);
setShareLink(shareUrl);
setStep("share");

    } catch (err) {
      console.error("POST ERROR:", err);
      alert("Failed to post memory. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {step === "form" && (
        <div className="memory-overlay">
          <div className="memory-modal-ui">
            <FaTimes
              className="close-icon"
              onClick={!loading ? onClose : undefined}
              style={{
                opacity: loading ? 0.5 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            />

            <h2>Add Memory</h2>

            <label className="upload-box">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="image-preview"
                />
              ) : (
                <>
                  <div className="upload-icon">☁️</div>
                  <p>Upload the image</p>
                </>
              )}
            </label>

            <textarea
              className="gradient-input caption-box"
              placeholder="Caption"
              maxLength={40}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <select
              className="gradient-input"
              value={countryCode}
              onChange={(e) => {
                setCountryCode(e.target.value);
                setStateCode("");
                setCity("");
              }}
            >
              <option value="">Country</option>
              {Country.getAllCountries().map((c) => (
                <option key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              className="gradient-input"
              disabled={!countryCode}
              value={stateCode}
              onChange={(e) => {
                setStateCode(e.target.value);
                setCity("");
              }}
            >
              <option value="">State</option>
              {State.getStatesOfCountry(countryCode).map((s) => (
                <option key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              className="gradient-input"
              disabled={!stateCode}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">City</option>
              {City.getCitiesOfState(countryCode, stateCode).map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <button className="post-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      )}

      {step === "share" && (
        <ShareMemoryModal
  imageUrl={uploadedImage}
  shareLink={shareLink}
  onClose={() => {
    onClose();
    navigate("/");
  }}
/>

      )}
    </>
  );
};

export default AddMemoryModal;

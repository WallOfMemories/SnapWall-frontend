import {
  FaInstagram,
  FaWhatsapp,
  FaTelegramPlane,
  FaFacebookF,
  FaSnapchatGhost,
} from "react-icons/fa";
import "./ShareMemoryModal.css";

const ShareMemoryModal = ({ imageUrl, shareLink, onClose }) => {
  const text = encodeURIComponent("Check out my memory on SnapWall!");
  const url = encodeURIComponent(shareLink);

  return (
    <div className="share-overlay">
      <div className="share-container">
        <h2>Share Your Memory</h2>
        <p className="share-success-text">Memory posted successfully</p>

        <div className="share-preview-wrapper">
          <img src={imageUrl} alt="memory preview" className="share-preview-image" />
        </div>

        <p className="share-with-text">Share it with</p>

        <div className="share-icons-row">
          <a className="share-icon whatsapp" href={`https://wa.me/?text=${text}%20${url}`} target="_blank"><FaWhatsapp /></a>
          <a className="share-icon telegram" href={`https://t.me/share/url?url=${url}&text=${text}`} target="_blank"><FaTelegramPlane /></a>
          <a className="share-icon facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target="_blank"><FaFacebookF /></a>
          <a className="share-icon snapchat" href={shareLink} target="_blank"><FaSnapchatGhost /></a>
          <a className="share-icon instagram" href={shareLink} target="_blank"><FaInstagram /></a>
        </div>

        <button className="share-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};


export default ShareMemoryModal;

import { FaMapMarkerAlt } from "react-icons/fa";
import { useMemo } from "react";
import "./Card.css";

const Card = ({ memory, isHighlighted }) => {
  // Stable organic randomness
  const rotation = useMemo(() => Math.random() * 8 - 4, []);
  const offsetY = useMemo(() => Math.random() * 24 - 12, []);

  return (
    <div
      className={`polaroid-card ${isHighlighted ? "highlight" : ""}`}
      style={{
        "--rotate": `${rotation}deg`,
        "--offsetY": `${offsetY}px`
      }}
    >
      {/* PIN */}
      <div className="pin-dot" />

      {/* IMAGE */}
      <div className="polaroid-image">
        <img src={memory.imageUrl} alt="memory" />
      </div>

      {/* CONTENT */}
      <div className="polaroid-content">
        <div className="user-row">
          <img
            className="avatar"
            src={memory.profileImage}
            alt={memory.username}
          />
          <span className="username">
            {memory.username || "Anonymous"}
          </span>
        </div>

        <p className="caption">“{memory.caption}”</p>

        <div className="location-chip">
          <FaMapMarkerAlt />
          {memory.city}, {memory.country}
        </div>

        <div className="date-text">
          Pinned on {memory.postedDate}
        </div>
      </div>
    </div>
  );
};

export default Card;

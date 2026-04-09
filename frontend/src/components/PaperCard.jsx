import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaperCard = ({ paper, onFavoriteToggle }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(paper.isFavorite || false);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    if (onFavoriteToggle) {
      await onFavoriteToggle(paper._id, !isFavorite);
    }
  };

  const handleViewClick = () => {
    navigate(`/papers/${paper._id}`);
  };

  const topicLabel =
    paper.topic?.topicName || paper.topic?.name || paper.topic || "No topic";
  const yearLabel = paper.publicationYear || paper.year || "N/A";

  return (
    <div className="paper-card">
      <div className="paper-card-header">
        <h3 className="paper-title">{paper.title}</h3>
        <div className="paper-meta">
          <span className="paper-authors">By: {paper.authors || "Unknown"}</span>
          <span>📅 {yearLabel}</span>
        </div>
        {paper.topic && <div className="paper-badge">{topicLabel}</div>}
      </div>
      <div className="paper-card-footer">
        <button
          className={`btn-favorite ${isFavorite ? "active" : ""}`}
          onClick={handleFavoriteClick}
        >
          {isFavorite ? "❤️ Favorited" : "🤍 Favorite"}
        </button>
        <button className="btn-view" onClick={handleViewClick}>
          👁️ View
        </button>
      </div>
    </div>
  );
};

export default PaperCard;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaperCard = ({ paper, onFavoriteToggle, onDelete }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(paper.isFavorite || false);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    if (onFavoriteToggle) {
      await onFavoriteToggle(paper._id, !isFavorite);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(paper._id);
  };

  const handleViewClick = () => {
    navigate(`/papers/${paper._id}`);
  };

  const authorsLabel = Array.isArray(paper.authors)
    ? paper.authors.join(", ")
    : paper.authors || "Unknown";

  const topicLabel =
    paper.topics?.[0]?.topicName ||
    paper.topics?.[0]?.name ||
    paper.topic?.topicName ||
    paper.topic?.name ||
    paper.topic ||
    "No topic";

  const yearLabel = paper.publicationYear || "N/A";

  return (
    <div className="paper-card">
      <div className="paper-card-header">
        <h3 className="paper-title">{paper.title}</h3>

        <div className="paper-meta">
          <span>By: {authorsLabel}</span>
          <span>📅 {yearLabel}</span>
        </div>

        {paper.topic && <div className="paper-badge">{topicLabel}</div>}
      </div>

      <div className="paper-card-footer">
        <button className={`btn btn-secondary btn-favorite ${isFavorite ? "active" : ""}`} onClick={handleFavoriteClick}>
          {isFavorite ? "❤️ Favorited" : "🤍 Favorite"}
        </button>

        <button className="btn btn-primary btn-view" onClick={handleViewClick}>
          👁️ View
        </button>

        {onDelete && (
          <button className="btn btn-danger" onClick={handleDeleteClick}>
            🗑 Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default PaperCard;
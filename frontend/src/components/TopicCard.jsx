import React, { useState } from "react";

const TopicCard = ({ topic, paperCount, onDelete, onClick }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const displayName = topic.topicName || topic.name || "Untitled Topic";

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete topic "${displayName}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(topic._id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div
      className="topic-card"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="topic-header">
        <h3 className="topic-name">{displayName}</h3>
        <span className="topic-count">{paperCount || 0} papers</span>
      </div>
      <button
        className="btn-delete-topic"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "🗑️ Delete"}
      </button>
    </div>
  );
};

export default TopicCard;

import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import PaperCard from "../components/PaperCard";
import { getPapers, toggleFavorite } from "../api/services/paperService";

const Favorites = () => {
  const [papers, setPapers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await getPapers();
      const allPapers = response.data || [];
      const favoritePapers = allPapers.filter((p) => p.isFavorite);
      setFavorites(favoritePapers);
      setPapers(allPapers);
    } catch (err) {
      setError("Failed to load favorites");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteToggle = async (paperId, isFavorite) => {
    try {
      await toggleFavorite(paperId);
      setPapers(
        papers.map((p) =>
          p._id === paperId ? { ...p, isFavorite } : p
        )
      );
      setFavorites(
        favorites.filter((p) => {
          if (p._id === paperId && !isFavorite) {
            return false; // Remove from favorites
          }
          return true;
        })
      );
    } catch (err) {
      setError("Failed to update favorite");
    }
  };

  if (isLoading) {
    return (
      <Layout pageTitle="Favorites">
        <div className="loading">Loading favorites...</div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Favorites">
      <div className="dashboard-header">
        <h1>⭐ Favorite Papers</h1>
        <p>Your bookmarked research papers</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="papers-container">
        {favorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-text">
              No favorite papers yet. Add some to your favorites!
            </div>
          </div>
        ) : (
          <div className="papers-grid">
            {favorites.map((paper) => (
              <PaperCard
                key={paper._id}
                paper={paper}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Favorites;
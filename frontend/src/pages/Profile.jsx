import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getPapers } from "../api/services/paperService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [paperStats, setPaperStats] = useState({
    total: 0,
    favorites: 0,
    recentPapers: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (isLoading || !user) {
    return (
      <Layout pageTitle="Profile">
        <div className="loading">Loading profile...</div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Profile">
      <div className="profile-page profile-page-minimal">
        <div className="profile-actions profile-actions-center">
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

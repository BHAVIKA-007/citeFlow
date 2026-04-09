import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";
import { getDashboardStats } from "../api/services/dashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPapers: 0,
    totalTopics: 0,
    totalNotes: 0,
    favoritePapers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await getDashboardStats();
        setStats(response.data || stats);
      } catch (err) {
        setError("Failed to load dashboard stats");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <Layout pageTitle="Dashboard">
        <div className="loading">Loading dashboard...</div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <p>Welcome to Your Research Paper Management System</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        <DashboardCard
          icon="📚"
          label="Total Papers"
          value={stats.totalPapers || 0}
          trend="papers in your library"
        />
        <DashboardCard
          icon="🏷️"
          label="Research Topics"
          value={stats.totalTopics || 0}
          trend="topics created"
        />
        <DashboardCard
          icon="⭐"
          label="Favorite Papers"
          value={stats.favoritePapers || 0}
          trend="papers bookmarked"
        />
        <DashboardCard
          icon="📝"
          label="Total Notes"
          value={stats.totalNotes || 0}
          trend="notes written"
        />
      </div>

      <div className="chart-section">
        <h3>📈 Quick Stats</h3>
        <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
          <p>Start by creating topics, adding papers, and organizing your research!</p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
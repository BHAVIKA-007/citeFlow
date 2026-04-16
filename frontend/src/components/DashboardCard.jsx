import React from "react";

const DashboardCard = ({ icon, label, value, trend, onClick }) => {
  return (
    <div
      className="stat-card"
      onClick={onClick}
      style={{ cursor: "pointer" }}   // 👈 added
    >
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value || 0}</div>

      {trend && (
        <div style={{ fontSize: "12px", color: "#999", marginTop: "10px" }}>
          {trend}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
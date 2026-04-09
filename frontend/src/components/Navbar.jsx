import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ pageTitle, user }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h2 className="navbar-title">{pageTitle || "Dashboard"}</h2>
      <div className="navbar-actions">
        <div
          className="navbar-user"
          onClick={() => setShowDropdown(!showDropdown)}
          style={{ cursor: "pointer", position: "relative" }}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt={user.username} className="navbar-avatar" />
          ) : (
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#ddd",
              }}
            />
          )}
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            {user?.username || "User"}
          </span>
        </div>
        {showDropdown && (
          <div
            style={{
              position: "absolute",
              top: "70px",
              right: "40px",
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "8px",
              minWidth: "200px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 1000,
            }}
          >
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "12px 20px",
                border: "none",
                background: "none",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "14px",
                color: "#333",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#f5f5f5")}
              onMouseLeave={(e) => (e.target.style.background = "none")}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
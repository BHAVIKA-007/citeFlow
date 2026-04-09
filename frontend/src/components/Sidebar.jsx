import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/topics", label: "Topics", icon: "🏷️" },
    { path: "/papers", label: "Papers", icon: "📄" },
    { path: "/favorites", label: "Favorites", icon: "⭐" },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setActivePath(path);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>📚</span>
        <span style={{ marginLeft: "8px" }}>Citation</span>
      </div>

      <nav className="sidebar-nav">
        {navLinks.map((link) => (
          <li key={link.path}>
            <a
              onClick={() => handleNavClick(link.path)}
              className={activePath.includes(link.path) ? "active" : ""}
              style={{ cursor: "pointer" }}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </a>
          </li>
        ))}
      </nav>

      <div className="sidebar-divider"></div>

      <div className="sidebar-footer">
        <div className="user-profile">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.username} className="user-avatar" />
          ) : (
            <div
              className="user-avatar"
              style={{
                background: "#ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              👤
            </div>
          )}
          <div className="user-name">{user?.username || "User"}</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
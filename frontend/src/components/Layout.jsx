import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children, pageTitle }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="layout">
      <Sidebar user={user} />
      <div style={{ flex: 1 }}>
        <Navbar pageTitle={pageTitle} user={user} />
        <div className="main-content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
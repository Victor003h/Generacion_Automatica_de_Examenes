import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaClipboardList, FaBookOpen, FaChartBar } from "react-icons/fa"; // Importamos íconos de react-icons
import "../styles/Dashboard.css";
import "../styles/DashboardContent/Dropdown.css";
import LogoutButton from "./DashboardContent/LogoutButton";

const StudentDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setName(storedName);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard">
      <nav className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <ul>
          <li className="profile">
            <span>Bienvenido, {name}</span>
          </li>
          <li>
            <Link to="student-exam">
              <FaClipboardList className="icon" />
              <span>Exámenes</span>
            </Link>
          </li>
          <li>
            <Link to="student-subjects">
              <FaBookOpen className="icon" />
              <span>Asignaturas</span>
            </Link>
          </li>
          <li>
            <Link to="statistics">
              <FaChartBar className="icon" />
              <span>Estadísticas</span>
            </Link>
          </li>
          <LogoutButton />
        </ul>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? "❮" : "❯"}
        </button>
      </nav>
      <main className="main-content">
        <section className="content-section">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;

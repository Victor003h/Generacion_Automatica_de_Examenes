import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  FaClipboardList,
  FaUserGraduate,
  FaBookOpen,
  FaChartBar,
  FaQuestionCircle,
  FaChartPie,
} from "react-icons/fa";
import "../styles/Dashboard.css";

const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [name, setName] = useState("");
  //const [role, setRole] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    //const storedRole = localStorage.getItem("role");
    if (storedName) setName(storedName);
    //if (storedRole) setRole(storedRole);
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
            <Link to="exams">
              <FaClipboardList className="icon" />
              <span>Gestionar Exámenes</span>
            </Link>
          </li>
          <li>
            <Link to="students">
              <FaUserGraduate className="icon" />
              <span>Estudiantes</span>
            </Link>
          </li>
          <li>
            <Link to="teachers">
              <FaChartPie className="icon" />
              <span>Profesores</span>
            </Link>
          </li>
          <li>
            <Link to="subjects">
              <FaBookOpen className="icon" />
              <span>Asignaturas</span>
            </Link>
          </li>
          <li>
            <Link to="questions">
              <FaQuestionCircle className="icon" />
              <span>Banco de Preguntas</span>
            </Link>
          </li>
          <li>
            <Link to="statistics">
              <FaChartBar className="icon" />
              <span>Estadísticas</span>
            </Link>
          </li>
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

export default AdminDashboard;

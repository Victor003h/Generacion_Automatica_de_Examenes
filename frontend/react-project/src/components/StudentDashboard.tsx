// Importa las librerías necesarias de React y otros módulos
import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaClipboardList, FaBookOpen, FaChartBar } from "react-icons/fa"; // Importa íconos de react-icons
import "../styles/Dashboard.css";
import "../styles/DashboardContent/Dropdown.css";
import LogoutButton from "./DashboardContent/Common/LogoutButton";

// Define el componente funcional del dashboard del estudiante
const StudentDashboard: React.FC = () => {
  // Define los estados locales para el sidebar y el nombre del usuario
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [name, setName] = useState("");

  // Usa useEffect para obtener el nombre del usuario almacenado en localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setName(storedName);
  }, []);

  // Función para alternar la visibilidad del sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Renderiza el dashboard del estudiante
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
            <Link to="exam-results">
              <span>Resultados de Exámenes</span>
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

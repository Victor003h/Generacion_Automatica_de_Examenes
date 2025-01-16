import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import "../styles/Dashboard.css";
import "../styles/DashboardContent/Dropdown.css";

const DashboardStudent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    if (storedName) setName(storedName);
    if (storedRole) setRole(storedRole);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleSignOut = () => {
    alert("Cerrar Sesión");
  };

  return (
    <div className="dashboard">
      <nav className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="profile">
          <span>Bienvenido, {name}</span>
        </div>
        <ul>
          <li>
            <Link to="exams">Gestionar Exámenes</Link>
          </li>
          <li>
            <Link to={role === "teacher" ? "students" : "grades"}>
              {role === "teacher" ? "Estudiantes" : "Calificaciones"}
            </Link>
          </li>
          <li>
            <Link to={role === "teacher" ? "questions" : ""}>
              {role === "teacher" ? "Banco de Preguntas" : ""}
            </Link>
          </li>
          <li>
            <Link to="subjects">Asignaturas</Link>
          </li>
          <li>
            <Link to="statistics">Estadísticas</Link>
          </li>
          <li className="dropdown">
            {" "}
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              {" "}
              Mi Cuenta{" "}
              <span
                className={`arrow ${isDropdownOpen ? "up" : "down"}`}
              ></span>{" "}
            </button>{" "}
            <div className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
              {" "}
              <Link to="manage-account-teacher">Gestionar Cuenta</Link>{" "}
              <button onClick={handleSignOut} className="dropdown-item">
                Cerrar Sesión
              </button>{" "}
              <Link to="personalize">Personalizar</Link>{" "}
            </div>{" "}
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

export default DashboardStudent;

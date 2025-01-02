import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import "../styles/Dashboard.css";

const DashboardStudent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    if (storedName) setName(storedName);
    if (storedRole) setRole(storedRole);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <div className="dashboard">
      <nav className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
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
            <Link to="subjects">Asignaturas</Link>
          </li>
          <li>
            <Link to="statistics">Estadísticas</Link>
          </li>
          <li className="dropdown">
            <a
              href="#cuenta"
              className="dropdown-toggle"
              onClick={(e) => {
                e.preventDefault();
                toggleProfileMenu();
              }}
            >
              Mi Cuenta
              <span
                className={`arrow ${isProfileMenuOpen ? "up" : "down"}`}
              ></span>
            </a>
            {isProfileMenuOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="manage-account-teacher">Gestionar Cuenta</Link>
                </li>
                <li>
                  <a href="#" onClick={() => alert("Cerrar Sesión")}>
                    Cerrar Sesión
                  </a>
                </li>
              </ul>
            )}
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

import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

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
          <img src="/profile-picture.jpg" alt="Perfil" />
          <span>Bienvenido, Profesor</span>
        </div>
        <ul>
          <li>
            <Link to="exams">
              <i className="icon icon-exam"></i>Gestionar Exámenes
            </Link>
          </li>
          <li>
            <Link to="grades">
              <i className="icon icon-grades"></i>Calificaciones
            </Link>
          </li>
          <li>
            <Link to="statistics">
              <i className="icon icon-stats"></i>Estadísticas
            </Link>
          </li>
          <li className="dropdown">
            {" "}
            <a
              href="#cuenta"
              className="dropdown-toggle"
              onClick={(e) => {
                e.preventDefault();
                toggleProfileMenu();
              }}
            >
              {" "}
              <i className="icon icon-account"></i>Mi Cuenta{" "}
              <span
                className={`arrow ${isProfileMenuOpen ? "up" : "down"}`}
              ></span>{" "}
            </a>{" "}
            {isProfileMenuOpen && (
              <ul className="dropdown-menu">
                {" "}
                <li>
                  <Link to="manage-account-teacher">Gestionar Cuenta</Link>
                </li>{" "}
                <li>
                  <a href="#" onClick={() => alert("Cerrar Sesión")}>
                    Cerrar Sesión
                  </a>
                </li>{" "}
              </ul>
            )}{" "}
          </li>
        </ul>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? "❮" : "❯"}
        </button>
      </nav>
      <main className="main-content">
        {" "}
        <header className="top-bar">
          {" "}
          <h1>Bienvenido al Dashboard</h1>{" "}
        </header>{" "}
        <section className="content-section">
          {" "}
          <Outlet />{" "}
        </section>{" "}
      </main>
    </div>
  );
};

export default Dashboard;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleGestionarCuenta = () => {
    if (role === "teacher") {
      navigate("/manage-account-teacher");
    } else if (role === "student") {
      navigate("/manage-account-student");
    }
  };

  return (
    <div className="dashboard">
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? "❮" : "❯"}
        </button>
        <nav className={`menu ${isSidebarOpen ? "visible" : ""}`}>
          <ul>
            <li className="profile-item">
              <div className="profile-toggle" onClick={toggleProfileMenu}>
                <span>Mi Perfil</span>
                <span
                  className={`arrow ${isProfileMenuOpen ? "up" : "down"}`}
                ></span>
              </div>
              {isProfileMenuOpen && (
                <ul className="profile-submenu">
                  <li>
                    <button onClick={handleGestionarCuenta}>
                      Gestionar Cuenta
                    </button>
                  </li>
                  <li>
                    <button onClick={() => alert("Eliminar Cuenta")}>
                      Eliminar Cuenta
                    </button>
                  </li>
                </ul>
              )}
            </li>
            {role === "teacher" && (
              <>
                <li>
                  <a href="/exams">Gestionar Exámenes</a>
                </li>
                <li>
                  <a href="/grades">Calificaciones</a>
                </li>
              </>
            )}
            {role === "student" && (
              <>
                <li>
                  <a href="/exams">Ver Exámenes</a>
                </li>
                <li>
                  <a href="/results">Mis Resultados</a>
                </li>
              </>
            )}
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <h1>Bienvenido al Dashboard</h1>
      </main>
    </div>
  );
};

export default Dashboard;

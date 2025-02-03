import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  FaClipboardList,
  FaUserGraduate,
  FaBookOpen,
  FaChartBar,
  FaQuestionCircle,
  FaCheck,
  FaCogs,
} from "react-icons/fa"; // Importamos íconos de react-icons
import "../styles/Dashboard.css";
import "../styles/DashboardContent/Dropdown.css";
import LogoutButton from "./DashboardContent/Common/LogoutButton";
import useFetchHeadOfSubjects from "../hooks/useFetchHeadOfSubjects";

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? parseInt(storedUserId) : null;

  const { subjects, loading, error } = useFetchHeadOfSubjects(Number(userId));

  // Cargar el nombre y rol del usuario desde el almacenamiento local
  useEffect(() => {
    const storedName = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    if (storedName) setName(storedName);
    if (storedRole) setRole(storedRole);
  }, []);

  // Alternar la visibilidad de la barra lateral
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
            <Link to={role === "teacher" ? "students" : "grades"}>
              <FaUserGraduate className="icon" />
              <span>
                {role === "teacher" ? "Estudiantes" : "Calificaciones"}
              </span>
            </Link>
          </li>
          <li>
            <Link to={role === "teacher" ? "questions" : ""}>
              <FaQuestionCircle className="icon" />
              <span>{role === "teacher" ? "Banco de Preguntas" : ""}</span>
            </Link>
          </li>
          <li>
            <Link to="subjects">
              <FaBookOpen className="icon" />
              <span>Asignaturas</span>
            </Link>
          </li>
          {subjects.length > 0 && (
            <>
              <li>
                <Link to="validations">
                  <FaCheck className="icon" />
                  <span>Validar Exámenes</span>
                </Link>
              </li>
              <li>
                <Link to="define-exam-type">
                  <FaCogs className="icon" />
                  <span>Definir Tipo de Examen</span>
                </Link>
              </li>
            </>
          )}
          <li>
            <Link to="grade-exams">
              <span>Calificar Exámenes</span>
            </Link>
          </li>
          <li>
            <Link to="regrade-request">
              <span>Recalificar Exámenes</span>
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
          {loading && <div>Cargando asignaturas...</div>}
          {error && <div>{error}</div>}
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

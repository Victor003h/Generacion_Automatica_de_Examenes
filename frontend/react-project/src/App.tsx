import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import RegisterProfessor from "./components/RegisterProfessor";
import RegisterStudent from "./components/RegisterStudent";
import Dashboard from "./components/Dashboard";
import "./styles/App.css";
import Exams from "./components/DashboardContent/Exams";
import Grades from "./components/DashboardContent/Grades";
import Statistics from "./components/DashboardContent/Statistics";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/professor" element={<RegisterProfessor />} />
        <Route path="/register/student" element={<RegisterStudent />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="exams" element={<Exams />} />
          <Route path="grades" element={<Grades />} />
          <Route path="statistics" element={<Statistics />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

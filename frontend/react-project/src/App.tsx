import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register_Professor from "./components/Register_Professor";
import Register_Student from "./components/Register_Student";
import Dashboard from "./components/Dashboard";
import "./styles/App.css";
import ManageAccountProfessor from "./components/ManageAccount/ManageAccountProfessor";
import ManageAccountStudent from "./components/ManageAccount/ManageAccountStudent";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/professor" element={<Register_Professor />} />
        <Route path="/register/student" element={<Register_Student />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/manage-account-teacher"
          element={<ManageAccountProfessor />}
        />{" "}
        <Route
          path="/manage-account-student"
          element={<ManageAccountStudent />}
        />
      </Routes>
    </Router>
  );
};

export default App;

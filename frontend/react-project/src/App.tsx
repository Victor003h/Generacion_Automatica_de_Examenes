import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register_Professor from "./components/Register_Professor";
import Register_Student from "./components/Register_Student";
import "./styles/App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/professor" element={<Register_Professor />} />
        <Route path="/register/student" element={<Register_Student />} />
      </Routes>
    </Router>
  );
};

export default App;

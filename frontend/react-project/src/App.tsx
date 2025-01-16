import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import RegisterProfessor from "./components/RegisterProfessor";
import RegisterStudent from "./components/RegisterStudent";
import Dashboard from "./components/Dashboard";
import "./styles/App.css";
import Exams from "./components/DashboardContent/Exams";
import GradesList from "./components/DashboardContent/GradesList";
import Subjects from "./components/DashboardContent/Subjects";
import Statistics from "./components/DashboardContent/Statistics";
import StudentsList from "./components/DashboardContent/StudentsList";
import CreateExam from "./components/DashboardContent/CreateExam";
import QuestionsList from "./components/DashboardContent/QuestionsList";
import AddQuestion from "./components/DashboardContent/AddQuestion";
import ExamDetails from "./components/DashboardContent/ExamDetails";

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
          <Route path="grades" element={<GradesList />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="students" element={<StudentsList />} />
          <Route path="questions" element={<QuestionsList />} />
        </Route>
        <Route path="create-exam" element={<CreateExam />} />
        <Route path="exam-details" element={<ExamDetails />} />
        <Route path="add-question" element={<AddQuestion />} />
      </Routes>
    </Router>
  );
};

export default App;

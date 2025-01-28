import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import RegisterProfessor from "./components/RegisterProfessor";
import RegisterStudent from "./components/RegisterStudent";
import Dashboard from "./components/Dashboard";
import "./styles/App.css";
import Exams from "./components/DashboardContent/Exams";
import SubjectList from "./components/DashboardContent/Subjects";
import Statistics from "./components/DashboardContent/Statistics";
import TeacherList from "./components/DashboardContent/TeacherList";
import StudentList from "./components/DashboardContent/StudentList";
import TopicsList from "./components/DashboardContent/TopicsList";
import CourseList from "./components/DashboardContent/CourseList";
import CreateExam from "./components/DashboardContent/CreateExam";
import QuestionsList from "./components/DashboardContent/QuestionsList";
import AddQuestion from "./components/DashboardContent/AddQuestion";
import ExamDetails from "./components/DashboardContent/ExamDetails";
import EditQuestion from "./components/DashboardContent/EditQuestion";
import AdminDashboard from "./components/AdminDashboard";
import AddTeacher from "./components/DashboardContent/AddTeacher";
import AddStudent from "./components/DashboardContent/AddStudent";
import AddSubject from "./components/DashboardContent/AddSubject";
import AddTopic from "./components/DashboardContent/AddTopic";
import AddCourse from "./components/DashboardContent/AddCourse";
import EditSubject from "./components/DashboardContent/EditSubject";
import EditStudent from "./components/DashboardContent/EditStudent";
import EditTeacher from "./components/DashboardContent/EditTeacher";
import EditTopic from "./components/DashboardContent/EditTopic";
import EditCourse from "./components/DashboardContent/EditCourse";
import StudentDashboard from "./components/StudentDashboard";

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
          <Route path="subjects" element={<SubjectList />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="students" element={<StudentList />} />
          <Route path="questions" element={<QuestionsList />} />
        </Route>
        <Route path="/student-dashboard/*" element={<StudentDashboard />}>
          {/*Estas son referencias a las opciones de profesor, temporales*/}
          <Route path="subjects" element={<SubjectList />} />
          <Route path="statistics" element={<Statistics />} />
        </Route>
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route path="exams" element={<Exams />} />
          <Route path="teachers" element={<TeacherList />} />
          <Route path="subjects" element={<SubjectList />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="students" element={<StudentList />} />
          <Route path="topics" element={<TopicsList />} />
          <Route path="questions" element={<QuestionsList />} />
          <Route path="courses" element={<CourseList />} />
          <Route path="add-teacher" element={<AddTeacher />} />
          <Route path="add-student" element={<AddStudent />} />
          <Route path="add-subject" element={<AddSubject />} />
          <Route path="add-topic" element={<AddTopic />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="edit-subject" element={<EditSubject />} />
          <Route path="edit-student" element={<EditStudent />} />
          <Route path="edit-teacher" element={<EditTeacher />} />
          <Route path="edit-topic" element={<EditTopic />} />
          <Route path="edit-course" element={<EditCourse />} />
        </Route>
        <Route path="create-exam" element={<CreateExam />} />
        <Route path="exam-details" element={<ExamDetails />} />
        <Route path="add-question" element={<AddQuestion />} />
        <Route path="/edit-question/" element={<EditQuestion />} />
      </Routes>
    </Router>
  );
};

export default App;

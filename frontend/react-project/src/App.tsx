import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import RegisterProfessor from "./components/RegisterProfessor";
import RegisterStudent from "./components/RegisterStudent";
import Dashboard from "./components/Dashboard";
import "./styles/App.css";
import ExamList from "./components/DashboardContent/ExamList";
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
import AddExam from "./components/DashboardContent/AddExam";
import AddExamQuestions from "./components/DashboardContent/AddExamQuestions";
import EditSubject from "./components/DashboardContent/EditSubject";
import EditStudent from "./components/DashboardContent/EditStudent";
import EditTeacher from "./components/DashboardContent/EditTeacher";
import EditTopic from "./components/DashboardContent/EditTopic";
import EditCourse from "./components/DashboardContent/EditCourse";
import EditExam from "./components/DashboardContent/EditExam";
import EditExamQuestions from "./components/DashboardContent/EditExamQuestions";
import StudentDashboard from "./components/StudentDashboard";
import ViewExam from "./components/DashboardContent/ViewExam";
import Validations from "./components/DashboardContent/Validations";
import ViewExamForValidation from "./components/DashboardContent/ViewExamForValidation";
import StudentSubjects from "./components/DashboardContent/StudentSubjects";
import StudentExam from "./components/DashboardContent/StudentExam";
import TakeExam from "./components/DashboardContent/TakeExam";
import PrivateRoute from "./components/PrivateRoute";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/professor" element={<RegisterProfessor />} />
        <Route path="/register/student" element={<RegisterStudent />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="exams" element={<ExamList />} />
          <Route path="subjects" element={<SubjectList />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="students" element={<StudentList />} />
          <Route path="questions" element={<QuestionsList />} />
          <Route path="add-exam" element={<AddExam />} />
          <Route path="add-question" element={<AddQuestion />} />
          <Route path="edit-exam" element={<EditExam />} />
          <Route path="edit-question" element={<EditQuestion />} />
          <Route path="add-exam-questions" element={<AddExamQuestions />} />
          <Route path="edit-exam-questions" element={<EditExamQuestions />} />
          <Route path="view-exam" element={<ViewExam />} />
          <Route path="validations" element={<Validations />} />
          <Route
            path="validate-exam-view"
            element={<ViewExamForValidation />}
          />
        </Route>
        <Route
          path="/student-dashboard"
          element={
            <PrivateRoute>
              <StudentDashboard />
            </PrivateRoute>
          }
        >
          {/*Estas son referencias a las opciones de profesor, temporales*/}
          <Route path="student-exam" element={<StudentExam />} />
          <Route path="view-exam" element={<ViewExam />} />
          <Route path="student-subjects" element={<StudentSubjects />} />
          <Route path="take-exam" element={<TakeExam />} />
          <Route path="statistics" element={<Statistics />} />
        </Route>
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        >
          <Route path="exams" element={<ExamList />} />
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
          <Route path="add-exam" element={<AddExam />} />
          <Route path="add-question" element={<AddQuestion />} />
          <Route path="edit-subject" element={<EditSubject />} />
          <Route path="edit-student" element={<EditStudent />} />
          <Route path="edit-teacher" element={<EditTeacher />} />
          <Route path="edit-topic" element={<EditTopic />} />
          <Route path="edit-course" element={<EditCourse />} />
          <Route path="edit-exam" element={<EditExam />} />
          <Route path="edit-question" element={<EditQuestion />} />
          <Route path="add-exam-questions" element={<AddExamQuestions />} />
          <Route path="edit-exam-questions" element={<EditExamQuestions />} />
          <Route path="view-exam" element={<ViewExam />} />
          <Route path="validations" element={<Validations />} />
          <Route
            path="validate-exam-view"
            element={<ViewExamForValidation />}
          />
        </Route>
        <Route
          path="create-exam"
          element={
            <PrivateRoute>
              <CreateExam />
            </PrivateRoute>
          }
        />
        <Route
          path="exam-details"
          element={
            <PrivateRoute>
              <ExamDetails />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

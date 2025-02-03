import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import RegisterProfessor from "./components/RegisterProfessor";
import RegisterStudent from "./components/RegisterStudent";
import Dashboard from "./components/Dashboard";
import "./styles/App.css";
import ExamList from "./components/DashboardContent/List/ExamList";
import SubjectList from "./components/DashboardContent/Subject/Subjects";
import Statistics from "./components/DashboardContent/Stadistics/Statistics";
import TeacherList from "./components/DashboardContent/List/TeacherList";
import StudentList from "./components/DashboardContent/List/StudentList";
import TopicsList from "./components/DashboardContent/List/TopicsList";
import CourseList from "./components/DashboardContent/List/CourseList";
import CreateExam from "./components/DashboardContent/Create/CreateExam";
import QuestionsList from "./components/DashboardContent/List/QuestionsList";
import AddQuestion from "./components/DashboardContent/Add/AddQuestion";
import ExamDetails from "./components/DashboardContent/Details/ExamDetails";
import EditQuestion from "./components/DashboardContent/Edit/EditQuestion";
import AdminDashboard from "./components/AdminDashboard";
import AddTeacher from "./components/DashboardContent/Add/AddTeacher";
import AddStudent from "./components/DashboardContent/Add/AddStudent";
import AddSubject from "./components/DashboardContent/Add/AddSubject";
import AddTopic from "./components/DashboardContent/Add/AddTopic";
import AddCourse from "./components/DashboardContent/Add/AddCourse";
import AddExam from "./components/DashboardContent/Add/AddExam";
import AddExamQuestions from "./components/DashboardContent/Add/AddExamQuestions";
import EditSubject from "./components/DashboardContent/Edit/EditSubject";
import EditStudent from "./components/DashboardContent/Edit/EditStudent";
import EditTeacher from "./components/DashboardContent/Edit/EditTeacher";
import EditTopic from "./components/DashboardContent/Edit/EditTopic";
import EditCourse from "./components/DashboardContent/Edit/EditCourse";
import EditExam from "./components/DashboardContent/Edit/EditExam";
import EditExamQuestions from "./components/DashboardContent/Edit/EditExamQuestions";
import StudentDashboard from "./components/StudentDashboard";
import ViewExam from "./components/DashboardContent/View/ViewExam";
import Validations from "./components/DashboardContent/Validation/Validations";
import ViewExamForValidation from "./components/DashboardContent/View/ViewExamForValidation";
import StudentSubjects from "./components/DashboardContent/Student/StudentSubjects";
import StudentExam from "./components/DashboardContent/Student/StudentExam";
import TakeExam from "./components/DashboardContent/Student/TakeExam";
import PrivateRoute from "./components/PrivateRoute";
import DefineExamType from "./components/DashboardContent/Validation/DefineExamType";
import GradeExams from "./components/DashboardContent/Grade/GradeExams";
import ViewExamsDone from "./components/DashboardContent/View/ViewExamsDone";
import SetGradeExam from "./components/DashboardContent/Grade/SetGradeExam";
import ExamResults from "./components/DashboardContent/Student/ExamResults";
import RegradeRequest from "./components/DashboardContent/ReGrade/RegradeRequest";
import SetExamRegrade from "./components/DashboardContent/ReGrade/SetExamRegrade";
import ExamListBySubject from "./components/DashboardContent/Stadistics/ExamListBySubject";
import TeacherAnalysis from "./components/DashboardContent/Stadistics/TeacherAnalysis";
import QuestionMostUsed from "./components/DashboardContent/Stadistics/QuestionMostUsed";
import QuestionUnused from "./components/DashboardContent/Stadistics/QuestionUnused";

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
          <Route path="define-exam-type" element={<DefineExamType />} />
          <Route path="grade-exams" element={<GradeExams />} />
          <Route path="view-exams-done" element={<ViewExamsDone />} />
          <Route path="set-grade-exam" element={<SetGradeExam />} />
          <Route path="regrade-request" element={<RegradeRequest />} />
          <Route path="set-exam-regrade" element={<SetExamRegrade />} />
          <Route path="exam-list-by-subject" element={<ExamListBySubject />} />
          <Route path="teacher-analysis" element={<TeacherAnalysis />} />
          <Route path="question-most-used" element={<QuestionMostUsed />} />
          <Route path="question-unused" element={<QuestionUnused />} />
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
          <Route path="exam-results" element={<ExamResults />} />
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
          <Route path="grade-exams" element={<GradeExams />} />
          <Route path="view-exams-done" element={<ViewExamsDone />} />
          <Route path="set-grade-exam" element={<SetGradeExam />} />
          <Route path="regrade-request" element={<RegradeRequest />} />
          <Route path="set-exam-regrade" element={<SetExamRegrade />} />
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

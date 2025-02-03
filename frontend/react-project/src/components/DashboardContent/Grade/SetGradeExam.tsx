import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/DashboardContent/SetGradeExam.css";
import { Exam, Question, ExamDone, Teacher } from "../../Interfaces";

interface QuestionResponse {
  id: number;
  question: number;
  response: string;
  note: number;
  exam_Done: number;
}

const SetGradeExam: React.FC = () => {
  const location = useLocation();
  const { examDoneId } = location.state;
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [totalGrade, setTotalGrade] = useState<number>(0);
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamDoneDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/exam_done/${examDoneId}/`
        );
        const examDone: ExamDone = response.data;
        const examResponse = await axios.get(
          `http://localhost:8000/api/exam/${examDone.exam}/`
        );
        setExam(examResponse.data);
      } catch (error) {
        console.error("Error fetching exam done details:", error);
      }
    };

    fetchExamDoneDetails();
  }, [examDoneId]);

  useEffect(() => {
    if (exam) {
      const fetchQuestions = async () => {
        try {
          const questionResponses = await axios.get(
            `http://localhost:8000/api/exam_done/questions/${examDoneId}/`
          );
          setResponses(questionResponses.data);
          const questionDetails: Question[] = await Promise.all(
            exam.questions.map(async (questionId) => {
              const response = await axios.get(
                `http://localhost:8000/api/question/${questionId}/`
              );
              return response.data;
            })
          );
          setQuestions(questionDetails);
        } catch (error) {
          console.error("Error fetching questions and responses:", error);
        }
      };

      fetchQuestions();
    }
  }, [exam, examDoneId]);

  useEffect(() => {
    if (role === "admin") {
      const fetchTeachers = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/account/teacher/"
          );
          setTeachers(response.data);
        } catch (error) {
          console.error("Error fetching teachers:", error);
        }
      };

      fetchTeachers();
    }
  }, [role]);

  useEffect(() => {
    const total = responses.reduce((sum, response) => sum + response.note, 0);
    setTotalGrade(total);
  }, [responses]);

  const handleNoteChange = (responseId: number, note: number) => {
    setResponses((prevResponses) =>
      prevResponses.map((response) =>
        response.id === responseId ? { ...response, note } : response
      )
    );
  };

  const handleGradeExam = async () => {
    try {
      await Promise.all(
        responses.map((response) =>
          axios.put(
            `http://localhost:8000/api/exam_question_response/${response.id}/`,
            {
              response: response.response,
              note: response.note,
              exam_Done: response.exam_Done,
              question: response.question,
            }
          )
        )
      );

      const teacherId = role === "admin" ? selectedTeacher : userId;

      await axios.post("http://localhost:8000/api/exam_grade/", {
        finalnote: totalGrade,
        examdone: examDoneId,
        teacher: teacherId,
      });

      alert("Exam graded successfully");
      navigate("../view-exams-done");
    } catch (error) {
      console.error("Error grading exam:", error);
    }
  };

  return (
    <div className="set-grade-exam-container">
      <h2>Grade Exam</h2>
      {questions.map((question, index) => (
        <div key={question.id} className="question-container">
          <h3>{question.content}</h3>
          <p>Response: {responses[index]?.response}</p>
          <label>
            Note:
            <input
              type="number"
              value={responses[index]?.note || 0}
              onChange={(e) =>
                handleNoteChange(responses[index].id, Number(e.target.value))
              }
            />
          </label>
        </div>
      ))}
      <div className="total-grade-container">
        <label>
          Total Grade:
          <input type="number" value={totalGrade} readOnly />
        </label>
      </div>
      {role === "admin" && (
        <div className="teacher-select-container">
          <label>
            Select Teacher:
            <select
              value={selectedTeacher || ""}
              onChange={(e) => setSelectedTeacher(Number(e.target.value))}
            >
              <option value="">Select a teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.first_name} {teacher.last_name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      <button onClick={handleGradeExam}>Grade</button>
    </div>
  );
};

export default SetGradeExam;

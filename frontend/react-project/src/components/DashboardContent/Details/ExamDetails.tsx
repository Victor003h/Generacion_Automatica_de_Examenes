import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../styles/DashboardContent/ExamDetails.css";
import { Exam } from "../../Interfaces";

// Component for displaying exam details
const ExamDetails: React.FC = () => {
  const [exam, setExam] = useState<Exam | null>(null);

  // Fetch exam details on component mount
  useEffect(() => {
    const fetchExams = async () => {
      const examId = localStorage.getItem("examId");
      if (examId) {
        try {
          const response = await axios.get("http://localhost:8000/api/exam");
          const exams: Exam[] = response.data;
          const foundExam = exams.find(
            (exam) => exam.id === parseInt(examId, 10)
          );
          setExam(foundExam || null);
        } catch (error) {
          console.error("Error fetching exam details:", error);
        }
      }
    };
    fetchExams();
  }, []);

  if (!exam) {
    return <div>Loading exam details...</div>;
  }

  return (
    <div className="exam-details-container">
      <h2>Exam Details</h2>
      <div className="exam-details">
        <p>
          <strong>Subject:</strong> {exam.subject}
        </p>
        <p>
          <strong>Type:</strong> {exam.type}
        </p>
        <p>
          <strong>Date:</strong> {exam.date}
        </p>
        <p>
          <strong>Teacher:</strong> {exam.teacher}
        </p>
        {/* Add more details as needed */}
      </div>
    </div>
  );
};

export default ExamDetails;

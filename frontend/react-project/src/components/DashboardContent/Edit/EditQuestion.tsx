import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../styles/DashboardContent/AddQuestions.css";
import useFetchSubjectsByRole from "../../../hooks/useFetchSubjectsByRole"; // Import custom hook for fetching subjects by role
import useFetchTopics from "../../../hooks/useFetchSubjectTopics"; // Import custom hook for fetching topics
import BackButton from "../../BackButton";

// Component for editing question details
const EditQuestion: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? storedUserId : null;
  const role = localStorage.getItem("role") || ""; // Get role from local storage
  const { questionId } = location.state;

  // State variables for question details
  const [questionData, setQuestionData] = useState({
    date: "",
    topic: null,
    type: "MO",
    difficulty: "E",
    content: "",
    teacher: role === "admin" ? null : userId,
    subject: null,
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch subjects based on user role
  const {
    subjects,
    loading: subjectsLoading,
    error: subjectsError,
  } = useFetchSubjectsByRole(userId, role);

  // Fetch topics based on selected subject
  const {
    topics,
    loading: topicsLoading,
    error: topicsError,
  } = useFetchTopics(questionData.subject);

  // State variables for teachers
  const [teachers, setTeachers] = useState<
    { id: number; first_name: string; last_name: string }[]
  >([]);
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [teachersError, setTeachersError] = useState<string | null>(null);

  // Fetch teachers if the user is an admin
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/account/teacher/"
        );
        setTeachers(response.data);
        setTeachersLoading(false);
      } catch (error) {
        setTeachersError("Error loading teachers");
        setTeachersLoading(false);
      }
    };

    if (role === "admin") {
      fetchTeachers();
    } else {
      setTeachersLoading(false);
    }
  }, [role]);

  // Fetch question details on component mount
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/question/${questionId}/`
        );
        const question = response.data;

        setQuestionData({
          date: question.date,
          topic: question.topic,
          type: question.type,
          difficulty: question.difficulty,
          content: question.content,
          teacher: question.teacher,
          subject: question.subject,
        });
      } catch (error) {
        console.error("Error fetching question details:", error);
      }
    };
    if (questionId) {
      fetchQuestion();
    }
  }, [questionId]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setQuestionData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle form submission for updating question details
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedQuestionData = {
      ...questionData,
      date: new Date().toISOString().split("T")[0], // Update date to current date
    };

    try {
      await axios.put(
        `http://localhost:8000/api/question/${questionId}/`,
        updatedQuestionData
      );
      setSuccessMessage("Question updated successfully");
      setTimeout(() => {
        setSuccessMessage(null);
        navigate(
          role === "admin"
            ? "/admin-dashboard/questions"
            : "/dashboard/questions"
        ); // Redirect based on role
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  return (
    <div className="add-question-container">
      <BackButton />
      <h2>Edit Question</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields for question details */}
        <div className="form-group">
          <label>Subject:</label>
          {subjectsLoading ? (
            <p>Loading subjects...</p>
          ) : subjectsError ? (
            <p>Error loading subjects</p>
          ) : (
            <select
              name="subject"
              onChange={handleChange}
              value={questionData.subject || ""}
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="form-group">
          <label>Topic:</label>
          {topicsLoading ? (
            <p>Loading topics...</p>
          ) : topicsError ? (
            <p>Error loading topics</p>
          ) : (
            <select
              name="topic"
              onChange={handleChange}
              value={questionData.topic || ""}
            >
              <option value="">Select a topic</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="form-group">
          <label>Question:</label>
          <textarea
            name="content"
            onChange={handleChange}
            value={questionData.content}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Question Type:</label>
          <select name="type" onChange={handleChange} value={questionData.type}>
            <option value="MO">Multiple Choice</option>
            <option value="E">Essay</option>
            <option value="TF">True/False</option>
          </select>
        </div>
        <div className="form-group">
          <label>Difficulty Level:</label>
          <select
            name="difficulty"
            onChange={handleChange}
            value={questionData.difficulty}
          >
            <option value="E">Easy</option>
            <option value="M">Medium</option>
            <option value="D">Hard</option>
          </select>
        </div>
        {role === "admin" && ( // Show teacher selection field only if user is admin
          <div className="form-group">
            <label>Author Teacher:</label>
            {teachersLoading ? (
              <p>Loading teachers...</p>
            ) : teachersError ? (
              <p>{teachersError}</p>
            ) : (
              <select
                name="teacher"
                onChange={handleChange}
                value={questionData.teacher || ""}
              >
                <option value="">Select a teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.first_name} {teacher.last_name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
        <button type="submit" className="save-button">
          Save Changes
        </button>
      </form>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
};

export default EditQuestion;

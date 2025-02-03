import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Course } from "../../Interfaces";
import BackButton from "../../BackButton";
import "../../../styles/DashboardContent/AddCourse.css";

// Component for editing course details
const EditCourse: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.state?.courseId;
  const [course, setCourse] = useState<Course | null>(null);
  const [name, setName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch course details on component mount
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/account/course/${courseId}`
        );
        const courseData: Course = response.data;
        setCourse(courseData);
        setName(courseData.name);
        setStartDate(courseData.startDate);
        setEndDate(courseData.endDate);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Error fetching course details."
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error fetching course details.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    } else {
      setError("No course ID provided.");
      setLoading(false);
    }
  }, [courseId]);

  // Handle form submission for updating course details
  const handleEditCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8000/api/account/course/${courseId}`, {
        name,
        startDate,
        endDate,
      });
      alert("Course updated successfully");
      navigate("../courses");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Error updating course:",
          err.response?.data || err.message
        );
      } else if (err instanceof Error) {
        console.error("Error updating course:", err.message);
      } else {
        console.error("Unknown error updating course.");
      }
    }
  };

  if (loading) return <div>Loading course details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="edit-course-container">
      <BackButton />
      <h1>Edit Course</h1>
      {course ? (
        <form onSubmit={handleEditCourse}>
          <div className="form-group">
            <label htmlFor="name">Course Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              id="startDate"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Update Course
          </button>
        </form>
      ) : (
        <div>No course details found.</div>
      )}
    </div>
  );
};

export default EditCourse;

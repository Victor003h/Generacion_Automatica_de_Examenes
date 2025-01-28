import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/DashboardContent/AddSubject.css";
import { Teacher } from "../Interfaces";
import useFetchCourses from "../../hooks/useFetchCourses";
import BackButton from "../BackButton";

const AddSubject: React.FC = () => {
  const [name, setName] = useState("");
  const [studyProgram, setStudyProgram] = useState("");
  const [courseId, setCourseId] = useState<number | "">("");
  const [headOfSubject, setHeadOfSubject] = useState<number | "">("");
  const [teachersSubject, setTeachersSubject] = useState<string>("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    courses,
    loading: coursesLoading,
    error: coursesError,
  } = useFetchCourses();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/account/teacher/"
        );
        setTeachers(response.data);
      } catch (err) {
        console.error("Error al obtener la lista de profesores:", err);
      }
    };

    fetchTeachers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const teachersSubjectArray = teachersSubject.split(",").map(Number); // Convertir a array de números

    try {
      await axios.post("http://localhost:8000/api/subjects/", {
        name: name,
        study_program: studyProgram,
        course: courseId, // Asignar el ID del curso seleccionado
        head_of_subject: headOfSubject,
        teachers_subject: teachersSubjectArray,
      });

      alert("Asignatura añadida con éxito");
      navigate("/admin-dashboard/subjects"); // Redirige a la lista de asignaturas
    } catch (err) {
      setError("Error al añadir la asignatura. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTeachers = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    ).join(",");
    setTeachersSubject(selectedTeachers);
  };

  return (
    <div className="add-subject-container">
      <BackButton />
      <h1>Añadir Asignatura</h1>
      <form className="add-subject-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="studyProgram">Programa de Estudio</label>
          <input
            type="text"
            id="studyProgram"
            value={studyProgram}
            onChange={(e) => setStudyProgram(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="course">Curso</label>
          <select
            id="course"
            value={courseId}
            onChange={(e) => setCourseId(Number(e.target.value))}
            required
          >
            <option value="">Seleccionar Curso</option>
            {coursesLoading && <option>Cargando cursos...</option>}
            {coursesError && <option>Error al cargar cursos</option>}
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="headOfSubject">Jefe de Asignatura</label>
          <select
            id="headOfSubject"
            value={headOfSubject}
            onChange={(e) => setHeadOfSubject(Number(e.target.value))}
            required
          >
            <option value="">Seleccione un jefe de asignatura</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.first_name} {teacher.last_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="teachersSubject">Profesores de la Asignatura</label>
          <select
            id="teachersSubject"
            multiple
            value={teachersSubject.split(",")}
            onChange={handleTeacherChange}
            required
          >
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.first_name} {teacher.last_name}
              </option>
            ))}
          </select>
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Cargando..." : "Añadir Asignatura"}
        </button>
      </form>
    </div>
  );
};

export default AddSubject;

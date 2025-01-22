import { useState, useEffect, useCallback } from "react";
import useFetchSubjects from "../../hooks/useFetchSubjetcs";
import useFetchQuestions from "../../hooks/useFetchQuestions";
import useFetchTeacherSubjects from "../../hooks/useFetchTeacherSubjects";
import "../../styles/DashboardContent/QuestionsList.css";
import { Subject, Question } from "../../components/Interfaces";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import QuestionItem from "./QuestionItem";

const QuestionList: React.FC = () => {
  const userId = localStorage.getItem("userId") || ""; // Obtener el userId desde localstorage
  const role = localStorage.getItem("role") || ""; // Obtener el role desde localstorage
  const navigate = useNavigate();

  // Hooks para obtener asignaturas
  const {
    subjects: adminSubjects,
    loading: adminSubjectsLoading,
    error: adminSubjectsError,
  } = useFetchSubjects();
  const {
    subjects: teacherSubjects,
    loading: teacherSubjectsLoading,
    error: teacherSubjectsError,
  } = useFetchTeacherSubjects(userId);

  // Seleccionar las asignaturas y estados de carga/error adecuados según el rol del usuario
  const subjects = role === "admin" ? adminSubjects : teacherSubjects;
  const subjectsLoading =
    role === "admin" ? adminSubjectsLoading : teacherSubjectsLoading;
  const subjectsError =
    role === "admin" ? adminSubjectsError : teacherSubjectsError;

  const subjectIds = subjects.map((subject: Subject) => subject.id);
  const {
    questions,
    loading: questionsLoading,
    error: questionsError,
  } = useFetchQuestions(subjectIds);

  const [topics, setTopics] = useState<{ [key: number]: string }>({});
  const [fetchedTopics, setFetchedTopics] = useState<boolean>(false);
  const [teachers, setTeachers] = useState<{
    [key: number]: { firstName: string; lastName: string };
  }>({});

  useEffect(() => {
    const fetchTopics = async () => {
      if (questions && Object.keys(questions).length > 0 && !fetchedTopics) {
        const topicIds = Array.from(
          new Set(
            Object.values(questions)
              .flat()
              .map((q: Question) => q.topic)
          )
        ).map(Number); // Asegurarse de que los IDs sean números
        const topicsDict: { [key: number]: string } = {};

        await Promise.all(
          topicIds.map(async (id) => {
            try {
              const response = await axios.get(
                `http://localhost:8000/api/topic/${id}/`
              );
              topicsDict[id] = response.data.name;
            } catch (error) {
              console.error("Error al obtener el tema:", error);
            }
          })
        );

        setTopics(topicsDict);
        setFetchedTopics(true);
      }
    };

    fetchTopics();
  }, [questions, fetchedTopics]);

  const fetchTeachers = useCallback(async () => {
    const teacherIds = Array.from(
      new Set(
        Object.values(questions)
          .flat()
          .map((q: Question) => q.teacher)
      )
    ).map(Number); // Asegurarse de que los IDs sean números

    const teachersDict: {
      [key: number]: { firstName: string; lastName: string };
    } = {};

    await Promise.all(
      teacherIds.map(async (id) => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/account/teacher/${id}`
          );
          teachersDict[id] = {
            firstName: response.data.first_name,
            lastName: response.data.last_name,
          };
        } catch (error) {
          console.error("Error al obtener el profesor:", error);
        }
      })
    );

    setTeachers(teachersDict);
  }, [questions]);

  useEffect(() => {
    if (questions && Object.keys(questions).length > 0) {
      fetchTeachers();
    }
  }, [fetchTeachers, questions]);

  const handleDeleteQuestion = async (questionId: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres borrar esta pregunta?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/question/${questionId}/`);
        alert("Pregunta borrada con éxito");
        window.location.reload(); // Recargar la página para actualizar la lista de preguntas
      } catch (error) {
        console.error("Error al borrar la pregunta:", error);
      }
    }
  };

  const handleEditQuestion = (questionId: number) => {
    navigate("/edit-question", { state: { questionId } });
  };

  if (subjectsLoading || questionsLoading) return <div>Cargando...</div>;
  if (subjectsError) return <div>{subjectsError}</div>;
  if (questionsError) return <div>{questionsError}</div>;

  return (
    <div className="outer-container">
      <Link to="/add-question" className="add-button">
        Añadir Pregunta
      </Link>
      <div className="content-container">
        {subjects.length === 0 ? (
          <div>No hay asignaturas disponibles</div>
        ) : (
          subjects.map((subject: Subject) => (
            <div key={subject.id} className="subject-container">
              <div className="subject-header">
                <h2>{subject.name}</h2>
              </div>
              <div className="question-list">
                {questions[subject.id] && questions[subject.id].length > 0 ? (
                  questions[subject.id].map((question: Question) => (
                    <QuestionItem
                      key={question.id}
                      question={question}
                      topics={topics}
                      teachers={teachers}
                      onDelete={handleDeleteQuestion}
                      onEdit={handleEditQuestion}
                    />
                  ))
                ) : (
                  <div className="question-item">
                    No hay preguntas disponibles
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionList;

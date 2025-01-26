import { useState, useEffect, useCallback, useMemo } from "react";
import useFetchSubjects from "../../hooks/useFetchSubjects";
import useFetchQuestions from "../../hooks/useFetchQuestions";
import useFetchTeacherSubjects from "../../hooks/useFetchTeacherSubjects";
import "../../styles/DashboardContent/QuestionsList.css";
import { Subject, Question } from "../../components/Interfaces";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import QuestionItem from "./QuestionItem";
import SortOptions from "./SortOptions";
import BackButton from "../BackButton";
import "../../styles/DashboardContent/CrudButtons.css";

const QuestionList: React.FC = () => {
  const userId = localStorage.getItem("userId") || "";
  const role = localStorage.getItem("role") || "";
  const navigate = useNavigate();

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
  const [sortKey, setSortKey] = useState<string>("content");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchTopics = async () => {
      if (questions && Object.keys(questions).length > 0 && !fetchedTopics) {
        const topicIds = Array.from(
          new Set(
            Object.values(questions)
              .flat()
              .map((q: Question) => q.topic)
          )
        ).map(Number);
        const topicsDict: { [key: number]: string } = {};

        await Promise.all(
          topicIds.map(async (id) => {
            try {
              const response = await axios.get(
                `http://localhost:8000/api/topic/${id}/`
              );
              topicsDict[id] = response.data.name;
            } catch (err: unknown) {
              if (axios.isAxiosError(err)) {
                console.error(
                  "Error al obtener el tema:",
                  err.response?.data || err.message
                );
              } else if (err instanceof Error) {
                console.error("Error al obtener el tema:", err.message);
              } else {
                console.error("Error desconocido al obtener el tema.");
              }
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
    ).map(Number);

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
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            console.error(
              "Error al obtener el profesor:",
              err.response?.data || err.message
            );
          } else if (err instanceof Error) {
            console.error("Error al obtener el profesor:", err.message);
          } else {
            console.error("Error desconocido al obtener el profesor.");
          }
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

  const sortedQuestions = useMemo(() => {
    const allQuestions = Object.values(questions).flat();

    return allQuestions.slice().sort((a, b) => {
      const aValue = a[sortKey as keyof Question];
      const bValue = b[sortKey as keyof Question];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [questions, sortKey, sortOrder]);

  const handleDeleteQuestion = async (questionId: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres borrar esta pregunta?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/question/${questionId}/`);
        alert("Pregunta borrada con éxito");
        window.location.reload();
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

  const sortOptions = [
    { value: "content", label: "Contenido" },
    { value: "type", label: "Tipo" },
    { value: "difficulty", label: "Dificultad" },
    { value: "date", label: "Fecha" },
  ];

  return (
    <div className="outer-container">
      <div className="content-container">
        <Link to="/add-question" className="add-button">
          Añadir Pregunta
        </Link>
        <BackButton />

        <SortOptions
          sortKey={sortKey}
          setSortKey={setSortKey}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          options={sortOptions}
        />
        {subjects.length === 0 ? (
          <div>No hay asignaturas disponibles</div>
        ) : (
          subjects.map((subject: Subject) => (
            <div key={subject.id} className="subject-container">
              <div className="subject-header">
                <h2>{subject.name}</h2>
              </div>
              <div className="question-list">
                {sortedQuestions
                  .filter((question) => question.subject === subject.id)
                  .map((question: Question) => (
                    <QuestionItem
                      key={question.id}
                      question={question}
                      topics={topics}
                      teachers={teachers}
                      onDelete={handleDeleteQuestion}
                      onEdit={handleEditQuestion}
                    />
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionList;

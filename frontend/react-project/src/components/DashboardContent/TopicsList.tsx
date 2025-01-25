import { useState, useMemo } from "react";
import useFetchSubjects from "../../hooks/useFetchSubjects";
import useFetchTopicsBySubject from "../../hooks/useFetchSubjectTopics";
import useFetchTeacherSubjects from "../../hooks/useFetchTeacherSubjects";
import "../../styles/DashboardContent/TopicsList.css";
import { Subject, Topic } from "../../components/Interfaces";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import SortOptions from "./SortOptions"; // Asegúrate de tener este componente
import BackButton from "../BackButton";

const TopicsList: React.FC = () => {
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

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleDeleteTopic = async (topicId: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres borrar este tema?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/topic/${topicId}/`);
        alert("Tema borrado con éxito");
        window.location.reload(); // Recargar la página para actualizar la lista de temas
      } catch (error) {
        console.error("Error al borrar el tema:", error);
      }
    }
  };

  const handleEditTopic = (topicId: number) => {
    navigate("../edit-topic", { state: { topicId } });
  };

  if (subjectsLoading) return <div>Cargando...</div>;
  if (subjectsError) return <div>{subjectsError}</div>;

  const sortOptions = [{ value: "name", label: "Nombre" }];

  return (
    <div className="outer-container">
      {role === "admin" && (
        <Link to="../add-topic" className="add-button">
          Añadir Tema
        </Link>
      )}
      <div className="content-container">
        <BackButton />
        <h1>Lista de Temas</h1>
        <SortOptions
          sortKey="name"
          setSortKey={() => {}} // No se necesita cambiar la clave de ordenación porque siempre es "name"
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
              <SubjectTopics
                subjectId={subject.id}
                onDelete={handleDeleteTopic}
                onEdit={handleEditTopic}
                sortOrder={sortOrder} // Pasamos el estado de ordenación al componente
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

interface SubjectTopicsProps {
  subjectId: number;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  sortOrder: "asc" | "desc";
}

const SubjectTopics: React.FC<SubjectTopicsProps> = ({
  subjectId,
  onDelete,
  onEdit,
  sortOrder,
}) => {
  const { topics, loading, error } = useFetchTopicsBySubject(subjectId);

  const sortedTopics = useMemo(() => {
    return topics.slice().sort((a, b) => {
      const aValue = a.name;
      const bValue = b.name;

      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [topics, sortOrder]);

  if (loading) return <div>Cargando temas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="topic-list">
      {sortedTopics.length > 0 ? (
        sortedTopics.map((topic: Topic) => (
          <TopicItem
            key={topic.id}
            topic={topic}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))
      ) : (
        <div className="topic-item">No hay temas disponibles</div>
      )}
    </div>
  );
};

interface TopicItemProps {
  topic: Topic;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const TopicItem: React.FC<TopicItemProps> = ({ topic, onDelete, onEdit }) => {
  return (
    <div className="topic-item">
      <h3>{topic.name}</h3>
      <div className="topic-actions">
        <button className="edit-button" onClick={() => onEdit(topic.id)}>
          Editar
        </button>
        <button className="delete-button" onClick={() => onDelete(topic.id)}>
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default TopicsList;

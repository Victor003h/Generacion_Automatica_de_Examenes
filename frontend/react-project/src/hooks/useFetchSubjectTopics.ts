import { useState, useEffect } from "react";
import axios from "axios";
import { Topic } from "../components/Interfaces";

// Hook personalizado para obtener los temas de una asignatura
const useFetchTopicsBySubject = (subjectId: number | null) => {
  // Estado para almacenar los temas
  const [topics, setTopics] = useState<Topic[]>([]);
  // Estado para manejar la carga
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para manejar errores
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subjectId !== null) {
      // Función para obtener los temas
      const fetchTopics = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/subject/topics/${subjectId}/`
          );
          if (response.status === 404) {
            setError("No se encontraron temas para esta asignatura.");
            setTopics([]);
          } else {
            setTopics(response.data);
          }
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 404) {
              setError("No se encontraron temas para esta asignatura.");
              setTopics([]);
            } else {
              setError(
                err.response?.data?.message || "Error al obtener los temas."
              );
            }
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Error desconocido al obtener los temas.");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchTopics();
    } else {
      setLoading(false);
    }
  }, [subjectId]);

  // Retornar los temas, el estado de carga y el error
  return { topics, loading, error };
};

export default useFetchTopicsBySubject;

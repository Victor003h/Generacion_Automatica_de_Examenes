import { useState, useEffect } from "react";
import axios from "axios";
import { Topic } from "../components/Interfaces";

const useFetchTopics = (subjectId: number | null) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (subjectId !== null) {
      const fetchTopics = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/subject/topics/${subjectId}/`
          );
          if (response.data.length === 0) {
            setError("No se encontraron temas.");
          }
          setTopics(response.data);
        } catch (error) {
          setError("Error al obtener los temas.");
        } finally {
          setLoading(false);
        }
      };
      fetchTopics();
    } else {
      setLoading(false);
    }
  }, [subjectId]);
  return { topics, loading, error };
};
export default useFetchTopics;

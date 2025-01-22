import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Question } from "../components/Interfaces"; // Asegúrate de importar la interfaz

const useFetchQuestions = (subjectIds: number[]) => {
  const [questions, setQuestions] = useState<Record<number, Question[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (subjectIds.length > 0 && !fetched) {
          const questionsData: Record<number, Question[]> = {};
          for (const subjectId of subjectIds) {
            try {
              const response = await axios.get(
                `http://localhost:8000/api/subject/question/${subjectId}/`
              );
              questionsData[subjectId] = response.data;
            } catch (err: unknown) {
              if (err instanceof AxiosError) {
                if (err.response && err.response.status === 404) {
                  questionsData[subjectId] = []; // Si no se encuentran preguntas, asignar un array vacío
                } else {
                  throw err; // Para otros errores, lanzarlos
                }
              } else {
                throw err; // Para otros tipos de errores, lanzarlos
              }
            }
          }
          setQuestions(questionsData);
          setFetched(true);
        }
      } catch (error) {
        setError("Error al obtener las preguntas");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [subjectIds, fetched]);

  return { questions, loading, error };
};

export default useFetchQuestions;

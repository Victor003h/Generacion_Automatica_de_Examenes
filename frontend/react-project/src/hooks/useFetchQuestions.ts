import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Question } from "../components/Interfaces"; // Asegúrate de importar la interfaz

const useFetchQuestions = (subjectIds: number[]) => {
  const [questions, setQuestions] = useState<Record<number, Question[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
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
      } catch (error) {
        setError("Error al obtener las preguntas");
      } finally {
        setLoading(false);
      }
    };

    if (subjectIds.length > 0) {
      fetchQuestions();
    }
  }, [subjectIds]);

  return { questions, loading, error };
};

export default useFetchQuestions;

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Question } from "../components/Interfaces";

const useFetchQuestions = (subjectIds: number[]) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (subjectIds.length > 0) {
          const questionsData: Question[] = [];
          for (const subjectId of subjectIds) {
            try {
              const response = await axios.get(
                `http://localhost:8000/api/subject/question/${subjectId}/`
              );
              questionsData.push(...response.data);
            } catch (err: unknown) {
              if (err instanceof AxiosError) {
                if (err.response && err.response.status === 404) {
                  // Si no se encuentran preguntas, continuar sin añadir nada
                } else {
                  throw err; // Para otros errores, lanzarlos
                }
              } else {
                throw err; // Para otros tipos de errores, lanzarlos
              }
            }
          }
          setQuestions(questionsData);
        }
      } catch (error) {
        setError("Error al obtener las preguntas");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [subjectIds]);

  return { questions, loading, error };
};

export default useFetchQuestions;

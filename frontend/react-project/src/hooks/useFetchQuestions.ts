import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Question } from "../components/Interfaces";

// Hook personalizado para obtener las preguntas de las materias
const useFetchQuestions = (subjectIds: number[]) => {
  // Estado para almacenar las preguntas
  const [questions, setQuestions] = useState<Question[]>([]);
  // Estado para indicar si se están cargando las preguntas
  const [loading, setLoading] = useState(true);
  // Estado para almacenar errores
  const [error, setError] = useState<string | null>(null);

  // Efecto para obtener las preguntas cuando cambian los IDs de las materias
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

  // Retornar las preguntas, el estado de carga y los errores
  return { questions, loading, error };
};

export default useFetchQuestions;

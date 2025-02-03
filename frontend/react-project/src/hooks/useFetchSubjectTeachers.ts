import { useState, useEffect } from "react";
import axios from "axios";
import { Teacher } from "../components/Interfaces";

// Hook personalizado para obtener los profesores de una asignatura
const useFetchTeachersBySubject = (subjectId: number | null) => {
  // Estado para almacenar los profesores
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  // Estado para manejar la carga
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para manejar errores
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subjectId !== null) {
      // Función para obtener los profesores
      const fetchTeachers = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/subject/teachers/${subjectId}/`
          );
          if (response.data.length === 0) {
            throw new Error(
              "No se encuentra ningun profesor para esta asignatura."
            );
          }
          setTeachers(response.data);
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            setError(
              err.response?.data?.message || "Error al obtener los profesores."
            );
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Error desconocido al obtener los profesores.");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchTeachers();
    } else {
      setLoading(false);
    }
  }, [subjectId]);

  // Retornar los profesores, el estado de carga y el error
  return { teachers, loading, error };
};

export default useFetchTeachersBySubject;

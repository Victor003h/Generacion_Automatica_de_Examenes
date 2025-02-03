import { useState, useEffect } from "react";
import axios from "axios";
import { Subject } from "../components/Interfaces";

// Hook personalizado para obtener las asignaturas de un estudiante
const useFetchTeacherSubjects = (studentId: number) => {
  // Estado para almacenar las asignaturas
  const [subjects, setSubjects] = useState<Subject[]>([]);
  // Estado para manejar el estado de carga
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState<string | null>(null);

  // Efecto para obtener las asignaturas del estudiante al montar el componente
  useEffect(() => {
    const fetchSubjects = async () => {
      if (studentId !== null) {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/student/subjects/${studentId}/`
          );
          if (response.data.length === 0) {
            setError("No se encontraron asignaturas para este estudiante.");
          } else {
            setSubjects(response.data);
          }
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 404) {
              setError("No se encontraron asignaturas para este estudiante.");
            } else {
              setError(
                err.response?.data?.message ||
                  "Error al obtener las asignaturas."
              );
            }
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Error desconocido al obtener las asignaturas.");
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [studentId]);

  // Retornar el estado de las asignaturas, carga y error
  return { subjects, loading, error };
};

export default useFetchTeacherSubjects;

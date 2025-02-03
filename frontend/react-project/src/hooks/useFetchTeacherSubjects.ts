import { useState, useEffect } from "react";
import axios from "axios";
import { Subject } from "../components/Interfaces";

// Hook personalizado para obtener las asignaturas de un profesor
const useFetchTeacherSubjects = (teacherId: number | null, role: string = "teacher") => {
  // Estado para almacenar las asignaturas
  const [subjects, setSubjects] = useState<Subject[]>([]);
  // Estado para manejar la carga
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Función para obtener las asignaturas
    const fetchSubjects = async () => {
      if (role === "admin" || teacherId !== null) {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/teacher/subjects/${teacherId}/`
          );
          if (response.data.length === 0) {
            setError("No se encontraron asignaturas para este profesor.");
          } else {
            setSubjects(response.data);
          }
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 404) {
              if (role !== "admin") {
                setError("No se encontraron asignaturas para este profesor.");
              }
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
  }, [teacherId, role]);

  // Retornar las asignaturas, el estado de carga y el error
  return { subjects, loading, error };
};

export default useFetchTeacherSubjects;

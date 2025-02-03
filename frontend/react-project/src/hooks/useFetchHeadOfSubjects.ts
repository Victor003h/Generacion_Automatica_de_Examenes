import { useState, useEffect } from "react";
import axios from "axios";
import { Subject } from "../components/Interfaces";

// Hook personalizado para obtener las asignaturas de un profesor específico
const useFetchTeacherSubjects = (teacherId: number) => {
  // Estado para almacenar las asignaturas
  const [subjects, setSubjects] = useState<Subject[]>([]);
  // Estado para manejar el estado de carga
  const [loading, setLoading] = useState(true);
  // Estado para manejar los errores
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Función asincrónica para obtener las asignaturas
    const fetchSubjects = async () => {
      if (teacherId !== null) {
        try {
          // Realiza una solicitud GET a la API para obtener las asignaturas del profesor
          const response = await axios.get(
            `http://localhost:8000/api/teacher/head_of_subject/${teacherId}`
          );
          if (response.data.length === 0) {
            // Maneja el caso en que no se encuentran asignaturas
            setError("No se encontraron asignaturas para este profesor.");
          } else {
            // Actualiza el estado con las asignaturas obtenidas
            setSubjects(response.data);
          }
        } catch (err: unknown) {
          // Manejo de errores de la solicitud
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 404) {
              setError("No se encontraron asignaturas para este profesor.");
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
          // Actualiza el estado de carga
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    // Llama a la función para obtener las asignaturas
    fetchSubjects();
  }, [teacherId]);

  // Retorna las asignaturas, el estado de carga y los errores
  return { subjects, loading, error };
};

export default useFetchTeacherSubjects;

import { useState, useEffect } from "react";
import axios from "axios";
import { Course } from "../components/Interfaces";

// Hook personalizado para obtener todos los cursos
const useFetchCourses = () => {
  // Estado para almacenar los cursos
  const [courses, setCourses] = useState<Course[]>([]);
  // Estado para manejar el estado de carga
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para manejar errores
  const [error, setError] = useState<string | null>(null);

  // Efecto para obtener los cursos al montar el componente
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/account/course/"
        );
        if (response.status === 404) {
          setError("No se encontraron cursos.");
          setCourses([]);
        } else {
          setCourses(response.data);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError("No se encontraron cursos.");
            setCourses([]);
          } else {
            setError(err.message);
          }
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido al obtener los cursos.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Retornar el estado de los cursos, carga y error
  return { courses, loading, error };
};

export default useFetchCourses;

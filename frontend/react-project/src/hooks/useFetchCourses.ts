import { useState, useEffect } from "react";
import axios from "axios";
import { Course } from "../components/Interfaces";

const useFetchCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return { courses, loading, error };
};

export default useFetchCourses;

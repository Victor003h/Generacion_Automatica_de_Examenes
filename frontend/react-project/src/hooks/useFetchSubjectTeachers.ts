import { useState, useEffect } from "react";
import axios from "axios";
import { Teacher } from "../components/Interfaces";

const useFetchTeachersBySubject = (subjectId: number | null) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subjectId !== null) {
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

  return { teachers, loading, error };
};

export default useFetchTeachersBySubject;

import { useState, useEffect } from "react";
import axios from "axios";
import { Subject } from "../components/Interfaces";

const useFetchTeacherSubjects = (teacherId: string | null) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (teacherId !== null) {
      const fetchSubjects = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/teacher/subjects/${teacherId}/`
          );
          if (response.status === 404) {
            setError("No se encontraron asignaturas para este profesor.");
            setSubjects([]);
          } else {
            setSubjects(response.data);
          }
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 404) {
              setError("No se encontraron asignaturas para este profesor.");
              setSubjects([]);
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
      };

      fetchSubjects();
    } else {
      setLoading(false);
    }
  }, [teacherId]);

  return { subjects, loading, error };
};

export default useFetchTeacherSubjects;

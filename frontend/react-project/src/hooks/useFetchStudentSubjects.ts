import { useState, useEffect } from "react";
import axios from "axios";
import { Subject } from "../components/Interfaces";

const useFetchTeacherSubjects = (studentId: number) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return { subjects, loading, error };
};

export default useFetchTeacherSubjects;

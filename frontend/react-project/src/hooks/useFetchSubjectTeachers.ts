import { useState, useEffect } from "react";
import axios from "axios";
import { Teacher } from "../components/Interfaces";

const useFetchSubjectTeachers = (subjectId: number | null) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subjectId !== null) {
      const fetchTeachers = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/subject/teacher/${subjectId}/`
          );
          if (response.data.length === 0) {
            setError("No se encontraron profesores.");
          }
          setTeachers(response.data);
        } catch (error) {
          setError("Error al obtener los profesores.");
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

export default useFetchSubjectTeachers;

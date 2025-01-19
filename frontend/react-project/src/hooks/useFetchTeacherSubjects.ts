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
          if (response.data.length === 0) {
            setError("No se encontraron asignaturas.");
          }
          setSubjects(response.data);
        } catch (error) {
          setError("Error al obtener las asignaturas.");
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

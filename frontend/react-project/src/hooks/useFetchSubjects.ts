import { useState, useEffect } from "react";
import axios from "axios";
import { Subject } from "../components/Interfaces"; // Asegúrate de importar la interfaz

const useFetchSubjects = (teacherId: string) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/teacher/subjects/${teacherId}/`
        );
        setSubjects(response.data);
      } catch (error) {
        setError("Error al obtener las asignaturas");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [teacherId]);

  return { subjects, loading, error };
};

export default useFetchSubjects;

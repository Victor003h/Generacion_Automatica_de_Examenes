import { useState, useEffect } from "react";
import axios from "axios";
import { Exam } from "../components/Interfaces";

// Hook personalizado para obtener todos los exámenes
const useFetchAllExams = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Función para obtener los exámenes desde el servidor
    const fetchExams = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/exam/");
        setExams(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "Error al cargar los exámenes."
          );
        } else {
          setError("Error desconocido al cargar los exámenes.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return { exams, loading, error };
};

export default useFetchAllExams;

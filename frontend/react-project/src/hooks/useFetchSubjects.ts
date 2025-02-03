import { useState, useEffect } from "react";
import axios from "axios";
import { Subject } from "../components/Interfaces";

// Interfaz para el resultado de la función useFetchSubjects
interface FetchSubjectsResult {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
}

// Hook personalizado para obtener todas las asignaturas
const useFetchSubjects = (): FetchSubjectsResult => {
  // Estado para almacenar las asignaturas
  const [subjects, setSubjects] = useState<Subject[]>([]);
  // Estado para manejar el estado de carga
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para manejar errores
  const [error, setError] = useState<string | null>(null);

  // Efecto para obtener las asignaturas al montar el componente
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/subjects/");
        setSubjects(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Retornar el estado de las asignaturas, carga y error
  return { subjects, loading, error };
};

export default useFetchSubjects;

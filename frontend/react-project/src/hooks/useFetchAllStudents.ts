import { useState, useEffect } from "react";
import axios from "axios";
import { Student } from "../components/Interfaces";

// Hook personalizado para obtener todos los estudiantes
const useFetchAllStudents = () => {
  // Estado para almacenar los estudiantes
  const [students, setStudents] = useState<Student[]>([]);
  // Estado para manejar el estado de carga
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para manejar los errores
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Función asincrónica para obtener los estudiantes
    const fetchStudents = async () => {
      try {
        // Realiza una solicitud GET a la API para obtener todos los estudiantes
        const response = await axios.get(
          "http://localhost:8000/api/account/student/"
        );
        // Actualiza el estado con los estudiantes obtenidos
        setStudents(response.data);
      } catch (err: unknown) {
        // Manejo de errores de la solicitud
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "Error al obtener los estudiantes."
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido al obtener los estudiantes.");
        }
      } finally {
        // Actualiza el estado de carga
        setLoading(false);
      }
    };

    // Llama a la función para obtener los estudiantes
    fetchStudents();
  }, []);

  // Retorna los estudiantes, el estado de carga y los errores
  return { students, loading, error };
};

export default useFetchAllStudents;

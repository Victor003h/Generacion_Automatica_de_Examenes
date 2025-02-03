import { useState, useEffect } from "react";
import axios from "axios";
import { Teacher } from "../components/Interfaces";

// Hook personalizado para obtener todos los profesores
const useFetchAllTeachers = () => {
  // Estado para almacenar los profesores
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  // Estado para indicar si se están cargando los profesores
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para almacenar errores
  const [error, setError] = useState<string | null>(null);

  // Efecto para obtener los profesores cuando se monta el componente
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/account/teacher/"
        );
        if (response.data.length === 0) {
          throw new Error("No se encuentra ningun profesor.");
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
  }, []);

  // Retornar los profesores, el estado de carga y los errores
  return { teachers, loading, error };
};

export default useFetchAllTeachers;

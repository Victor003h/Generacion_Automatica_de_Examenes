import { useState, useEffect } from "react";
import axios from "axios";
import { Teacher } from "../components/Interfaces";

const useFetchAllTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/teachers/");
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

  return { teachers, loading, error };
};

export default useFetchAllTeachers;

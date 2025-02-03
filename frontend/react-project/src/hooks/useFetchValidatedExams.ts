import { useState, useEffect } from "react";
import axios from "axios";

// Hook personalizado para obtener exámenes validados
const useFetchValidatedExams = () => {
  // Estado para almacenar los exámenes validados
  const [validatedExams, setValidatedExams] = useState<
    { id:number, type:string, date:string , exam:number}[]
  >([]);
  // Estado para manejar la carga
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para manejar errores
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Función para obtener los exámenes validados
    const fetchValidatedExams = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/assigned_exam/`
        );
        const validatedExamList: {id:number, type:string, date:string , exam:number}[] = response.data;
        
        setValidatedExams(validatedExamList);
        setLoading(false);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data || err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido al obtener los exámenes Oficiales.");
        }
        setLoading(false);
      }
    };

    fetchValidatedExams();
  }, []);
   
  // Retornar los exámenes validados, el estado de carga y el error
  return { validatedExams, loading, error };
};

export default useFetchValidatedExams;

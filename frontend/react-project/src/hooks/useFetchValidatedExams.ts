import { useState, useEffect } from "react";
import axios from "axios";

const useFetchValidatedExams = () => {
  const [validatedExams, setValidatedExams] = useState<
    { exam: number; id: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchValidatedExams = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/validated_exam/`
        );
        const validatedExamList: { exam: number; id: number }[] = response.data;
        setValidatedExams(validatedExamList);
        setLoading(false);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data || err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido al obtener los exámenes validados.");
        }
        setLoading(false);
      }
    };

    fetchValidatedExams();
  }, []);

  return { validatedExams, loading, error };
};

export default useFetchValidatedExams;

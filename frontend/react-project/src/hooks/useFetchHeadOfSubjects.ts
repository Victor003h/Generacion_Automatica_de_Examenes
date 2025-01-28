import { useState, useEffect } from "react";
import axios from "axios";

const useFetchHeadOfSubjects = (teacherId: number | null) => {
  const [subjectIds, setSubjectIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (teacherId === null) {
      setLoading(false);
      return;
    }

    const fetchSubjectIds = async () => {
      try {
        const response = await axios.get(
          `/api/teacher/head_of_subject/${teacherId}`
        );
        setSubjectIds(response.data);
        setLoading(false);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data || err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido al obtener las asignaturas.");
        }
        setLoading(false);
      }
    };

    fetchSubjectIds();
  }, [teacherId]);

  return { subjectIds, loading, error };
};

export default useFetchHeadOfSubjects;

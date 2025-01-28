import { useState, useEffect } from "react";
import axios from "axios";
import { Exam } from "../components/Interfaces";
import useFetchAllExams from "./useFetchAllExams";

const useFetchValidatedExams = () => {
  const {
    exams: allExams,
    loading: allExamsLoading,
    error: allExamsError,
  } = useFetchAllExams();
  const [validatedExams, setValidatedExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchValidatedExams = async () => {
      try {
        const validatedExams: Exam[] = [];

        await Promise.all(
          allExams.map(async (exam) => {
            try {
              await axios.get(`/api/exam/isvalidated/${exam.id}`);
              validatedExams.push(exam);
            } catch (err) {
              if (!axios.isAxiosError(err) || err.response?.status !== 404) {
                throw err;
              }
            }
          })
        );

        setValidatedExams(validatedExams);
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

    if (!allExamsLoading && !allExamsError) {
      fetchValidatedExams();
    }
  }, [allExams, allExamsLoading, allExamsError]);

  return { validatedExams, loading, error };
};

export default useFetchValidatedExams;

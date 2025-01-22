import { useState, useEffect } from "react";
import axios from "axios";
import { Subject } from "../components/Interfaces";

interface FetchSubjectsResult {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
}

const useFetchSubjects = (): FetchSubjectsResult => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return { subjects, loading, error };
};

export default useFetchSubjects;

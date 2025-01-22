import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Question } from "../components/Interfaces";

const useFetchTeachers = (questions: { [key: number]: Question[] }) => {
  const [teachers, setTeachers] = useState<{
    [key: number]: { firstName: string; lastName: string };
  }>({});

  const fetchTeachers = useCallback(async () => {
    const teacherIds = Array.from(
      new Set(
        Object.values(questions)
          .flat()
          .map((q: Question) => q.teacher)
      )
    ).map(Number); // Asegurarse de que los IDs sean números

    const teachersDict: {
      [key: number]: { firstName: string; lastName: string };
    } = {};

    await Promise.all(
      teacherIds.map(async (id) => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/teacher/${id}/`
          );
          teachersDict[id] = {
            firstName: response.data.first_name,
            lastName: response.data.last_name,
          };
        } catch (error) {
          console.error("Error al obtener el profesor:", error);
        }
      })
    );

    setTeachers(teachersDict);
  }, [questions]);

  useEffect(() => {
    if (questions && Object.keys(questions).length > 0) {
      fetchTeachers();
    }
  }, [fetchTeachers, questions]);

  return teachers;
};

export default useFetchTeachers;

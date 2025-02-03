import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Question } from "../components/Interfaces";

// Hook personalizado para obtener los profesores asociados a las preguntas
const useFetchTeachers = (questions: { [key: number]: Question[] }) => {
  // Estado para almacenar los profesores
  const [teachers, setTeachers] = useState<{
    [key: number]: { firstName: string; lastName: string };
  }>({});

  // Función para obtener los profesores de manera asíncrona
  const fetchTeachers = useCallback(async () => {
    // Obtener los IDs únicos de los profesores a partir de las preguntas
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

    // Realizar las solicitudes para obtener los datos de los profesores
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

    // Actualizar el estado con los datos de los profesores
    setTeachers(teachersDict);
  }, [questions]);

  // Efecto para ejecutar la función de obtención de profesores cuando cambian las preguntas
  useEffect(() => {
    if (questions && Object.keys(questions).length > 0) {
      fetchTeachers();
    }
  }, [fetchTeachers, questions]);

  // Retornar los profesores obtenidos
  return teachers;
};

export default useFetchTeachers;

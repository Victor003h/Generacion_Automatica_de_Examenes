import { useState, useEffect } from "react";
import useFetchTeacherSubjects from "./useFetchTeacherSubjects";
import useFetchSubjects from "./useFetchSubjects";
import { Subject } from "../components/Interfaces";

// Hook personalizado para obtener asignaturas según el rol del usuario
const useFetchSubjectsByRole = (userId: string | null, role: string) => {
  // Estado para almacenar las asignaturas
  const [subjects, setSubjects] = useState<Subject[]>([]);
  // Estado para manejar el estado de carga
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para manejar errores
  const [error, setError] = useState<string | null>(null);

  // Obtener asignaturas para el rol de administrador
  const {
    subjects: adminSubjects,
    loading: adminLoading,
    error: adminError,
  } = useFetchSubjects();
  
  // Obtener asignaturas para el rol de profesor
  const {
    subjects: teacherSubjects,
    loading: teacherLoading,
    error: teacherError,
  } = useFetchTeacherSubjects(Number(userId));

  // Efecto para actualizar las asignaturas según el rol
  useEffect(() => {
    if (role === "admin") {
      setSubjects(adminSubjects);
      setLoading(adminLoading);
      setError(adminError);
    } else {
      setSubjects(teacherSubjects);
      setLoading(teacherLoading);
      setError(teacherError);
    }
  }, [
    role,
    adminSubjects,
    adminLoading,
    adminError,
    teacherSubjects,
    teacherLoading,
    teacherError,
  ]);

  // Retornar el estado de las asignaturas, carga y error
  return { subjects, loading, error };
};

export default useFetchSubjectsByRole;

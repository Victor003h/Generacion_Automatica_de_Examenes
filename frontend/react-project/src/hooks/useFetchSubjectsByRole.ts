import { useState, useEffect } from "react";
import useFetchTeacherSubjects from "./useFetchTeacherSubjects";
import useFetchSubjects from "./useFetchSubjects";
import { Subject } from "../components/Interfaces";

const useFetchSubjectsByRole = (userId: string | null, role: string) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {
    subjects: adminSubjects,
    loading: adminLoading,
    error: adminError,
  } = useFetchSubjects();
  const {
    subjects: teacherSubjects,
    loading: teacherLoading,
    error: teacherError,
  } = useFetchTeacherSubjects(userId);

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

  return { subjects, loading, error };
};

export default useFetchSubjectsByRole;

// Interface para las asignaturas
export interface Subject {
  id: number;
  name: string;
  study_program: string;
  course: number;
  head_of_subject: number;
  teachers_subject: number[];
}

// Interface para los estudiantes
export interface Student {
  id: number;
  first_name: string;
  email: string;
  last_name: string;
  last_name2: string;
  age: number;
  course: number;
}

// Interface para los profesores
export interface Teacher {
  id: number;
  first_name: string;
  email: string;
  last_name: string;
  last_name2: string;
  speciality: string;
}

// Interface para el estado del examen
export interface Exam_isdone {
  id: number;
  isDone: boolean;
}

// Interface para los exámenes
export interface Exam {
  id: number;
  type: string;
  date: string;
  state: string;
  validation_date: string;
  teacher: number;
  validation: number;
  subject: number;
  questions: number[];
}

// Interface para los exámenes realizados
export interface ExamDone {
  id: number;
  date: string;
  exam: number;
  student: number;
}

// Interface para las calificaciones de los exámenes
export interface ExamGrade {
  id: number;
  date: string;
  finalnote: number;
  examdone: number;
  teacher: number;
}

// Interface para las observaciones
export interface Observation {
  id: number;
  date: string;
  observations: string;
  checked: boolean;
  exam: number;
}

// Interface para los temas
export interface Topic {
  id: number;
  name: string;
  subject: number;
}

// Interface para las preguntas
export interface Question {
  id: number;
  content: string;
  type: string;
  difficulty: string;
  date: string;
  teacher: string;
  topic: number;
  subject: number;
}

// Interface para el usuario
export interface User {
  id: number;
  username: string;
  role: string;
}

// Interface para los cursos
export interface Course {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

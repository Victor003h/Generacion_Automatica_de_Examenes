// Interface para las asignaturas
export interface Subject {
  id: number;
  name: string;
  study_program: string;
  course: number;
  head_of_subject: number;
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

export interface Teacher {
  id: number;
  first_name: string;
  email: string;
  last_name: string;
  last_name2: string;
  speciality: string;
}

export interface Exam {
  id: number;
  type: string;
  date: string;
  teacher: number;
  validation: boolean;
  subject: number;
  questions: number[];
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
}

// Interface para el usuario
export interface User {
  id: number;
  username: string;
  role: string;
}

export interface Course {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

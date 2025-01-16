import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/DashboardContent/StudentsList.css";
import { Student } from "../../components/Interfaces";

const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/account/get/students"
        );
        setStudents(response.data);
      } catch (error) {
        console.error("Error al obtener los estudiantes:", error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="content-container">
      <div className="header">
        <h2>Listado de Estudiantes</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Curso</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.first_name}>
              {/* key tal vez no deberia ser first_name */}
              <td>{student.last_name}</td>
              <td>{student.last_name2}</td>
              <td>{student.email}</td>
              <td>{student.age}</td>
              <td>{student.course}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsList;

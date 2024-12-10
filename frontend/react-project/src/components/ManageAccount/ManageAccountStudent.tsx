import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import "../../styles/ManageAccount.css";

const ManageAccountStudent: React.FC = () => {
  const [formData, setFormData] = useState({
    username: localStorage.getItem("username") || "",
    email: localStorage.getItem("email") || "",
    password: "",
    passwordRepeat: "",
    lastname1: localStorage.getItem("lastname1") || "",
    lastname2: localStorage.getItem("lastname2") || "",
    age: localStorage.getItem("age") || "",
    course: localStorage.getItem("course") || "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = (field: string) => {
    const data = { [field]: formData[field as keyof typeof formData] };

    if (field === "password" && formData.password !== formData.passwordRepeat) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    axios
      .put(`http://localhost:8000/api/account/update/`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Actualización exitosa:", response.data);
        localStorage.setItem(field, formData[field as keyof typeof formData]);
      })
      .catch((error) => {
        console.error("Error al actualizar:", error);
      });
  };

  return (
    <div className="manage-account-container">
      <h2>Gestionar Cuenta (Estudiante)</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={() => handleUpdate("username")}>
            Actualizar
          </button>
        </div>
        <div className="form-group-horizontal">
          <div className="form-group-half">
            <label>Primer Apellido</label>
            <input
              type="text"
              name="lastname1"
              value={formData.lastname1}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={() => handleUpdate("lastname1")}>
              Actualizar
            </button>
          </div>
          <div className="form-group-half">
            <label>Segundo Apellido</label>
            <input
              type="text"
              name="lastname2"
              value={formData.lastname2}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={() => handleUpdate("lastname2")}>
              Actualizar
            </button>
          </div>
        </div>
        <div className="form-group">
          <label>Edad</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={() => handleUpdate("age")}>
            Actualizar
          </button>
        </div>
        <div className="form-group">
          <label>Curso</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={() => handleUpdate("course")}>
            Actualizar
          </button>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={() => handleUpdate("email")}>
            Actualizar
          </button>
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={() => handleUpdate("password")}>
            Actualizar
          </button>
        </div>
        <div className="form-group">
          <label>Repetir Contraseña</label>
          <input
            type="password"
            name="passwordRepeat"
            value={formData.passwordRepeat}
            onChange={handleChange}
            required
          />
        </div>
      </form>
    </div>
  );
};

export default ManageAccountStudent;

// Importa las librerías necesarias de React y otros módulos
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

// Define las propiedades del componente RegisterModal
interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
}

// Define el componente funcional para el modal de registro
const RegisterModal: React.FC<RegisterModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  // Maneja la selección del rol y navega a la página de registro correspondiente
  const handleRoleSelection = (role: string) => {
    navigate(`/register/${role}`);
    onClose();
  };

  // Renderiza el modal de registro
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Registrarse</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ¿Deseas registrarte como estudiante o profesor?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleRoleSelection("student")} color="primary">
          Estudiante
        </Button>
        <Button
          onClick={() => handleRoleSelection("professor")}
          color="primary"
        >
          Profesor
        </Button>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterModal;

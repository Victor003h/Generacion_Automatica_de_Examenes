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

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: string) => {
    navigate(`/register/${role}`);
    onClose();
  };

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

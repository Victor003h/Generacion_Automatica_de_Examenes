import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Hook personalizado para manejar el modal de registro
const useRegisterModal = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Abre el modal de registro
  const handleRegisterClick = () => {
    setOpen(true);
  };

  // Cierra el modal de registro
  const handleCloseModal = () => {
    setOpen(false);
  };

  // Maneja la selección del rol y redirige a la página de registro correspondiente
  const handleRoleSelection = (role: string) => {
    navigate(`/register_${role}`);
    setOpen(false);
  };

  return {
    open,
    handleRegisterClick,
    handleCloseModal,
    handleRoleSelection,
  };
};

export default useRegisterModal;

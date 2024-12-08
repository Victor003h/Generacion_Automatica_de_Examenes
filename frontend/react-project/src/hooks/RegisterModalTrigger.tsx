import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useRegisterModal = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleRegisterClick = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

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

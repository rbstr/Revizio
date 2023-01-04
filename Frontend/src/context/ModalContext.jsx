import React, { useContext, useState } from "react";
import { createContext } from "react";

const ModalContext = createContext();

export const ModalContextProvider = ({ children }) => {
  const [openModal, setOpenModal] = useState(false);
  const handleToggleModal = () => {
    setOpenModal(!openModal);
  };
  return (
    <ModalContext.Provider
      value={{ openModal, setOpenModal, handleToggleModal }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  return useContext(ModalContext);
};

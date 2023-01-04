import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [authForm, setAuthForm] = useState("login");
  const handleAuthForm = (form) => {
    setAuthForm(form);
  };
  return (
    <AuthContext.Provider value={{ authForm, handleAuthForm }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthFormContext = () => {
  return useContext(AuthContext);
};

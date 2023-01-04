import React, { useEffect, useState } from "react";
import "./sass/style.scss";
import { WebRoutes } from "routes";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SweetAlert from "react-bootstrap-sweetalert";
import { Typography, useTheme } from "@mui/material";
import { NotificationIcon } from "utils/icons";
import { useDispatch, useSelector } from "react-redux";
import { Slide } from 'react-toastify';

export const App = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const { uid } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  return (
    <>
      <WebRoutes/>
      <ToastContainer 
      position="top-center"
      autoClose={2000}
      transition={Slide}
      style={{ fontFamily: 'Poppins-Medium, sans-serif' }}
      />
    </>
  );
};

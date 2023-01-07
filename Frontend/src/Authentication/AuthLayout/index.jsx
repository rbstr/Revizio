import React from "react";
import { useModalContext } from "context/ModalContext";
import { useThemeContext } from "context/ThemeContext";
import { useAuthFormContext } from "context/AuthContext";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import logoLight from "assets/images/logo/logo-light.webp";
import logoDark from "assets/images/logo/logo-dark.webp";
import { FcGoogle } from "react-icons/fc";
import { Login } from "Authentication/Login";
import { Register } from "Authentication/Register";
import { ChevronLeftIcon } from "utils/icons";
import { useDispatch } from "react-redux";
import { loginWithGoogleAsyncThunk } from "redux/slices/authSlice";
import { ForgetPassword } from "Authentication/ForgetPassword";
import { BlurryDialogModal } from "utils/BlurryDialogModal";
import { useMediaQuery } from "@mui/material";

/**
  * Komponenta pro autentizaci
  *
  * @return {} komponenta
  */

export const AuthLayout = () => {
  const mobileScreen = useMediaQuery("(max-width:600px)");
  const dispatch = useDispatch();
  const { openModal, handleToggleModal } = useModalContext();

  const { authForm, handleAuthForm } = useAuthFormContext();
  const { selectedTheme } = useThemeContext();

  const handleGoogle = () => {
    if (authForm === "login") {
      dispatch(loginWithGoogleAsyncThunk({ handleToggleModal }));
    } else if (authForm === "register") {
      dispatch(loginWithGoogleAsyncThunk({ handleToggleModal }));
    }
  };

  return (
    <BlurryDialogModal
      fullWidth
      maxWidth={"xs"}
      open={openModal}
      scroll={"body"}
      style={{marginTop: mobileScreen ? -10 : 0}}
    >
      <Box sx={{ padding: { sm: "1rem" } }}>
        <DialogContent>
          {authForm !== "login" && (
            <Typography
              onClick={() => handleAuthForm("login")}
              className="pe-cursor mb-3"
              variant="body2"
              color="secondary"
            >
              <ChevronLeftIcon height="16" style = {{marginBottom:1.8}}  /> Zpět na přihlášení
            </Typography>
          )}

          <Typography variant="h2" align="center" className="text-capitalize">
            {authForm === "login"
              ? "Přihlášení"
              : authForm === "register"
              ? "Registrace"
              : "Zapomenuté heslo"}
          </Typography>
          <Box className="my-4">
            {authForm !== "forgetPassword" && (
              <>
                <Stack direction="column" spacing={2}>
                  <Button
                    variant="outlined"
                    color={"inherit"}
                    startIcon={<FcGoogle />}
                    onClick={handleGoogle}
                    sx={{ paddingY: ".5rem", borderColor: "#c4c4c4" }}
                  >
                    Pokračovat s Google
                  </Button>
                </Stack>
                <Divider className="my-4">
                  <Typography color="secondary" sx={{ fontSize: 12 }}>nebo</Typography>
                </Divider>
              </>
            )}
            {authForm === "login" ? (
              <Login />
            ) : authForm === "register" ? (
              <Register />
            ) : (
              <ForgetPassword />
            )}
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <img
              src={selectedTheme === "light" ? logoDark : logoLight}
              alt="Logo"
              style={{width:90, marginBottom: mobileScreen ? 10: 0}}
            />
          </Box>
        </DialogContent>
      </Box>
    </BlurryDialogModal>
  );
};

import React from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useAuthFormContext } from "context/AuthContext";
import { InputField } from "utils/InputField";
import { useDispatch } from "react-redux";
import { loginAsyncThunk } from "redux/slices/authSlice";
import CustomButton from "components/CustomComponents/CustomButton";
import { useModalContext } from "context/ModalContext";
import useYupValidationResolver from "schema/useYupValidationResolver";
import { loginSchema } from "schema";
import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";


/**
  * Komponenta pro přihlášení
  *
  * @return {} komponenta
  */


export const Login = () => {
  const mobileScreen = useMediaQuery("(max-width:600px)");
  const theme = useTheme();
  const dispatch = useDispatch();
  const { handleToggleModal } = useModalContext();
  const { handleAuthForm } = useAuthFormContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: useYupValidationResolver(loginSchema),
  });
  const onSubmit = (data) =>
    dispatch(loginAsyncThunk({ data, handleToggleModal }));

  return (
    <>
      <Box component="form" noValidate autoComplete="off">
        <Stack direction={"column"} spacing={2}>
          <InputField
            id="email"
            type={"email"}
            label={errors.email?.message ?? "Emailová adresa"}
            {...register("email", {
              required: true,
              pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
            })}
            error={
              errors.email
              // ?.type === "required" || errors.email ? true : false
            }
          />

          <InputField
            id="password"
            type={"password"}
            label={errors.password?.message ?? "Heslo"}
            {...register("password", { required: true })}
            error={
              errors.password
              // ?.type === "required" ? true : false
            }
          />
          <CustomButton
            reducer="auth"
            action="loginAsyncThunk"
            title="Přihlásit se"
            onClick={handleSubmit(onSubmit)}
            btnProps={{ variant: "contained", size: "large", fullWidth: true }}
          />
        </Stack>
      </Box>
      <Typography
        variant="body2"
        align="center"
        color="secondary"
        className="mt-3"
      >
        Ještě nemáš účet?{" "}
        <Box
          component={"span"}
          className="pe-cursor fw-bold"
          onClick={() => handleAuthForm("register")}
        >
          Zaregistruj se nyní!
        </Box>
        <Typography
          variant="body2"
          align="center"
          color="secondary"
          className="pe-cursor fw-bold"
          onClick={() => handleAuthForm("forgetPassword")}
        >
          Zapomněl jsi heslo?
        </Typography>
      </Typography>
    </>
  );
};

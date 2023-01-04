import React from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useAuthFormContext } from "context/AuthContext";
import { InputField } from "utils/InputField";
import CustomButton from "components/CustomComponents/CustomButton";
import { useDispatch } from "react-redux";
import { sendPasswordResetEmailAsyncThunk } from "redux/slices/authSlice";

export const ForgetPassword = () => {
  const { handleAuthForm } = useAuthFormContext();
  const d = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    // handleAuthForm("login");
    //console.log(data);
    d(sendPasswordResetEmailAsyncThunk(data));
  };

  return (
    <>
      <Box component="form" noValidate autoComplete="off" marginBottom={10}>
        <Stack direction={"column"} spacing={3}>
          <Typography variant="subtitle2" textAlign="center" color="secondary" style={{marginTop: -10}}>
            Neboj se! To se stává. Prosím vyplň tvoji emailovou adresu a my Ti pošleme odkaz na obnovu hesla.
          </Typography>
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

          <CustomButton
            reducer={"auth"}
            action={"sendPasswordResetEmailAsyncThunk"}
            title="Obnovit heslo"
            onClick={handleSubmit(onSubmit)}
            btnProps={{ variant: "contained", size: "large", fullWidth: true }}
          />
        </Stack>
      </Box>
    </>
  );
};

import React from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { InputField } from "utils/InputField";
import { useDispatch } from "react-redux";
import { registerAsyncThunk } from "redux/slices/authSlice";
import CustomButton from "components/CustomComponents/CustomButton";
import { useModalContext } from "context/ModalContext";
import useYupValidationResolver from "schema/useYupValidationResolver";
import { registerSchema } from "schema";


/**
  * Komponenta pro registraci
  *
  * @return {} komponenta
  */


export const Register = () => {
  const dispatch = useDispatch()
  const { handleToggleModal } = useModalContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: useYupValidationResolver(registerSchema)
  });
  const onSubmit = (data) => dispatch(registerAsyncThunk({ data, handleToggleModal }));

  return (
    <Box component="form" noValidate autoComplete="off">
      <Stack direction={"column"} spacing={2}>
        <InputField
          id="firstName"
          type={"text"}
          label={errors.firstName?.message ?? "Křestní jméno"}
          {...register("firstName", { required: true })}
          error={errors.firstName}
        />

        <InputField
          id="lastName"
          type={"text"}
          label={errors.lastName?.message ?? "Přijmení"}
          {...register("lastName", { required: true })}
          error={errors.lastName}
        />

        <InputField
          id="email"
          //InputLabelProps={{ disableAnimation: view ? true : false }}
          label={errors.email?.message ?? "Emailová adresa"}
          //disabled={profileFormType === "view"}
          type="email"
          {...register("email", {
            required: true,
            pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
          })}
          error={
            errors.email?.type === "required" || errors.email
              ? true
              : false
          }
        />

        <InputField
          id="password"
          type={"text"}
          label={errors.password?.message ?? "Heslo"}
          {...register("password", { required: true })}
          error={errors.password}
        />

        <InputField
          id="confirmPassword"
          type={"text"}
          label={errors.confirmPassword?.message ?? "Potvrzení hesla"}
          {...register("confirmPassword", { required: true })}
          error={errors.confirmPassword}
        />

        <CustomButton
          reducer="auth"
          action="registerAsyncThunk"
          title="Zaregistrovat se"
          onClick={handleSubmit(onSubmit)}
          btnProps={{ variant: "contained", size: "large", fullWidth: true }}
        />
      </Stack>
    </Box>
  );
};

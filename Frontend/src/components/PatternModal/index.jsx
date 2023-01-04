import React, { useEffect } from "react";
import DialogContent from "@mui/material/DialogContent";
import { useModalContext } from "context/ModalContext";
import {
  Box,
  Button,
  DialogTitle,
  Divider,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { GridSection } from "components/GridSection";
import { InputField } from "utils/InputField";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  createPatternAsyncThunk,
  renamePatternAsyncThunk,
  setPatternIdToEdit,
} from "redux/slices/patterSlice";
import CustomButton from "components/CustomComponents/CustomButton";
import { BlurryDialogModal } from "utils/BlurryDialogModal";
import { useTheme } from "@mui/material";

export const PatternModal = ({ type }) => {

  const theme = useTheme();
  const dispatch = useDispatch();
  const { patternIdToEdit } = useSelector((s) => s.pattern);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    return () => {
      dispatch(setPatternIdToEdit(null));
    };
  }, []);
  const onSubmit = (data) => {
    patternIdToEdit
      ? dispatch(
          renamePatternAsyncThunk({
            data,
            id: patternIdToEdit,
            handleNext: handleToggleModal,
          })
        )
      : dispatch(
          createPatternAsyncThunk({
            type,
            data,
            handleNext: handleToggleModal,
          })
        );
  };
  const { openModal, handleToggleModal } = useModalContext();

  return (
    <BlurryDialogModal
      fullWidth
      maxWidth={"xs"}
      open={openModal}
      scroll={"body"}
    >
      <DialogTitle variant="h5" sx={{marginBottom: -2}}>
        {patternIdToEdit ? "Přejmenovat vzor" : "Uložit jako vzor"}
      </DialogTitle>
      <DialogContent>
      <Divider sx={{ 
          borderColor: theme.palette.secondary.main, 
          borderBottomWidth: 1.5, opacity: 0.5, marginTop: 1, marginBottom: 3 }} />
        <GridSection>
          <Grid item xs={12}>
            <InputField
              id="patternName"
              label="Název vzoru"
              {...register("patternName", { required: true })}
              error={errors.patternName?.type === "required" ? true : false}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ textAlign: "end" }}>
              <Button
                onClick={() => {
                  handleToggleModal();
                  dispatch(setPatternIdToEdit(null));
                }}
                color={"secondary"}
                sx={{fontWeight:500}}
              >
                Zrušit
              </Button>

              <CustomButton
                reducer="pattern"
                action="createPatternAsyncThunk"
                title="Uložit"
                onClick={handleSubmit(onSubmit)}
                btnProps={{
                  variant: "contained",
                  size: "medium",
                  autoFocus: true,
                }}
              />
            </Box>
          </Grid>
        </GridSection>
      </DialogContent>
    </BlurryDialogModal>
  );
};

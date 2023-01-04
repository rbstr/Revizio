import React from "react";
import DialogContent from "@mui/material/DialogContent";
import { useModalContext } from "context/ModalContext";
import { Box, Button, DialogTitle, Divider, Grid } from "@mui/material";
import { GridSection } from "components/GridSection";
import { InputField2 } from "utils/InputFieldHigher";
import { InputField } from "utils/InputField";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createDefectAsyncThunk } from "redux/slices/defectSlice";
import CustomButton from "components/CustomComponents/CustomButton";
import { BlurryDialogModal } from "utils/BlurryDialogModal";
import { useTheme } from "@emotion/react";

export const DefectModal = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(
      createDefectAsyncThunk({
        data,
        handleToggleModal,
      })
    );
  };
  const { openModal, handleToggleModal } = useModalContext();

  const theme = useTheme();

  return (
    <BlurryDialogModal
      fullWidth
      maxWidth={"xs"}
      open={openModal}
      scroll={"body"}
    >
      <DialogTitle variant="h5" sx={{marginBottom: -2}}>
        Vytvořit novou závadu
      </DialogTitle>
      <DialogContent>
      <Divider sx={{ 
          borderColor: theme.palette.secondary.main, 
          borderBottomWidth: 1.5, opacity: 0.5, marginTop: 1, marginBottom: 3 }} />
        <GridSection>
          <Grid item xs={12}>
            <InputField
              id="abbreviatedName"
              label="Zkrácený název"
              {...register("abbreviatedName", { required: true })}
              error={errors.abbreviatedName?.type === "required" ? true : false}
              helperText="Název zobrazený v seznamu"
            />
          </Grid>
          <Grid item xs={12}>
            <InputField2
              id="defectDescription"
              label="Popis závady"
              helperText="Popis závady v revizní zprávě"
              multiline
              rows={4}
              {...register("defectDescription", { required: true })}
              error={
                errors.defectDescription?.type === "required" ? true : false
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ textAlign: "end" }}>
              <Button onClick={handleToggleModal} color={"secondary"}>
                Zrušit
              </Button>
              <CustomButton
                onClick={handleSubmit(onSubmit)}
                btnProps={{ autoFocus: true, variant: "contained" }}
                title={"Uložit"}
                reducer={"defect"}
                action={"createDefectAsyncThunk"}
              />
            </Box>
          </Grid>
        </GridSection>
      </DialogContent>
    </BlurryDialogModal>
  );
};

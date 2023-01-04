import React, { useState } from "react";
import DialogContent from "@mui/material/DialogContent";
import { useModalContext } from "context/ModalContext";
import {
  Box,
  Button,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { GridSection } from "components/GridSection";
import { InputField } from "utils/InputField";
import { useForm } from "react-hook-form";
import { useTheme } from "@emotion/react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { resetRevisionForm } from "redux/slices/revisionSlice";
import { createRevisionAsyncThunk } from "redux/slices/revisionSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BlurryDialogModal } from "utils/BlurryDialogModal";

export const EmailModal = ({
  type,
  open,
  toggleOpen,
  staticPDF,
  email,
  subject,
}) => {
  const {
    revisionForm: {
      [type]: { pdfUrl, basicInformation }, 
    }, 
  } = useSelector((state) => state.revision);


  const mobileScreen = useMediaQuery("(max-width:600px)");
  //console.log("basicInformation", basicInformation);
  const { profile } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, seIsLoading] = useState(false);

  const clientData = {
    email: email ?? basicInformation?.email,
    subject: subject ?? `Revizní zpráva - ${moment().format("DD. MM. YYYY")}`,
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: clientData,
  });

  const onSubmit = async (data) => {
    try {
      seIsLoading((_) => true);
      await fetch(
        "https://us-central1-revizio-9d3ba.cloudfunctions.net/sendEmail",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            fileUrl: staticPDF ?? pdfUrl,
            text: `
        Vážený zákazníku,
        <br/>
        <br/>
        ${data.text}
        <br/>
        <br/>
        S přátelským pozdravem
        <br/>
        <br/>
        <b>${profile?.firstName + " " + profile?.lastName}</b>
        <p><a style="margin: 0;font-size: 1rem;font-weight: 400;line-height: 1.5;color: #C4C4C4;" href="tel:${
          profile?.telephoneNumber
        }"><b>${profile?.telephoneNumber}</b></a></p>
        <p><a style="margin: 0;font-size: 1rem;font-weight: 400;line-height: 1.5;color: #C4C4C4;" href="mailto:${
          profile?.email
        }"><b>${profile?.email}</b></a></p>
        <br/>
        <p style="font-size: 13px;">*Tento email je odeslán automaticky, prosím neodpovídejte na něj..</p>
        `,
          }),
        }
      );
      seIsLoading((_) => false);
      toggleOpen ? toggleOpen() : handleToggleModal();
      dispatch(resetRevisionForm());
      toast.success("Email úspěšně odeslán!");
    } catch (error) {
      seIsLoading((_) => false);
      toast.error(error.message);
    }
  };
  const { openModal, handleToggleModal } = useModalContext();
  const theme = useTheme();

  return (
    <BlurryDialogModal
      fullWidth
      maxWidth={"sm"}
      open={open ?? openModal}
      scroll={"body"}
      sx={{marginTop: mobileScreen? -1 : 0}}
    >
      <DialogTitle variant="h5" sx={{marginBottom: -2}}>Odeslat email</DialogTitle>
      <DialogContent>
      <Divider sx={{ 
          borderColor: theme.palette.secondary.main, 
          borderBottomWidth: 1.5, opacity: 0.5, marginTop: 1, marginBottom: 3 }} />
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <GridSection>
              <Grid item xs={6}>
                <InputField
                  id="email"
                  label="Adresa klienta"
                  defaultValue={clientData.email}
                  {...register("email")}
                  error={errors.email?.type === "required" ? true : false}
                />
              </Grid>
              <Grid item xs={6}>
                <InputField
                  id="subject"
                  label="Předmět emailu"
                  defaultValue={clientData.subject}
                  {...register("subject", { required: true })}
                  error={errors.subject?.type === "required" ? true : false}
                />
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: `1px solid ${theme.palette.secondary.main}`,
                    padding: 2,
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={"600"}
                    sx={{ marginBottom: 3 }}
                  >
                    Vážený zákazníku,
                  </Typography>
                  {/* <Typography variant="body1" fontWeight={"600"}>
                    {cleintData.data}
                  </Typography> */}

                  <TextField
                    id="text"
                    multiline
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    variant="filled"
                    InputProps={{ disableUnderline: true }}
                    sx={{
                      "& .MuiFilledInput-root": {
                        background: "none",
                        padding: 0,
                      },
                    }}
                    placeholder="Zde napiš svou zprávu ..."
                    minRows={4}
                    defaultValue={``}
                    {...register("text", { required: true })}
                    error={errors.text?.type === "required" ? true : false}
                  />
                  <Typography
                    variant="body1"
                    fontWeight={"500"}
                    sx={{ marginTop: 3 }}
                  >
                    S přátelským pozdravem
                  </Typography>
                  <Typography variant="body1" fontWeight={"500"} sx={{marginTop:1.5}}>
                    {profile?.firstName + " " + profile?.lastName}
                  </Typography>
                  <Typography variant="body1" color="secondary">
                    {profile?.telephoneNumber}
                  </Typography>
                  <Typography variant="body1" color="secondary">
                    {profile?.email}
                  </Typography>
                  <Typography
                    color="secondary"
                    variant="subtitle2"
                    sx={{ marginTop: 3 }}
                  >
                    *tento email je odeslán automaticky, prosím neodpovídejte na něj.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ textAlign: "end" }}>
                  <Button
                    onClick={toggleOpen ? toggleOpen : handleToggleModal}
                    color={"secondary"}
                    disableElevation
                    sx={{ marginRight: 1, fontWeight: 500}}
                  >
                    Zrušit
                  </Button>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    autoFocus
                    variant="contained"
                    disableElevation
                    sx={{fontWeight: 500}}
                  >
                    {isLoading ? "Odesílám..." : "Odeslat"}
                  </Button>
                </Box>
              </Grid>
            </GridSection>
          </Grid>
        </Grid>
      </DialogContent>
    </BlurryDialogModal>
  );
};

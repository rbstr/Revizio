import React, { useEffect, useMemo } from "react";
import DialogContent from "@mui/material/DialogContent";
import { useModalContext } from "context/ModalContext";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { GridSection } from "components/GridSection";
import { InputField } from "utils/InputField";
import { InputField2 } from "utils/InputFieldHigher";
import { Controller, useForm } from "react-hook-form";
import { CustomSwitch } from "utils/CustomSwitch";
import { Stack } from "@mui/system";
import { useTheme } from "@emotion/react";
import { setPerformedTests } from "redux/slices/revisionSlice";
import { useDispatch, useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "config/firebase";
import { BlurryDialogModal } from "utils/BlurryDialogModal";
import styled from "@emotion/styled";
import { InputAdornment } from '@mui/material';

export const PresureTestModal = () => {
  const mobileScreen = useMediaQuery("(max-width:600px)");
  const theme = useTheme();
  const {
    revisionForm: {
      initial: { performedTests, performedTestsId },
    },
  } = useSelector((state) => state.revision);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: useMemo(() => {
      return {
        ...performedTests,
        // removeDefectsBefore: performedTests.removeDefectsBefore ? (typeof performedTests.removeDefectsBefore == "object" ? moment(performedTests.removeDefectsBefore.seconds * 1000).toISOString() + "T00:00:00.000Z" : performedTests.removeDefectsBefore) : moment().toISOString() + "T00:00:00.000Z"
      };
    }, [performedTests]),
  });

  // fetch test
  const fetchAndSetTest = async () => {
    const docRef = doc(firestore, "performedTests", performedTestsId);
    const client = await getDoc(docRef);
    if (client.exists()) reset(client.data());
  };

  useEffect(() => {
    if (performedTestsId && !performedTests) fetchAndSetTest();
    if (performedTests && Object.keys(performedTests).length) {
      //console.log("performedTests:", performedTests);
      reset({
        ...performedTests,
        // removeDefectsBefore: performedTests.removeDefectsBefore ? (typeof performedTests.removeDefectsBefore == "object" ? moment(performedTests.removeDefectsBefore.seconds * 1000).toISOString() + "T00:00:00.000Z" : performedTests.removeDefectsBefore) : moment().toISOString() + "T00:00:00.000Z"
      });
    }
  }, [performedTests]);
  const onSubmit = (data) => {
    handleToggleModal();
    dispatch(setPerformedTests({ data, type: "initial" }));
    //console.log(data);
  };
  const { openModal, handleToggleModal } = useModalContext();

  const mobleScreen = useMediaQuery("(max-width:600px)");

  const BlurryDialog = styled(Dialog)(({ theme }) => ({
    backdropFilter: "blur(5px)",
    "& .MuiPaper-root": mobleScreen
      ? {
        width: "calc(100% - 24px)",
        minWidth: "calc(100% - 24px)",
        maxWidth: "calc(100% - 24px)",
        margin: 1.5,
        verticalAlign: "top",
        top: 16,
      }
      : { verticalAlign: "top", top: 0.5 },
    "& .MuiDialogContent-root": mobleScreen && {
      padding: theme.spacing(2),
    },
  }));

  return (
    <BlurryDialogModal
      fullWidth
      maxWidth={"sm"}
      open={openModal}
      scroll={"body"}
      style={{marginTop: mobileScreen ? -10 : 0}}
    >
      <DialogTitle sx={{ paddingX: { xs: 1.5, sm: 4 }, marginTop: 2 }} variant="p1">
        Tlaková zkouška
        <Divider sx={{ borderColor: theme.palette.secondary.main, borderBottomWidth: 1.5, opacity: 0.5, marginTop: 1, marginBottom: 1 }} />
      </DialogTitle>
      <DialogContent sx={{ paddingX: { xs: 1.5, sm: 4 } }}>
        <Grid container spacing={{ xs: 3, sm: 5 }}>
          <Grid item xs={12}>
            <GridSection
              title={"Základní údaje"}
              titleVariant="h5"
              marginBottom="mb-3 mb-sm-4"
            >
              <Grid item xs={6}>
                <InputField
                  id="evidenceNumber"
                  label="Evidenční číslo"
                  {...register("evidenceNumber", { required: true })}
                  error={
                    errors.evidenceNumber?.type === "required" ? true : false
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <InputField
                  id="assemblyBy"
                  label="Montážní práce"
                  {...register("assemblyBy", { required: true })}
                  error={errors.assemblyBy?.type === "required" ? true : false}
                />
              </Grid>
              <Grid item xs={12}>
                <InputField2
                  id="technicalValueOfDevice"
                  label="Technické hodnoty zařízení"
                  multiline
                  rows={4}
                  {...register("technicalValueOfDevice", { required: true })}
                  error={
                    errors.technicalValueOfDevice?.type === "required"
                      ? true
                      : false
                  }
                />
              </Grid>
            </GridSection>
          </Grid>

          <Grid item xs={12}>
            <GridSection
              title={"Provedené zkoušky"}
              titleVariant="h5"
              marginBottom="mb-3 mb-sm-4"
            >
              <Grid item xs={6}>
                <Box
                  border={1}
                  borderRadius={1}
                  padding={{ xs: 1, sm: 2 }}
                  borderColor={theme.palette.secondary.main}
                >
                  <GridSection
                    align="center"
                    title={"Zkouška pevnosti"}
                    titleVariant="h6"
                    spacing={2}
                    marginBottom="mb-2"
                  >
                    <Grid item xs={12}>
                      <InputField
                        id="strengthTestedPressure"
                        label="Zkušební tlak"
                        {...register("strengthTestedPressure", {
                          required: true,
                        })}
                        error={
                          errors.strengthTestedPressure?.type === "required"
                            ? true
                            : false
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputField
                        id="strengthDuration"
                        label="Délka"
                        //type="number"
                        {...register("strengthDuration", { required: true })}
                        error={
                          errors.strengthDuration?.type === "required"
                            ? true
                            : false
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Stack
                        direction="row"
                        justifyContent={{ xs: "center", sm: "center" }}
                        alignItems={"center"}
                        spacing={2}
                      >
                        <Typography variant="subtitle2">
                          Výsledek
                          <Typography
                            as="span"
                            sx={{ display: { xs: "none", sm: "inline-block" } }}
                          >
                          </Typography>
                        </Typography>
                        <Controller
                          control={control}
                          name="strengthResult"
                          defaultValue={getValues("strengthResult") ?? false}
                          checked={getValues("strengthResult") ?? false}
                          render={({ field }) => (
                            <>
                              <CustomSwitch
                                {...field}
                                checked={getValues("strengthResult") ?? false}
                              />
                            </>
                          )}
                        />
                      </Stack>
                    </Grid>
                  </GridSection>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  border={1}
                  borderRadius={1}
                  padding={{ xs: 1, sm: 2 }}
                  borderColor={theme.palette.secondary.main}
                >
                  <GridSection
                    align="center"
                    title={"Zkouška těsnosti"}
                    titleVariant="h6"
                    spacing={2}
                    marginBottom="mb-2"
                  >
                    <Grid item xs={12}>
                      <InputField
                        id="leakTestedPressure"
                        label="Zkušební tlak"
                        {...register("leakTestedPressure", { required: true })}
                        error={
                          errors.leakTestedPressure?.type === "required"
                            ? true
                            : false
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputField
                        id="leakDuration"
                        label="Délka"
                        //type="number"
                        {...register("leakDuration", { required: true })}
                        error={
                          errors.leakDuration?.type === "required"
                            ? true
                            : false
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Stack
                        direction="row"
                        justifyContent={{ xs: "center", sm: "center" }}
                        alignItems={"center"}
                        spacing={2}
                      >
                        <Typography variant="subtitle2">
                          Výsledek
                          <Typography
                            as="span"
                            sx={{ display: { xs: "none", sm: "inline-block" } }}
                          >
                          </Typography>
                        </Typography>
                        <Controller
                          control={control}
                          name="leakTestResult"
                          defaultValue={getValues("leakTestResult") ?? false}
                          render={({ field }) => (
                            <>
                              <CustomSwitch
                                {...field}
                                checked={getValues("leakTestResult") ?? false}
                              />
                            </>
                          )}
                        />
                      </Stack>
                    </Grid>
                  </GridSection>
                </Box>
              </Grid>
            </GridSection>
          </Grid>
          <Grid item xs={12}>
            <Stack
              direction="row"
              justifyContent={"center"}
              alignItems={"center"}
              spacing={2}
            >
              <Typography variant="body2">Celkové hodnocení</Typography>
              <Controller
                control={control}
                name="overallRating"
                defaultValue={getValues("overallRating") ?? false}
                render={({ field }) => (
                  <>
                    <CustomSwitch
                      {...field}
                      checked={getValues("overallRating") ?? false}
                    />
                  </>
                )}
              />
            </Stack>{" "}
          </Grid>
        </Grid>
        <DialogActions sx={{ marginTop: 1 }}>
          <Button
            onClick={handleToggleModal}
            color={"secondary"}
            style={{ fontWeight: 500, marginRight: mobileScreen ? -5 : 0 }}>
            Zrušit
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            autoFocus
            variant="contained"
            disableElevation
            style={{ fontWeight: 500 }}
          >
            Uložit
          </Button>
        </DialogActions>
      </DialogContent>
    </BlurryDialogModal>
  );
};

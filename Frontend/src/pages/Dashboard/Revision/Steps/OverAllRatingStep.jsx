import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { GridSection } from "components/GridSection";
import { InputField } from "utils/InputField";
import { StepButtons } from "components/StepButtons";
import { InputDatePicker } from "utils/InputDatePicker";
import {
  FormControlLabel,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { Stack } from "@mui/system";
import { SignatureIcon } from "utils/icons";
import { InputBoxSwitch } from "utils/InputBoxSwitch";
import { useDispatch, useSelector } from "react-redux";
import { setAdditionalInformation } from "redux/slices/revisionSlice";
import useYupValidationResolver from "schema/useYupValidationResolver";
import { additionalInfoSchema } from "schema";
import { useModalContext } from "context/ModalContext";
import { SignatureModal } from "components/SignatureModal";
import { revisionTypes } from "utils/common";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
import moment from "moment";
import { CalendarIcon } from "utils/icons";
import { InputField2 } from "utils/InputFieldHigher";
import { ReactHookFormSelect } from "utils/SelectField";
import "dayjs/locale/cs";
import { nextRevisionDate } from "schema/fields";

export const OverAllRatingStep = ({
  type,
  activeStep,
  handleBack,
  handleNext,
}) => {
  // redux
  const {
    revisionForm: {
      [type]: { additionalInformation },
    },
  } = useSelector((state) => state.revision);
  const mobileScreen = useMediaQuery("(max-width:600px)");
  const dispatch = useDispatch();
  const lgScreen = useMediaQuery("(min-width:900px)");
  const theme = useTheme();
  const { handleToggleModal } = useModalContext();
  // Signature
  const [signImg, setSignImg] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    resolver: useYupValidationResolver(additionalInfoSchema),

    defaultValues: useMemo(() => {
      return { ...additionalInformation };
    }, [additionalInformation]),
  });
  // if additionalInformation data is change reet form
  useEffect(() => {
    if (additionalInformation && Object.keys(additionalInformation).length) {
      reset({ ...additionalInformation });
    }
  }, [additionalInformation]);

  useEffect(()=> {
    if(additionalInformation.nextRevisionDate) {
      setValue("nextRevisionDate", moment(additionalInformation.nextRevisionDate).toISOString())
    } else {
      setValue("nextRevisionDate", moment().add(3, "year").toISOString())
    }
  }, [])


  const onSubmit = (data) => {
    //console.log("data:", data);
    if (!signImg) return toast.error("Prosím nejdříve revizi podepiš.");
    dispatch(setAdditionalInformation({ data, type, signImg }));
    handleNext();
  };

  const onSubmit2 = (data) => {
    //console.log("tohle jsou data:", data);
    dispatch(setAdditionalInformation({ data, type, signImg }));
    handleBack();
  };

  const previousDefectsOptions = [
    { name: "Předchozí závady částečně odstraněny", value: "Závady z předchozí revize částečně odstraněny." },
    { name: "Předchozí závady neodstraněny", value: "Závady z předchozí revize neodstraněny." },
  ];

  return (
    <>
      <Box sx={{ flexGrow: 1 }} component="form" noValidate autoComplete="off">
        <Grid container spacing={{ xs: 3, sm: 7 }}>
          <Grid item xs={12}>
            <GridSection title="Doplňující informace">
              {type === revisionTypes.service && (
                <Grid item xs={6} md={4}>
                  <ReactHookFormSelect
                      id="previousDefects"
                      label={errors?.threadType?.message ?? "Předchozí závady"}
                      error={errors?.threadType}
                      name="Previous defects"
                      {...register("previousDefects", { required: true })}
                      control={control}
                      options={previousDefectsOptions}
                      renderValue={(value) => value}
                    />
                </Grid>
              )}
              <Grid item xs={12} sm={6} md={4}>
              <InputField2
                  id="previousRevision"
                  label={errors.previousRevision?.message ?? "Ostatní doložené revize"}
                  {...register("previousRevision", { required: true })}
                  multiline
                  maxRows={4}
                  error={
                    errors.previousRevision?.type === "required" ? true : false
                  }
                />

              </Grid>
              <Grid item xs={12} sm={6} md={4}>
              <InputField2
                  id="otherInformation"
                  label={errors.otherInformation?.message ?? "Doplňující informace"}
                  {...register("otherInformation", { required: true })}
                  multiline
                  maxRows={4}
                  error={
                    errors.otherInformation?.type === "required" ? true : false
                  }
                />
              </Grid>
            </GridSection>
          </Grid>
          <Grid item xs={12}>
            <GridSection title="Celkové hodnocení">
              <Grid item xs={6} md={4}>
                <Controller
                  name="deviceSafe"
                  defaultValue={true}
                  control={control}
                  render={({ field,fieldState }) => (
                    <FormControlLabel
                  sx={{ display: "block", margin: 0, fontWeight: 500}}
                  title={
                    fieldState?.error?.message ?? lgScreen ? "Zařízení je bezpečné" : "Bezpečné zařízení"
                  }
                  error={errors.deviceSafe}
                  control={
                    <InputBoxSwitch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      title={
                        fieldState?.error?.message ??
                        lgScreen ? "Zařízení je bezpečné" : "Bezpečné zař."
                      }
                    />
                  }
                />
                  )}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <Controller
                  name={"nextRevisionDate"}
                  control={control}
                  {...register("nextRevisionDate", { required: true })}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="cs">
                      <DesktopDatePicker
                        label={"Termín příští revize"}
                        control={control}
                        components={{
                          OpenPickerIcon: CalendarIcon
                        }}
                        OpenPickerButtonProps={{style: { color: theme.palette.secondary.primary,
                          marginRight: mobileScreen ? -10 : 1,
                          } }}
                        inputFormat="DD. MM. YYYY"
                        value={value}
                        onChange={(event) => {
                          onChange(event?.toISOString())
                        }}
                        renderInput={(params) => (
                          <InputField
                            {...params}
                            InputProps={{
                              ...params?.InputProps,
                              disableUnderline: true,
                            }}
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                {/* <Controller
                        name={"nextRevisionDate"}
                        control={control}
                        defaultValue={getValues("nextRevisionDate") ? (typeof getValues("nextRevisionDate") == "object" ? moment(getValues("nextRevisionDate").seconds * 1000).toISOString() : moment(getValues("nextRevisionDate")).toISOString()) : moment().toISOString()}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <LocalizationProvider
                            dateAdapter={AdapterDayjs} >
                            <DesktopDatePicker
                              label={"Next Revision Date"}
                              control={control}
                              inputFormat="DD-MM-YYYY"
                              value={value}
                              onChange={(event) => {
                                try {
                                  onChange(event?.toISOString());
                                } catch (error) {

                                }
                              }}
                              renderInput={(params) => <InputField {...params} InputProps={{
                              ...params?.InputProps,
                              disableUnderline: true,
                            }} error={!!error} helperText={error?.message} />}
                            />
                          </LocalizationProvider>
                        )} /> */}
              </Grid>
              <Grid item xs={6} md={4}>
                <Box>
                  <Stack
                    direction="row"
                    justifyContent={"space-between"}
                    alignItems="center"
                    sx={{
                      background: theme.palette.primary.main,
                      borderRadius: mobileScreen ? 1.5 :  1.25,
                      height: mobileScreen ? 45 :  60,
                      padding: 2,
                    }}
                    fullWidth
                    className="pe-cursor"
                    onClick={handleToggleModal}
                  >
                    <Typography variant="body2" color="white">
                      Přidat podpis
                    </Typography>
                    <Typography color="white">
                      <SignatureIcon width="20" height="20" />
                    </Typography>
                  </Stack>
                  {signImg && (
                    <Typography
                      variant="subtitle2"
                      textAlign={"end"}
                      color="secondary"
                      marginTop={mobileScreen? 0.5 : 1}
                    >
                      Podpis uložen
                    </Typography>
                  )}
                </Box>
              </Grid>
            </GridSection>
          </Grid>
        </Grid>
      </Box>
      <SignatureModal setSignImg={setSignImg} />

      <StepButtons
        activeStep={activeStep}
        handleBack={handleBack}
        handleNext={handleSubmit(onSubmit)}
        mobileScreen
      />
    </>
  );
};

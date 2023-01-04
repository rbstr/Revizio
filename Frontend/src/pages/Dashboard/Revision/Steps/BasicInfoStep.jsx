import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { GridSection } from "components/GridSection";
import { InputField } from "utils/InputField";
import { StepButtons } from "components/StepButtons";
import { ReactHookFormSelect } from "utils/SelectField";
// import { MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setBasicInformation } from "redux/slices/revisionSlice";
import useYupValidationResolver from "schema/useYupValidationResolver";
import { basicInfoStepSchema } from "schema";
import { firestore } from "config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { ConfirmationModal } from "components/ConfirmationModal";
import { useModalContext } from "context/ModalContext";
import { FormControl, InputLabel, MenuItem, Select, Typography, useMediaQuery } from "@mui/material";

export const BasicInfoStep = ({ type, activeStep, handleBack, handleNext }) => {
  const mobileScreen = useMediaQuery("(max-width:600px)");
  const [isLoading, setisLoading] = useState(false);
  const { handleToggleModal } = useModalContext();
  // redux
  const {
    revisionForm: {
      [type]: { basicInformation, clientId },
    },
  } = useSelector((state) => state.revision);
  const { uid } = useSelector((state) => state.auth);

  //console.log("basicInformation", basicInformation);

  var editRev = true;

  if (!basicInformation) {
    editRev = true;
  } else editRev = false;

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: useYupValidationResolver(basicInfoStepSchema),
    defaultValues: useMemo(() => {
      return Object.keys(basicInformation ?? {})?.length
        ? basicInformation
        : {};
    }, [basicInformation]),
  });

  // if basicInformation data is change reet form
  useEffect(() => {
    if (basicInformation && Object.keys(basicInformation).length) {
      reset(basicInformation);
    } else if (clientId) fetchAndSetClient();
  }, [basicInformation]);
  const fetchAndSetClient = async () => {
    setisLoading(true);
    const docRef = doc(firestore, "client", clientId);
    const client = await getDoc(docRef);
    if (client.exists()) reset(client.data());
    setisLoading(false);
  };
  const onSubmit = async (data) => {
    dispatch(setBasicInformation({ data: data, type }));
    handleNext();
  };

  const flatPostionOptions = [
    { name: <em>žádné</em>, value: "" },
    { name: "přízemí vlevo", value: "přízemí vlevo" },
    { name: "přízemí střed", value: "přízemí střed" },
    { name: "přízemí vpravo", value: "přízemí vpravo" },
    { name: "1. patro vlevo", value: "1. patro vlevo" },
    { name: "1. patro střed", value: "1. patro střed" },
    { name: "1. patro vpravo", value: "1. patro vpravo" },
    { name: "2. patro vlevo", value: "2. patro vlevo" },
    { name: "2. patro střed", value: "2. patro střed" },
    { name: "2. patro vpravo", value: "2. patro vpravo" },
    { name: "3. patro vlevo", value: "3. patro vlevo" },
    { name: "3. patro střed", value: "3. patro střed" },
    { name: "3. patro vpravo", value: "3. patro vpravo" },
    { name: "4. patro vlevo", value: "4. patro vlevo" },
    { name: "4. patro střed", value: "4. patro střed" },
    { name: "4. patro vpravo", value: "4. patro vpravo" },
    { name: "5. patro vlevo", value: "5. patro vlevo" },
    { name: "5. patro střed", value: "5. patro střed" },
    { name: "5. patro vpravo", value: "5. patro vpravo" },
    { name: "6. patro vlevo", value: "6. patro vlevo" },
    { name: "6. patro střed", value: "6. patro střed" },
    { name: "6. patro vpravo", value: "6. patro vpravo" },
    { name: "7. patro vlevo", value: "7. patro vlevo" },
    { name: "7. patro střed", value: "7. patro střed" },
    { name: "7. patro vpravo", value: "7. patro vpravo" },
    { name: "8. patro vlevo", value: "8. patro vlevo" },
    { name: "8. patro střed", value: "8. patro střed" },
    { name: "8. patro vpravo", value: "8. patro vpravo" },
    { name: "9. patro vlevo", value: "9. patro vlevo" },
    { name: "9. patro střed", value: "9. patro střed" },
    { name: "9. patro vpravo", value: "9. patro vpravo" },
    { name: "10. patro vlevo", value: "10. patro vlevo" },
    { name: "10. patro střed", value: "10. patro střed" },
    { name: "10. patro vpravo", value: "10. patro vpravo" },


  ];

  if (editRev) {
    return (
      <>
        <Box sx={{ flexGrow: 1 }} component="form" noValidate autoComplete="off">
          <Grid container spacing={{ xs: 3, sm: 7 }}>
            <Grid item xs={12}>
              <GridSection title="Osobní údaje">
                <Grid item xs={6} md={4}>
                  <InputField
                    id="firstName"
                    InputLabelProps={{ shrink: true }}
                    label={errors.firstName?.message ?? "Křestní jméno"}
                    {...register("firstName", { required: true })}
                    error={errors.firstName}
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <InputField
                    id="lastName"
                    InputLabelProps={{ shrink: true }}
                    label={errors.lastName?.message ?? "Příjmení"}
                    {...register("lastName", { required: true })}
                    error={errors.lastName}
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <InputField
                    id="ownerAttended"
                    InputLabelProps={{ shrink: true }}
                    label={
                      errors.ownerAttended?.message ?? "Zúčastněná osoba"
                    }
                    {...register("ownerAttended", { required: true })}
                    error={errors.ownerAttended}
                  />
                </Grid>
  
                <Grid item xs={6} md={4}>
                  <InputField
                    id="telephoneNumber"
                    InputLabelProps={{ shrink: true }}
                    label={errors.telephoneNumber?.message ?? "Telefonní číslo"}
                    //type="number"
                    {...register("telephoneNumber", { required: true })}
                    error={errors.telephoneNumber}
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <InputField
                    id="email"
                    InputLabelProps={{ shrink: true }}
                    label={errors.email?.message ?? "Emailová adresa"}
                    type="email"
                    {...register("email", {
                      required: true,
                      pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                    })}
                    error={errors.email}
                  />
                </Grid>
              </GridSection>
            </Grid>
            <Grid item xs={12}>
              <GridSection title="Údaje o budově">
                <Grid item xs={6} md={4}>
                  <InputField
                    id="street"
                    InputLabelProps={{ shrink: true }}
                    label={errors.street?.message ?? "Ulice"}
                    {...register("street", { required: true })}
                    error={errors.street}
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <InputField
                    id="city"
                    InputLabelProps={{ shrink: true }}
                    label={errors.city?.message ?? "Město"}
                    {...register("city", { required: true })}
                    error={errors.city}
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <InputField
                    id="zipCode"
                    InputLabelProps={{ shrink: true }}
                    label={errors.zipCode?.message ?? "PSČ"}
                    //type="number"
                    {...register("zipCode", { required: true })}
                    error={errors.zipCode}
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <InputField
                    id="objectManagerName"
                    InputLabelProps={{ shrink: true }}
                    label={
                      errors.objectManagerName?.message ?? "Správce budovy"
                    }
                    helperText={"Nebo název družstva"}
                    {...register("objectManagerName", { required: false })}
                    error={errors.objectManagerName}
                  />
                </Grid>
                <Grid item xs={6} md={4} style={{marginTop: mobileScreen? -15 : 0}}>
                  <ReactHookFormSelect
                    id="flatPosition"
                    label={"Umístění bytu"}
                    name="flatPosition"
                    control={control}
                    renderValue={(value) => value}
                    options={flatPostionOptions}
                  />
                </Grid>
              </GridSection>
            </Grid>
          </Grid>
        </Box>
        <StepButtons
          isLoading={isLoading}
          activeStep={activeStep}
          handleBack={handleBack}
          handleNext={handleSubmit(onSubmit)}
          mobileScreen
        />
      </>
    );
  } else {
  return (
    <>
      <Box sx={{ flexGrow: 1 }} component="form" noValidate autoComplete="off">
        <Grid container spacing={{ xs: 3, sm: 7 }}>
          <Grid item xs={12}>
            <GridSection title="Osobní údaje">
              <Grid item xs={6} md={4}>
                <InputField
                  id="firstName"
                  label={errors.firstName?.message ?? "Křestní jméno"}
                  {...register("firstName", { required: true })}
                  error={errors.firstName}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <InputField
                  id="lastName"
                  label={errors.lastName?.message ?? "Příjmení"}
                  {...register("lastName", { required: true })}
                  error={errors.lastName}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <InputField
                  id="ownerAttended"
                  label={
                    errors.ownerAttended?.message ?? "Zúčastněná osoba"
                  }
                  {...register("ownerAttended", { required: true })}
                  error={errors.ownerAttended}
                />
              </Grid>

              <Grid item xs={6} md={4}>
                <InputField
                  id="telephoneNumber"
                  label={errors.telephoneNumber?.message ?? "Telefonní číslo"}
                  //type="number"
                  {...register("telephoneNumber", { required: true })}
                  error={errors.telephoneNumber}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <InputField
                  id="email"
                  label={errors.email?.message ?? "Emailová adresa"}
                  type="email"
                  {...register("email", {
                    required: true,
                    pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                  })}
                  error={errors.email}
                />
              </Grid>
            </GridSection>
          </Grid>
          <Grid item xs={12}>
            <GridSection title="Údaje o budově">
              <Grid item xs={6} md={4}>
                <InputField
                  id="street"
                  label={errors.street?.message ?? "Ulice"}
                  {...register("street", { required: true })}
                  error={errors.street}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <InputField
                  id="city"
                  label={errors.city?.message ?? "Město"}
                  {...register("city", { required: true })}
                  error={errors.city}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <InputField
                  id="zipCode"
                  label={errors.zipCode?.message ?? "PSČ"}
                  //type="number"
                  {...register("zipCode", { required: true })}
                  error={errors.zipCode}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <InputField
                  id="objectManagerName"
                  label={
                    errors.objectManagerName?.message ?? "Správce budovy"
                  }
                  helperText={"Nebo název družstva"}
                  {...register("objectManagerName", { required: false })}
                  error={errors.objectManagerName}
                />
              </Grid>
              <Grid item xs={6} md={4} style={{marginTop: mobileScreen? -15 : 0}}>
                <ReactHookFormSelect
                  id="flatPosition"
                  label={"Umístění bytu"}
                  name="flatPosition"
                  control={control}
                  renderValue={(value) => value}
                  options={flatPostionOptions}
                />
              </Grid>
            </GridSection>
          </Grid>
        </Grid>
      </Box>
      <StepButtons
        isLoading={isLoading}
        activeStep={activeStep}
        handleBack={handleBack}
        handleNext={handleSubmit(onSubmit)}
        mobileScreen
      />
    </>
  );
                }
};

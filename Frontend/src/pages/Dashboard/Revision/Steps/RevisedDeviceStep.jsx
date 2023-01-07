import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { GridSection } from "components/GridSection";
import { InputField } from "utils/InputField";
import { InputField2 } from "utils/InputFieldHigher";
import { StepButtons } from "components/StepButtons";
import { Dropdown } from "components/Dropdown";
import { InputAdornment } from '@mui/material';
import {
  CoPresenceIcon,
  DeviceInspectionIcon2,
  GasDetectorIcon,
  HelpIcon,
  SpeedMeterIcon,
  ValvesInspectionIcon,
} from "utils/icons";
import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  FormLabel,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { CustomCheckBox } from "utils/CustomCheckBox";
import { revisionTypes } from "utils/common";
import { useTheme } from "@emotion/react";
import { Stack } from "@mui/system";
import { PresureTestModal } from "./PresureTestModal";
import { useModalContext } from "context/ModalContext";
import { useDispatch, useSelector } from "react-redux";
import { setTechInformation } from "redux/slices/revisionSlice";
import useYupValidationResolver from "schema/useYupValidationResolver";
import { technicalInfoInitialSchema, technicalInfoServiceSchema } from "schema";
import { toast } from "react-toastify";
import { checkArray } from "helpers/detectError";
import { ReactHookFormSelect } from "utils/SelectField";
import moment from "moment";
import { getCommonDefectsAsyncThunk } from "redux/slices/defectSlice";
import { TheatersOutlined } from "@mui/icons-material";


/**
  * Komponenta pro základní informace o zařízení/spotřebiči
  * @return {} komponenta
  */

export const RevisedDeviceStep = ({
  type,
  activeStep,
  handleBack,
  handleNext,
}) => {
  const mobileScreen = useMediaQuery("(max-width:600px)");
  const theme = useTheme();
  const { handleToggleModal } = useModalContext();
  const [selectedItems, setSelectedItems] = useState([]);
  // redux
  const {
    revisionForm: {
      [type]: { techInformation, performedTests },
    },
  } = useSelector((state) => state.revision);
  const { commonDefects } = useSelector((state) => state.defect);

  const initalPresureTest = useMemo(() => {
    return Object.keys(performedTests ?? {}).length > 0;
  });
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    resolver: useYupValidationResolver(
      type === revisionTypes.initial
        ? technicalInfoInitialSchema
        : technicalInfoServiceSchema
    ),
    defaultValues: useMemo(() => {
      return techInformation;
    }, [techInformation]),
  });
  //console.log(techInformation, "techInformation");

  useEffect(() => {
    setValue("threadType", techInformation?.threadType);
  }, [techInformation.threadType]);
  useEffect(() => {
    setValue("devicePosition", techInformation?.devicePosition);
  }, [techInformation.devicePosition]);

  const handleSelect = (value) => {
    var form_performanceCheck = getValues("performanceCheck");
    if (!form_performanceCheck) form_performanceCheck = [];
    const isPresent = form_performanceCheck.indexOf(value);
    if (isPresent !== -1) {
      const remaining = form_performanceCheck.filter((item) => item !== value);
      setSelectedItems(remaining);
      setValue("performanceCheck", remaining);
    } else {
      setSelectedItems((prevItems) => [...prevItems, value]);
      setValue("performanceCheck", [...selectedItems, value]);
    }
  };
  // if techInformation data is change reet form
  useEffect(() => {
    if (techInformation && Object.keys(techInformation).length) {
      reset(techInformation);
      if (
        techInformation &&
        techInformation.performanceCheck &&
        Array.isArray(techInformation.performanceCheck)
      ) {
        setSelectedItems(techInformation.performanceCheck);
        setValue("performanceCheck", techInformation.performanceCheck);
      }
    }
  }, [techInformation, reset]);
  const onSubmit = (data) => {
    //console.log(data);
     if (type == "initial" && Object.keys(performedTests).length == 0) {
       return toast.error("Nejdříve musíš vyplnit tlakovou zkoušku!")
     }
    dispatch(setTechInformation({ data, type }));
    handleNext();
  };
  // we are setting form value manually here
  useEffect(() => {
    setValue("performanceCheck", selectedItems);
  }, [selectedItems]);
  const getCommonDefects = () => {
    dispatch(
      getCommonDefectsAsyncThunk({ deviceName: getValues("deviceName") })
    );
  };
  const devicePositionOptions = [
    { name: "v kuchyni", value: "v kuchyni" },
    { name: "v chodbě", value: "v chodbě" },
    { name: "v koupelně", value: "v koupelně" },
    { name: "v obývací místnosti", value: "v obývací místnosti" },
    { name: "na toaletě", value: "na toaletě" },
  ];

  const threadTypeOptions = [
    { name: "K 800 DN 20", value: "K 800 DN 20" },
    { name: "K 806 DN 15", value: "K 806 DN 15" },
  ];

  const commontDefectPoint = {
    tag: "Nejčastější závady",
    title: "Gas stove Electrolux",
    points: [
      "Gas leak",
      "Termo-electric fuse of the flame",
      "Loose control knob",
    ],
  };
  //console.log(getValues("devicePosition"), "devicePosition");
  const { ref, ...rest } = register("performanceCheck");
  return (
    <>
      <Box sx={{ flexGrow: 1 }} component="form" noValidate autoComplete="off">
        <Grid container spacing={{ xs: 3, sm: 7 }}>
          <Grid item xs={12}>
            <GridSection title="Technické hodnoty">
              <Grid item xs={12} md={8}>
                <GridSection>
                  <Grid item xs={6} md={6}>
                    <InputField
                      id="evidenceNumber"
                      label={
                        errors.evidenceNumber?.message ?? "Evidenční číslo"
                      }
                      //type="number"
                      {...register("evidenceNumber", {
                        required: true,
                      })}
                      error={errors.evidenceNumber}
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <InputField
                      id="deviceName"
                      label={errors.deviceName?.message ?? "Název spotřebiče"}
                      {...register("deviceName", { required: true })}
                      error={errors.deviceName}
                    />
                    <Box >
                      <Dropdown
                        onOpen={(e) => getCommonDefects()}
                        textAlign={"end"}
                        getValues={getValues}
                        name="deviceName"
                        title={<Typography
                          key={1}
                          component={"span"}
                          variant="defects"
                          color="primary"
                          style={{marginRight:3}}
                        >
                          <HelpIcon  width={mobileScreen ? 11 : 15} style={{marginRight:-3}} />
                          <span className="ms-2" >Nejčastější závady</span>
                        </Typography>}
                      >
                        {({ open }) => <Box sx={{ paddingX: mobileScreen ? 1 : 1.5}}>
                          <Box>
                            {commontDefectPoint.tag && (
                              <Typography
                                variant="body2"
                                color="secondary"
                              >
                                {commontDefectPoint.tag}
                              </Typography>
                            )}
                            <Typography variant="h5_old">
                              {open ? getValues("deviceName") : getValues("deviceName")}
                            </Typography>
                            <Divider sx={{ borderColor: theme.palette.secondary.main, borderBottomWidth: 1.5, opacity: 0.5, marginTop: 0.5, marginBottom: 1 }} />
                          </Box>
                          {commonDefects && commonDefects.length > 0 ? (
                            <List>
                              {commonDefects.map((point, index) => {
                                return (
                                  <Box key={index}>
                                    <ListItem>
                                      <ListItemText
                                        primary={index + 1 + ". " + point}
                                      />
                                    </ListItem>
                                    {index + 1 !== commonDefects.length && (
                                      <Divider />
                                    )}
                                  </Box>
                                );
                              })}
                            </List>
                          ) : (
                            <Box>
                              <ListItem style={{color: theme.palette.secondary.main}}>
                                <ListItemText primary={"Nejsou evidovány žádné závady."} />
                              </ListItem>
                              {0 + 1 !== 1 && <Divider />}
                            </Box>
                          )}
                        </Box>}
                      </Dropdown>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={6} style={{paddingTop: mobileScreen ? 1 : 0}}>
                    <ReactHookFormSelect
                      id="devicePosition"
                      label={
                        errors.devicePosition?.message ?? "Umístění spotřebiče"
                      }
                      error={errors?.devicePosition}
                      // defaultValue={techInformation?.devicePosition}
                      //{...register("devicePosition", { required: true })}
                      name="devicePosition"
                      options={devicePositionOptions}
                      control={control}
                      renderValue={(value) => value}
                    />
                  </Grid>
                  <Grid item xs={6} md={6} style={{paddingTop: mobileScreen ? 1 : 0}}>
                    <ReactHookFormSelect
                      id="threadType"
                      label={errors?.threadType?.message ?? "Typ závitu"}
                      error={errors?.threadType}
                      name="threadType"
                      // {...register("threadType", { required: true })}
                      control={control}
                      options={threadTypeOptions}
                      renderValue={(value) => value}
                    />
                  </Grid>
                </GridSection>
              </Grid>

              <Grid item xs={12} md={4}>
                <InputField2
                  id="connectionMethod"
                  label={errors.connectionMethod?.message ?? "Způsob zapojení"}
                  {...register("connectionMethod", { required: true })}
                  multiline
                  maxRows={4}
                  error={errors.connectionMethod}
                />
              </Grid>
            </GridSection>
          </Grid>
          <Grid item xs={12}>
            <GridSection title="Provedené kontroly">
              {type === revisionTypes.service ? (
                <Grid item xs={12}>
                  <FormControl
                    component="fieldset"
                    variant="standard"
                    {...register("performanceCheck", {
                      required: false,
                    })}
                    error={errors.performanceCheck}
                  >
                    <FormLabel component="legend">
                      {errors.performanceCheck?.message}
                    </FormLabel>
                    <FormGroup>
                      {/*  */}
                      <Grid container spacing={{ xs: 1, sm: 3 }}>
                        <Grid item xs={12} md={3}>
                          <FormControlLabel
                          label={<Typography style={{fontWeight:"500"}}>Vybrat vše</Typography>}
                            // name={"performanceCheck"}
                            control={
                              <Checkbox
                                // {...rest}
                                // name={"performanceCheck"}
                                // inputRef={ref}
                                // defaultValue={['All Checked']}
                                checked={selectedItems?.includes("Vybrat vše")}
                                onChange={() => {
                                  if (selectedItems.includes("Vybrat vše")) {
                                    setSelectedItems([]);
                                    setValue("performanceCheck", []);
                                  } else {
                                    setSelectedItems([
                                      "Vybrat vše",
                                      "Kontrola armatur",
                                      "Kontrola těsnosti",
                                      "Kontrola spotřebiče",
                                      "Kontrola výskytu CO",
                                    ]);
                                    setValue("performanceCheck", [
                                      "Vybrat vše",
                                      "Kontrola armatur",
                                      "Kontrola těsnosti",
                                      "Kontrola spotřebiče",
                                      "Kontrola výskytu CO",
                                    ]);
                                  }
                                }}
                              />
                            }
                            // value={['All Checked']}
                          />
                        </Grid>

                        <Grid item xs={3} md={2}>
                          <Controller
                            name={"performanceCheck"}
                            render={({ }) => {
                              return (
                                <CustomCheckBox
                                  icon={
                                    <GasDetectorIcon width="30" height="30" />
                                  }
                                  label={
                                    errors.performanceCheck?.message ??
                                    "Kontrola těsnosti"
                                  }
                                  checked={selectedItems.includes(
                                    "Kontrola těsnosti"
                                  )}
                                  onChange={() =>
                                    handleSelect("Kontrola těsnosti")
                                  }
                                />
                              );
                            }}
                            control={control}
                          />
                        </Grid>
                        <Grid item xs={3} md={2}>
                          <Controller
                            name={"performanceCheck"}
                            render={({ }) => {
                              return (
                                <CustomCheckBox
                                  icon={
                                    <ValvesInspectionIcon
                                      width="30"
                                      height="30"
                                    />
                                  }
                                  label={
                                    errors.performanceCheck?.message ??
                                    "Kontrola armatur"
                                  }
                                  checked={selectedItems.includes(
                                    "Kontrola armatur"
                                  )}
                                  onChange={() =>
                                    handleSelect("Kontrola armatur")
                                  }
                                />
                              );
                            }}
                            control={control}
                          />
                        </Grid>
                        <Grid item xs={3} md={2}>
                          <Controller
                            name={"performanceCheck"}
                            render={({ }) => {
                              return (
                                <CustomCheckBox
                                  icon={
                                    <DeviceInspectionIcon2
                                      width="35"
                                      height="35"
                                    />
                                  }
                                  label={
                                    errors.performanceCheck?.message ??
                                    "Kontrola spotřebiče"
                                  }
                                  checked={selectedItems.includes(
                                    "Kontrola spotřebiče"
                                  )}
                                  onChange={() =>
                                    handleSelect("Kontrola spotřebiče")
                                  }
                                />
                              );
                            }}
                            control={control}
                          />
                        </Grid>
                        <Grid item xs={3} md={2}>
                          <Controller
                            name={"performanceCheck"}
                            render={({ }) => {
                              return (
                                <CustomCheckBox
                                  icon={
                                    <CoPresenceIcon width="30" height="30" />
                                  }
                                  label={
                                    errors.performanceCheck?.message ??
                                    "Kontrola výskytu CO"
                                  }
                                  checked={selectedItems.includes(
                                    "Kontrola výskytu CO"
                                  )}
                                  onChange={() => handleSelect("Kontrola výskytu CO")}
                                />
                              );
                            }}
                            control={control}
                          />
                        </Grid>
                      </Grid>
                      {/*  */}
                    </FormGroup>
                  </FormControl>
                </Grid>
              ) : (
                <>
                  <Grid item xs={12} md={5}>
                    <Stack
                      direction={"row"}
                      justifyContent="space-around"
                      alignItems={"center"}
                      sx={{
                        padding: 2,
                        border: 1,
                        borderRadius: 1,
                        borderColor: theme.palette.secondary.main,
                      }}
                    >
                      <Box
                        sx={{
                          textAlign: "center",
                          alignItems: "center",
                          color: theme.palette.secondary.main,
                          height: mobileScreen ? 55:80,
                        }}
                      >
                        <SpeedMeterIcon width="50px" height= "40px" style={{marginTop: mobileScreen ? 0:10}}/>
                        <Typography variant="body2" style={{marginTop:2}} >Tlaková zkouška</Typography>
                      </Box>
                      {initalPresureTest === false ? (
                        <Button variant="contained" onClick={handleToggleModal} disableElevation sx={{ fontWeight: 500 }}>
                          Vytvořit novou
                        </Button>
                      ) : (
                        <Stack
                          direction="column"
                          spacing={0.5}
                          justifyContent="center"
                        >
                          <Typography variant="body2" color="secondary">
                            Ev. číslo: {performedTests?.evidenceNumber}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="secondary"
                            className="mb-2"
                          >
                            Datum: {moment().format("DD. MM. YYYY")}
                          </Typography>
                          <Button
                            variant="contained"
                            onClick={handleToggleModal}
                            disableElevation
                            style={{fontWeight:"500"}}
                          >
                            Upravit
                          </Button>
                        </Stack>
                      )}
                    </Stack>
                  </Grid>
                  <PresureTestModal />
                  <Grid item xs={6} md={4}>
                    <InputField
                      id="totalMaxConsumptionOfNaturalGas"
                      label={
                        errors.dash?.message ?? mobileScreen ? "Max. spotřeba ZP" : 
                        "Maximální spotřeba zemního plynu"
                      }
                      //type="number"
                      {...register("totalMaxConsumptionOfNaturalGas", {
                        required: true,
                      })}
                      error={
                        errors.totalMaxConsumptionOfNaturalGas?.type ===
                          "required"
                          ? true
                          : false
                      }
                    />
                  </Grid>
                </>
              )}
            </GridSection>
          </Grid>
        </Grid>
      </Box>
      <StepButtons
        activeStep={activeStep}
        handleBack={handleBack}
        handleNext={handleSubmit(onSubmit)}
        mobileScreen
      />
    </>
  );
};

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import StampImg from "assets/images/stamp1.png";
import { InputField } from "utils/InputField";
import { CustomCard } from "components/Card";
import { useTheme } from "@emotion/react";
import { GridSection } from "components/GridSection";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "utils/PageHeader";
import { Dropdown } from "components/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  createProfileAsyncThunk,
  getProfileAsyncThunk,
  logoutAsyncThunk,
} from "redux/slices/authSlice";
import CustomButton from "components/CustomComponents/CustomButton";
import ProvierErrorLoading from "components/CustomComponents/ProvierErrorLoading";
import {
  CoPresenceIcon,
  EditIcon,
  GasDetectorIcon,
  LogoutIcon,
  PressureGaugeIcon,
  SettingIcon,
} from "utils/icons";
import useYupValidationResolver from "schema/useYupValidationResolver";
import { profileSchema } from "schema";
import { useMediaQuery } from "@mui/material";

export const ProfileForm = ({ profileFormType="view" }) => {
  const mobileScreen = useMediaQuery("(max-width:600px)");
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { user, profile } = useSelector((state) => state.auth);

  var view = true;

  if (profileFormType=="view"){
    view = true;
  } else view = false;
  

  // if profile is empty get profile data
  useEffect(() => {
    if (
      !profile ||
      (Object.keys(profile)?.length === 0 && user && Object.keys(user).length)
    ) {
      dispatch(getProfileAsyncThunk());
    }
  }, [user]);
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: useYupValidationResolver(profileSchema),
    defaultValues: useMemo(() => {
      return profile;
    }, [profile]),
  });

  // if profile data is change reet form
  useEffect(() => {
    if (profile && Object.keys(profile).length) {
      reset(profile);
    }
  }, [profile]);

  // create profile
  const onSubmit = (data) => dispatch(createProfileAsyncThunk({ data, image, callBack:()=>navigate('/profile') }));
  // set image
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImagePreview(URL.createObjectURL(event.target.files[0]));
      setImage(event.target.files[0]);

      //console.log("imageurl", URL.createObjectURL(event.target.files[0]));
      //console.log("imageurl", event.target.files[0]);
    }
  };

  const navigate = useNavigate();

  // logout user
  const handleLogout = () => {
    dispatch(logoutAsyncThunk({ navigate }));
  };

  const pageNavigate = (pageName) => {
    navigate(pageName);
  };

  const profileDropdownOptions = [
    {
      name: "Upravit profil",
      icon: <EditIcon width="16" />,
      onclick: () => pageNavigate("edit"),
    },
    {
      name: "Nastavení",
      icon: <SettingIcon width="16" />,
      onclick: () => pageNavigate("setting"),
    },
    {
      name: "Odhlásit se",
      icon: <LogoutIcon width="16" />,
      onclick: handleLogout,
    },
  ];

  return (
    <>
      <PageHeader
        title="Můj Profil"
        subTitle={
          (profile?.firstName
            ? profile?.firstName + " " + profile?.lastName
            : false) ??
          user?.displayName ??
          "Host"
        }
      >
        {profileFormType === "view" && (
          <Dropdown options={profileDropdownOptions} />
        )}
      </PageHeader>

      {/* this provider will manage error and loading */}
      <ProvierErrorLoading
        compromiseMessage="Profile is not updated"
        compromiseCode={401}
        reducer={"auth"}
        action={"getProfileAsyncThunk"}
        asyncThunk={getProfileAsyncThunk}
        loadingIndicator={"getProfileAsyncThunk"}
      >
        <Box
          sx={{ flexGrow: 1 }}
          component="form"
          noValidate
          autoComplete="off"
        >
          <Grid container spacing={{ xs: 3, sm: 7 }}>
            <Grid item xs={12} md={6}>
              <Box>
                <Grid container spacing={{ xs: 3, sm: 7 }}>
                  <Grid item xs={12}>
                    <GridSection title="Osobní údaje">
                      <Grid item xs={6}>
                        <InputField
                          id="title"
                          InputLabelProps={{disableAnimation: view ? true : false}}
                          label={errors.title?.message ?? "Titul"}
                          disabled={profileFormType === "view"}
                          {...register("title")}
                          error={errors.title}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <InputField
                          id="firstName"
                          InputLabelProps={{disableAnimation: view ? true : false}}
                          label={errors.firstName?.message ?? "Křestní jméno"}
                          disabled={profileFormType === "view"}
                          {...register("firstName", { required: true })}
                          error={errors.firstName}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <InputField
                          id="lastName"
                          InputLabelProps={{disableAnimation: view ? true : false}}
                          label={errors.lastName?.message ?? "Příjmení"}
                          disabled={profileFormType === "view"}
                          {...register("lastName", { required: true })}
                          error={errors.lastName}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <InputField
                          id="email"
                          InputLabelProps={{disableAnimation: view ? true : false}}
                          label={errors.email?.message ?? "Emailová adresa"}
                          disabled={profileFormType === "view"}
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
                      </Grid>
                      <Grid item xs={6}>
                        <InputField
                          id="telephoneNumber"
                          InputLabelProps={{disableAnimation: view ? true : false}}
                          label={
                            errors.telephoneNumber?.message ?? "Telefonní číslo"
                          }
                          disabled={profileFormType === "view"}
                          type="telephoneNumber"
                          {...register("telephoneNumber", {
                            required: true,
                            pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                          })}
                          error={errors.telephoneNumber}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <InputField
                          id="executingPlace"
                          InputLabelProps={{disableAnimation: view ? true : false}}
                          label={
                            errors.executingPlace?.message ??
                            "Místo působení"
                          }
                          helperText= {view ? " " : "Např. v Děčíně"}
                          disabled={profileFormType === "view"}
                          {...register("executingPlace", { required: true })}
                          error={errors.executingPlace}
                        />
                      </Grid>
                    </GridSection>
                  </Grid>
                  <Grid item xs={12} marginTop={-1.5} >
                    <GridSection title="Certifikáty">
                      <Grid item xs={6}>
                        <InputField
                          id="certificate"
                          InputLabelProps={{disableAnimation: view ? true : false}}
                          label={
                            errors.certificate?.message ??
                            "Číslo osvědčení"
                          }
                          //type="number"
                          disabled={profileFormType === "view"}
                          {...register("certificate", { required: true })}
                          error={errors.certificate}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <InputField
                          id="authorization"
                          InputLabelProps={{disableAnimation: view ? true : false}}
                          label={
                            errors.authorization?.message ??
                            "Číslo oprávnění"
                          }
                          disabled={profileFormType === "view"}
                          {...register("authorization", { required: true })}
                          error={errors.authorization}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            border: "1px solid",
                            borderRadius: 1,
                            borderColor: theme.palette.secondary.main,
                            paddingBottom: 2.5,
                            paddingLeft: 1.5,
                            paddingRight: 1.5,
                            paddingTop: 1,
                          }}
                        >
                          <Typography variant="subtitle3" color="secondary">
                            Razítko
                          </Typography>
                          <Box className="text-center">
                            <img
                              src={
                                imagePreview ?? profile?.imageUrl ?? StampImg
                              }
                              alt="Stamp"
                              className="w-100 mw-150px ratio-1x1 rounded-circle border border-2 border-dark "
                            />
                          </Box>
                        </Box>
                      </Grid>
                      {profileFormType === "editProfile" && (
                        <Grid item xs={6}>
                          <Box
                            sx={{
                              display: "flex",
                              height: "100%",
                              flexDirection: "column",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            <div>
                              <Button variant="contained" component="label" disableElevation sx={{fontWeight: 500}}>
                                Nahrát razítko
                                <input
                                  onChange={onImageChange}
                                  hidden
                                  accept="image/*"
                                  type="file"
                                />
                              </Button>
                            </div>
                            <Typography variant="body2" color="secondary">
                              {image ? image.name : ""}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </GridSection>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <GridSection title="Registrované nástroje">
                <Grid item xs={6} sm={4} md={6}>
                  <CustomCard title="Detektor plynu" icon={<GasDetectorIcon />}>
                    <InputField
                      id="gasDetectorName"
                      InputLabelProps={{disableAnimation: view ? true : false}}
                      label={errors.gasDetectorName?.message ?? "Název"}
                      disabled={profileFormType === "view"}
                      {...register("gasDetectorName", {
                        required: true,
                      })}
                      error={errors.gasDetectorName}
                    />

                    <InputField
                      id="gasDetectorSerialNumber"
                      InputLabelProps={{disableAnimation: view ? true : false}}
                      label={
                        errors.gasDetectorSerialNumber?.message ??
                        "Výrobní číslo"
                      }
                      type="number"
                      disabled={profileFormType === "view"}
                      {...register("gasDetectorSerialNumber", {
                        required: true,
                      })}
                      error={errors.gasDetectorSerialNumber}
                    />
                  </CustomCard>
                </Grid>
                <Grid item xs={6} sm={4} md={6}>
                  <CustomCard title="Detektor CO" icon={<CoPresenceIcon />}>
                    <InputField
                      id="coPresenceName"
                      InputLabelProps={{disableAnimation: view ? true : false}}
                      label={errors.coPresenceName?.message ?? "Název"}
                      disabled={profileFormType === "view"}
                      {...register("coPresenceName", {
                        required: true,
                      })}
                      error={errors.coPresenceName}
                    />

                    <InputField
                      id="coPresenceSerialNumber"
                      InputLabelProps={{disableAnimation: view ? true : false}}
                      label={
                        errors.coPresenceSerialNumber?.message ??
                        "Výrobní číslo"
                      }
                      type="number"
                      disabled={profileFormType === "view"}
                      {...register("coPresenceSerialNumber", {
                        required: true,
                      })}
                      error={errors.coPresenceSerialNumber}
                    />
                  </CustomCard>
                </Grid>
                <Grid item xs={6} sm={4} md={6}>
                  <CustomCard
                    title="Tlakoměr"
                    icon={<PressureGaugeIcon />}
                  >
                    <InputField
                      id="pressureGaugeName"
                      InputLabelProps={{disableAnimation: view ? true : false}}
                      label={errors.pressureGaugeName?.message ?? "Název"}
                      disabled={profileFormType === "view"}
                      {...register("pressureGaugeName", {
                        required: true,
                      })}
                      error={errors.pressureGaugeName}
                    />

                    <InputField
                      id="pressureGaugeSerialNumber"
                      InputLabelProps={{disableAnimation: view ? true : false}}
                      label={
                        errors.pressureGaugeSerialNumber?.message ??
                        "Výrobní číslo"
                      }
                      //type="number"
                      disabled={profileFormType === "view"}
                      {...register("pressureGaugeSerialNumber", {
                        required: true,
                      })}
                      error={errors.pressureGaugeSerialNumber}
                    />
                  </CustomCard>
                </Grid>
              </GridSection>
            </Grid>
            {profileFormType !== "view" && (
              <Grid item xs={12} marginTop = {mobileScreen ? 0 : -15 }>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  spacing={mobileScreen ? 0 : 2}
                >
                  <Button 
                  component={Link} to="/profile" variant="outline">
                    Zrušit
                  </Button>
                  <CustomButton
                    reducer="auth"
                    action="createProfileAsyncThunk"
                    title="Uložit změny"
                    onClick={handleSubmit(onSubmit)}
                    btnProps={{ variant: "contained" }}
                  />
                </Stack>
              </Grid>
            )}
          </Grid>
        </Box>
      </ProvierErrorLoading>
    </>
  );
};

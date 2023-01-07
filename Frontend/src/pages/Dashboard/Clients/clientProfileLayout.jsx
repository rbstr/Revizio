import React, { useEffect, useMemo } from "react";

import { useFieldArray, useForm } from "react-hook-form";
import { PageHeader } from "utils/PageHeader";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { InputField } from "utils/InputField";
import CustomButton from "components/CustomComponents/CustomButton";
import { GridSection } from "components/GridSection";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PrintCard } from "components/printCard";
import { Dropdown } from "components/Dropdown";
import { MapSection } from "components/Map";
import { useModalContext } from "context/ModalContext";
import { useMediaQuery } from "@mui/material";
import {
  DownloadIcon,
  EditIcon,
  LocationIcon,
  MailIcon,
  PatternIcon,
  PdfIcon,
  PrintIcon,
  TrashIcon,
  ChevronRightIcon,
  EyeIcon,
} from "utils/icons";
import ProvierErrorLoading from "components/CustomComponents/ProvierErrorLoading";
import {
  deleteClientAsyncThunk,
  getClientAsyncThunk,
  updateClientAsyncThunk,
} from "redux/slices/clientsSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteRevisionAsyncThunk,
  downloadRevisionPdfFileAsyncThunk,
  getRevisionsbyIdAsyncThunk,
  setPdfRevisionData,
  setRevisionData,
} from "redux/slices/revisionSlice";
import { getValue } from "@mui/system";
import { EmailModal } from "components/EmailModal";
import { confirmAlert } from "react-confirm-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material";
import moment from "moment";
import { PdfModal } from "components/PdfModal";
import { useState } from "react";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";

/**
  * Komponenta karty klienta
  * @param {formType} x 
  * @return {} komponenta
  */


export const customAlert = (title, message, action, theme, mobileScreen) =>
  confirmAlert({
    title,
    overlayClassName: "alert-overlay",
    message,
    customUI: ({ onClose, title, message }) => (
      <SweetAlert
        onConfirm={() => {
          const id = toast.loading("Odstraňuji...");
          onClose();
          action();
          setTimeout(() => {
            toast.dismiss(id);
          }, 400);
        }}
        customClass={"w-sm-100"}
        onCancel={onClose}
        btnSize="btn-sm"
        cancelBtnText="Zrušit"
        cancelBtnBsStyle="default"
        confirmBtnText="Odstranit"
        confirmBtnBsStyle="primary"
        confirmBtnCssClass=""
        custom
        title={
          <Typography variant="h5_old" color={theme.palette.text.primary}
            style={{fontFamily: "Poppins", fontSize: mobileScreen ? 18 : 22, fontWeight: "600"}}>
            {title}
          </Typography>
        }
        customIcon={
          <Typography marginBottom={2} color={theme.palette.primary.main}>
            <TrashIcon width="100" height="120" />
          </Typography>
        }
        cancelBtnStyle={{
          fontFamily: theme.fontFamily,
          color: theme.palette.text.secondary,
          fontSize: mobileScreen ? 14 : 16,
          fontWeight: 500,
        }}

        confirmBtnStyle={{
          fontFamily: theme.fontFamily,
          color: theme.palette.text.button,
          fontSize: mobileScreen ? 14 : 16,
          fontWeight: 500,
          boxShadow: "0px 0px #888888",
          border: 0,
        }}

        showCancel
        style={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 8,
        }}
      >
        <Typography
          //variant="h5"
          color={theme.palette.text.secondary}
          marginBottom={3}
          style={{fontFamily:"Poppins", fontSize: mobileScreen ? 12 : 16, fontWeight: "400"}}
        >
          {message}
        </Typography>
      </SweetAlert>
    ),
  });

export const ClientProfileLayout = ({ formType }) => {
  // const { handleToggleModal } = useModalContext();
  // const { openModal, handleToggleModal } = useModalContext();
  const mobileScreen = useMediaQuery("(max-width:600px)");
  const [openModal, setOpenModal] = useState(false);
  const handleToggleModal = () => {
    setOpenModal(!openModal);
  };
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [building, setBuilding] = useState(-1);
  let { id } = useParams();
  const { client } = useSelector((state) => state.client);
  const { revisionsbyId } = useSelector((state) => state.revision);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: useMemo(() => {
      return client;
    }, [client]),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });
  // if profile data is change reet form
  useEffect(() => {
    if (client && Object.keys(client).length) {
      reset(client);
    }
    if (
      client?.addresses &&
      Array.isArray(client?.addresses) &&
      client.addresses.length
    ) {
      setBuilding(0);
    }
  }, [client]);
  const onSubmit = (data) =>
    dispatch(updateClientAsyncThunk({ data: { ...data, id }, callBack:()=>navigate("/clients/" + id) }));
  // fetch client data

  //to={`/clients/${id}`}

  useEffect(() => {
    dispatch(getClientAsyncThunk({ id }));
    dispatch(getRevisionsbyIdAsyncThunk({ id, perPage: 5, first: true }));
  }, []);


  const printPageOptions = [
    {
      icon: <EditIcon width="18" />,
      name: "Upravit klienta",
      onclick: () => navigate(`/clients/edit/${id}`),
    },
    {
      icon: <TrashIcon width="18" />,
      name: "Odstranit klienta",
      onClick: () => {
        customAlert(
          "Odstranění klienta",
          "Opravdu si přeješ odstranit klienta? Všechny související dokumenty budou také odstraněny.",
          () => {
            dispatch(deleteClientAsyncThunk({ id, navigate }));
          },
          theme,
          mobileScreen
        );
      },
    },
  ];

  const printOptions = [
    {
      icon: <EyeIcon width="18" color={theme.palette.text} />,
      name: "Otevřít revizi",
      onclick: (_id) => {
        dispatch(
          setPdfRevisionData(revisionsbyId?.data?.find((e) => e.id == _id))
        );
        setOpen(true);
      },
    },
    {
      icon: <EditIcon width="18" />,
      name: "Upravit revizi",
      onclick: (_id) => {
        dispatch(
          setRevisionData(revisionsbyId?.data?.find((e) => e.id == _id))
        );
        navigate(
          `/revision/${revisionsbyId?.data?.find((e) => e.id == _id)?.type}`
        );
      },
    },
    {
      icon: <DownloadIcon width="18" />,
      name: "Stáhnout",
      onclick: (_id) =>
        dispatch(
          downloadRevisionPdfFileAsyncThunk({
            url: revisionsbyId?.data?.find((e) => e.id == _id)?.pdfUrl,
            fileName: "Revision.pdf",
          })
        ),
    },
    {
      icon: <PrintIcon width="18" />,
      name: "Vytisknout",
      onclick: (_id) =>
        window.open(
          revisionsbyId?.data?.find((e) => e.id == _id)?.pdfUrl,
          "PRINT",
          "height=400,width=600"
        ),
    },
    { icon: <MailIcon width="18" />, name: "Odeslat emailem" },
    {
      icon: <TrashIcon width="18" />,
      name: "Odstranit revizi",
      onclick: (_id) => {
        customAlert(
          "Odstranění revize",
          "Opravdu chceš revizi odstranit? Tato akce nemůže být navrácena.",
          () => {
            dispatch(
              deleteRevisionAsyncThunk({
                id: _id,
                fetchList: true,
                clientId: id,
              })
            );
          },
          theme,
          mobileScreen
        );
      },
    },
    {
      icon: <PatternIcon width="18" />,
      name: "Použít jako vzor",
      onclick: (_id) => {
        dispatch(
          setRevisionData({
            ...revisionsbyId?.data?.find((e) => e.id == _id),
            id: undefined,
          })
        );
        navigate(
          `/revision/${revisionsbyId?.data?.find((e) => e.id == _id)?.type}`
        );
      },
    },
  ];
  // 
  return (
    <>
      <Box>
        <PageHeader
          title={
            client?.firstName
              ? client?.firstName + " " + client?.lastName
              : " "
          }
          subTitle="Profil klienta"
          goBack={{ name: "Zpět na seznam klientů", url: "/clients" }}
        >
          {formType === "view" && <Dropdown options={printPageOptions} />}
        </PageHeader>
      </Box>
      <ProvierErrorLoading
        compromiseMessage="Profile is not updated"
        compromiseCode={401}
        reducer={"revision"}
        action={"getClientAsyncThunk"}
        asyncThunk={getClientAsyncThunk}
        loadingIndicator={"getClientAsyncThunk"}
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
                          id="firstName"
                          label="Křestní jméno"
                          defaultValue=" "
                          disabled={formType === "view"}
                          {...register("firstName", { required: true })}
                          error={
                            errors.firstName?.type === "required" ? true : false
                          }
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <InputField
                          id="lastName"
                          label="Příjmení"
                          defaultValue=" "
                          disabled={formType === "view"}
                          {...register("lastName", { required: true })}
                          error={
                            errors.lastName?.type === "required" ? true : false
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <InputField
                          id="email"
                          label="Emailová adresa"
                          defaultValue=" "
                          disabled={formType === "view"}
                          {...register("email", {
                            required: true,
                            patter: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g
                          })}
                          error={
                            errors.email?.type === "required" ? true : false || errors.email
                              ? true
                              : false
                          }
                        />

                      </Grid>
                      <Grid item xs={6}>
                        <InputField
                          id="telephoneNumber"
                          label="Telefonní číslo"
                          type="number"
                          defaultValue="0"
                          disabled={formType === "view"}
                          {...register("telephoneNumber", { required: true })}
                          error={
                            errors.telephoneNumber?.type === "required"
                              ? true
                              : false
                          }
                        />
                      </Grid>
                    </GridSection>
                  </Grid>
                  <Grid item xs={12}>
                    <GridSection
                      title="Adresa budovy"
                      style={{ position: "relative" }}
                    >
                      {/* <div style={{color:"blue",position:"absolute",right:0,top:0}}>show next building</div> */}
                      {client?.addresses &&
                        Array.isArray(client?.addresses) &&
                        client?.addresses.length && (
                          <Typography
                            variant="body2"
                            color="primary"
                            className="pe-cursor"
                            component="span"
                            style={{ position: "absolute", left: mobileScreen ? 155 : 210, 
                            top: mobileScreen ? 4 : 5 }}
                            onClick={() => {
                              if (
                                client?.addresses &&
                                Array.isArray(client?.addresses)
                              ) {
                                if (
                                  client?.addresses.length &&
                                  client?.addresses.length - 1 > building
                                ) {
                                  setBuilding(building + 1);
                                } else {
                                  setBuilding(0);
                                }
                              } else {
                                setBuilding(-1);
                              }
                            }}
                          >
                            <Box component={"span"}>
                              Další budova <ChevronRightIcon width={mobileScreen ? "6" : "12"} />
                            </Box>
                          </Typography>
                        )}
                      <Grid item xs={6}>
                        <InputField
                          key={building + "street"}
                          id={`${building < 0
                            ? "street"
                            : [`addresses[${building}].street`]
                            }`}
                          label={"Ulice"}
                          defaultValue=" "
                          disabled={formType === "view"}
                          {...register(
                            `${building < 0
                              ? "street"
                              : [`addresses[${building}].street`]
                            }`,
                            { required: true }
                          )}
                          error={
                            errors[
                              `${building < 0
                                ? "street"
                                : [`addresses[${building}].street`]
                              }`
                            ]?.type === "required"
                              ? true
                              : false
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <InputField
                          key={building + "city"}
                          id={`${building < 0
                            ? "city"
                            : [`addresses[${building}].city`]
                            }`}
                          label={"Město"}
                          defaultValue=" "
                          disabled={formType === "view"}
                          {...register(
                            `${building < 0
                              ? "city"
                              : [`addresses[${building}].city`]
                            }`,
                            { required: true }
                          )}
                          error={
                            errors[
                              `${building < 0
                                ? "city"
                                : [`addresses[${building}].city`]
                              }`
                            ]?.type === "required"
                              ? true
                              : false
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <InputField
                          key={building + "zipCode"}
                          id={`${building < 0
                            ? "zipCode"
                            : [`addresses[${building}].zipCode`]
                            }`}
                          label="PSČ"
                          //type="number"
                          defaultValue="0"
                          disabled={formType === "view"}
                          {...register(
                            `${building < 0
                              ? "zipCode"
                              : [`addresses[${building}].zipCode`]
                            }`,
                            { required: true }
                          )}
                          error={
                            errors[
                              `${building < 0
                                ? "zipCode"
                                : [`addresses[${building}].zipCode`]
                              }`
                            ]?.type === "required"
                              ? true
                              : false
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                      <Box sx={{
                        textAlign: "end",
                        marginTop: mobileScreen ? -0.5 : -2
                      }}>
                        <Typography
                          variant="body2"
                          color="primary"
                          className="pe-cursor"
                          component="span"
                          onClick={handleToggleModal}
                        >
                          <LocationIcon width="12" style={{ marginTop: -2 }} />
                          <Box component={"span"} sx={{ marginLeft: mobileScreen ? 0.5 : 1, fontWeight: 500 }}>
                            Ukázat na mapě
                          </Box>
                        </Typography>
                        <MapSection
                          handleToggleModal={handleToggleModal}
                          openModal={openModal}
                          getValues={getValues}
                        />
                      </Box>
                      </Grid>
                    </GridSection>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <GridSection title="Revize">
                <ProvierErrorLoading
                  compromiseMessage="Profile is not updated"
                  compromiseCode={401}
                  reducer={"client"}
                  action={"getRevisionsbyIdAsyncThunk"}
                  asyncThunk={getRevisionsbyIdAsyncThunk}
                  loadingIndicator={"getRevisionsbyIdAsyncThunk"}
                >
                  {revisionsbyId.data.map((el) => (
                    <Grid item xs={4} sm={3} md={4} xl={3} style={{marginTop:5}}>
                      <PrintCard
                        fileName={el.type}
                        date= {el.timestamp}
                        id={el?.id}
                        printOptions={printOptions}
                        email={client.email}
                        fileUrl={el.pdfUrl}
                        subject={`Revizní zpráva - ${moment(
                          el.timestamp.seconds * 1000
                        ).format("DD. MM. YYYY")}`}
                      />
                    </Grid>
                  ))}
                  {revisionsbyId.data.length == 0 && ""}
                </ProvierErrorLoading>
              </GridSection>
            </Grid>

            {formType === "edit" && (
              <Grid item xs={12}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  spacing={2}
                >
                  <Button
                    component={Link}
                    to={`/clients/${id}`}
                    variant="Outline"
                  >
                    Zrušit
                  </Button>
                  <CustomButton
                    reducer="client"
                    action="updateClientAsyncThunk"
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
      {/* <EmailModal type={"initial"} /> */}
      {open && <PdfModal setOpen={() => setOpen(false)} open={open} />}
    </>
  );
};

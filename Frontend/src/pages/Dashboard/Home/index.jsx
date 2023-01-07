import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { CustomCard } from "components/Card";
import { PageHeader } from "utils/PageHeader";
import { CircularProgressBar } from "components/CircularProgressBar";
import { ThemeSwitch } from "components/ThemeSwitch";
import { Dropdown } from "components/Dropdown";
import { BarChart } from "components/Chart";
import { RevisionList } from "components/RevisionList";
import { NotificationIcon, WarningIcon } from "utils/icons";
import PlusCircleIcon from "assets/images/icons/plusIcon.webp";
import { CalendarSlider } from "components/CalendarSlider";
import { useDispatch, useSelector } from "react-redux";
import {
  dashboardAsyncThunk,
  getRevisionsAsyncThunk,
} from "redux/slices/revisionSlice";
import { yymm } from "helpers/firebaseHelper";
import ProvierErrorLoading from "components/CustomComponents/ProvierErrorLoading";
import SweetAlert from "react-bootstrap-sweetalert";
import { confirmAlert } from "react-confirm-alert";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import { collection, getDocs, updateDoc, where, doc, query, orderBy } from "firebase/firestore";
import { firestore } from "config/firebase";
import { toast } from "react-toastify";
import { countToLevels } from "helpers/detectError";
import { PdfModal } from "components/PdfModal";
import {
  getMeetingsForCountAsyncThunk,
} from "redux/slices/meetingSlice";
import moment from "moment";
import "moment/locale/cs";
import { useMediaQuery } from "@mui/material";
import { getToken, isSupported } from "firebase/messaging";
import { messaging } from "config/firebase";
import { setSettingsAsyncThunk } from "redux/slices/authSlice";
import { TextIncreaseSharp } from "@mui/icons-material";


/**
  * Komponenta/stránka přehledu
  * @return {} komponenta
  */


// povinné hodnoty uživatele
const profileKeys = {
  authorization: "Authorization",
  certificate: "Certificate",
  coPresenceName: "Co-Presence Name",
  coPresenceSerialNumber: "Co-Presence Serial Number",
  executingPlace: "Executing Place",
  gasDetectorName: "Gas Detector Name",
  gasDetectorSerialNumber: "Gas Detector Serial Number",
  imageUrl: "Image Url",
  pressureGaugeName: "Pressure Gauge Name",
  pressureGaugeSerialNumber: "Pressure Gauge Serial Number",
  //title: "Title",
  telephoneNumber: "Phone Number",
};

//notifikace
const notificationCollection = collection(firestore, "notifications");


export const Home = () => {
  const [open, setOpen] = useState(false);
  const mobileScreen = useMediaQuery("(max-width:385px)");
  const dispatch = useDispatch();
  const { analytics, revisions } = useSelector((state) => state.revision);
  const meetingsForCount = useSelector(
    (state) => state.meeting.meetingsForCount
  );
  const [slideIndex, setSlideIndex] = useState(0);
  const { uid, profile } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const theme = useTheme();
  const [notificationsData, setNotificationsData] = useState({});
  const notifications = useMemo(() => {
    return notificationsData.notifications
      ? notificationsData.notifications
      : [];
  }, [notificationsData.notifications]);


  useEffect(() => {
    const getNotifications = async () => {
      const notificationsData = {};
      try {
        notificationsData.loading = true;
        setNotificationsData(notificationsData);
        const qu = query(notificationCollection, where("userId", "==", uid), orderBy("time", "desc"))
        const snapshot = await getDocs(qu);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        notificationsData.notifications = data;
        notificationsData.loading = false;
        setNotificationsData(notificationsData);
      } catch (error) {
        notificationsData.error = error;
        notificationsData.loading = false;
        setNotificationsData(notificationsData);
        console.log(error);
        /**
         * @type {import("firebase/app").FirebaseError}
         */
        const firebaseError = error;
        toast.error(firebaseError.message || "Chyba na straně databáze!");
      }
    };
    getNotifications();
  }, []);


  useEffect(() => {
    if (!revisions.length) {
      dispatch(getRevisionsAsyncThunk({ perPage: 3, first: true }));
    }
    dispatch(dashboardAsyncThunk());
    dispatch(getMeetingsForCountAsyncThunk({ perPage: 10000, first: true }));
  }, []);


  const months = [
    "Leden",
    "Únor",
    "Březen",
    "Duben",
    "Květen",
    "Červen",
    "Červenec",
    "Srpen",
    "Září",
    "Říjen",
    "Listopad",
    "Prosinec",
  ];

  // měsíce v 1. pádu
  function getCzMonths(m1) {
    if (m1 === "ledna") {
      return "Leden"
    }
    if (m1 === "února") {
      return "Únor"
    }
    if (m1 === "března") {
      return "Březen"
    }
    if (m1 === "dubna") {
      return "Duben"
    }
    if (m1 === "května") {
      return "Květen"
    }
    if (m1 === "června") {
      return "Červen"
    }
    if (m1 === "července") {
      return "Červenec"
    }
    if (m1 === "srpna") {
      return "Srpen"
    }
    if (m1 === "září") {
      return "Září"
    }
    if (m1 === "října") {
      return "Říjen"
    }
    if (m1 === "listopadu") {
      return "Listopad"
    }
    if (m1 === "prosince") {
      return "Prosinec"
    }
    return ""
  }

  moment.locale('cs');
  const totalCount = analytics[uid] ?? 0;
  //porovnání aktuální a předchozího měsíce
  const Increased = (analytics[`${yymm}:${uid}`] ?? 0) - (analytics[`${moment().subtract(1, "month").format("YYYY/MM")
    }:${uid}`] ?? 0);
  const chartDataList = useMemo(() => Object.keys(analytics)
    // .filter((el) => /^(\d{4})\/((0[1-9])|(1[0-2]):)$/.test(el))
    .filter((el) => el.includes(`:${uid}`))
    .map((l) => {
      return {
        label: months[l.split("/")[1].split(":")[0] - 1],
        value: analytics[l],
        date: l,
      };
    }).sort((a, b) => {
      return moment(b.label, "MM").diff(moment(a.label, "MM"));
    }), [analytics, uid]);

  // Pokud chybí předchozí údaje k měsícům, doplnit nuly
  const reconstructedChartData = useMemo(() => {
    const list = chartDataList.length > 0 ? [...chartDataList] : [];
    if (list?.length < 5) {
      for (let i = 0; i < 5 - chartDataList?.length; i++) {
        const momentDate = chartDataList?.at(-1)?.label ? moment(chartDataList?.at(-1)?.date, "YYYY/MM") : moment();
        list.push({
          label: getCzMonths(momentDate.subtract(i + 1, "months").format("MMMM")),
          value: 0,
        });
      }
    }
    return list.reverse();
  }, [chartDataList]);
  const chartDataTitle = "User Data";
  //console.log(reconstructedChartData);

  // zisk aktuálního týdne pro calendarSlider
  const calendarData = useMemo(() => {
    const getData = (array, customMoment) => array.map((k) => {
      /**
       * @type {import("moment").Moment}
       */
      const date = customMoment.date(k);
      return {
        day: date.format("dddd"),
        date: date.format("DD"),
        metting: meetingsForCount.data?.filter(
          (l) => date.isSame(moment(l.dateFilter), "day")
        ).length ?? 0,
        meetingsData: meetingsForCount.data?.filter(
          (l) => date.isSame(moment(l.dateFilter), "day")
        ),
        month: date.format("MMMM"),
        year: date.format("YYYY"),
        properDate: date
      };
    });
    const daysInMonth = moment().daysInMonth();
    const daysInPrevMonth = moment().subtract(1, "months").daysInMonth();
    const daysInNextMonth = moment().add(1, "months").daysInMonth();
    const array = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const prevArray = Array.from({ length: daysInPrevMonth }, (_, i) => i + 1);
    const nextArray = Array.from({ length: daysInNextMonth }, (_, i) => i + 1);
    const data = getData(array, moment());
    const prevData = getData(prevArray, moment().subtract(1, "months"));
    const nextData = getData(nextArray, moment().add(1, "months"));
    return [...prevData, ...data, ...nextData];
  }, [meetingsForCount.data]);

  return (
    <>
      <PageHeader title="Přehled" subTitle="Vítej zpět.">
        <Box
          sx={{ display: "inline-flex", gap: 1 }}
          alignItems="center"
          justifyContent="center"
        >
          <ThemeSwitch />
          <Dropdown
            icon={
              <Box sx={{ position: "relative" }}>
                {notifications.some((e) => !e.isRead) && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      backgroundColor: theme.palette.primary.main,
                      position: "absolute",
                      right: 5,

                      borderRadius: 50,
                    }}
                  ></Box>
                )}
                <Typography color="secondary">
                  <NotificationIcon fill={theme.palette.primary.main} />
                </Typography>
              </Box>
            }
          >
            <Box
              sx={{
                width: "calc(90vw)",
                maxWidth: 350,
                minHeight: 100,
                maxHeight: 300,
                height: 300,
                overflowY: "auto",
                padding: notifications.length > 0 ? 3 : 2,
              }}
            >
              <Box>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => {
                    return (
                      <Box key={index}>
                        <Box
                          onClick={async () => {
                            try {
                              const notificationDoc = doc(
                                notificationCollection,
                                notification.id
                              );
                              await updateDoc(notificationDoc, {
                                isRead: true,
                              });
                              setNotificationsData((prev) => {
                                const newNotifications = prev.notifications;
                                newNotifications[index].isRead = true;
                                return {
                                  ...prev,
                                  notifications: newNotifications,
                                };
                              });
                            } catch (error) {
                              console.log(error);
                              setNotificationsData((prev) => {
                                return { ...prev, error };
                              });
                              toast.error(
                                error.message || "Něco se pokazilo"
                              );
                            }
                          }}
                          sx={{
                            paddingLeft: 3,
                            position: "relative",
                            cursor: "pointer",
                            userSelect: "none",
                          }}
                        >
                          <Box
                            backgroundColor={
                              notification.isRead
                                ? theme.palette.secondary.main
                                : theme.palette.primary.main
                            }
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: 50,
                              position: "absolute",
                              left: 0,
                              top: "50%",
                            }}
                          ></Box>
                          {notification.name && (
                            <Typography
                              variant="body2"
                              color="secondary"
                              className={"mb-1"}
                              sx={{
                                fontSize: 14,
                              }}
                            >
                              {notification.name}
                            </Typography>
                          )}
                          {notification.title && (
                            <Typography
                              style={{
                                fontWeight: 600, marginTop: -5,
                                fontSize: mobileScreen ? "0.85rem" : "1rem"
                              }}
                              className="mb-2"
                            >
                              {notification.title}
                            </Typography>
                          )}
                          {notification.description && (
                            <Typography
                              style={{
                                fontSize: 14,
                              }}
                              variant="body"
                            >
                              {notification.description}
                            </Typography>
                          )}
                        </Box>
                        {index + 1 !== notifications.length && (
                          <Divider sx={{ marginY: 1, color: theme.palette.third.main, opacity: 0.3, borderWidth: 1 }} />
                        )}
                      </Box>
                    );
                  })
                ) : notificationsData.loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress size={120} />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: 250,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography color={"secondary"} textAlign="center">
                      Žádná upozornění
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Dropdown>
        </Box>
      </PageHeader>
      <Box>
        <Grid container spacing={{ xs: 1, md: 2, lg: 3, xl: 5 }}>
          <Grid item xs={6} md={3} lg={3}>
            <CustomCard title={mobileScreen ? "Vytvořit revizi" : "Vytvořit novou revizi"}>
              <Box className="text-center px-3 px-sm-4">
                <Link
                  to={"revision"}
                  onClick={(e) => {
                    e.preventDefault();
                    const haveAllFields = Object.keys(profileKeys)
                      .map((el) => profile?.[el])
                      .every((el) => el);
                    if (!haveAllFields) {
                      // const emptyFields = Object.keys(profileKeys).filter(el=> !profile[el]);
                      confirmAlert({
                        title: "Nedokončená registrace!",
                        overlayClassName: "alert-overlay",
                        message:
                          "Nejdříve musíš vyplnit všechny požadované údaje a zaregistrovat nástroje.",
                        customUI: ({ onClose, title, message }) => (
                          <SweetAlert
                            onConfirm={() => {
                              onClose();
                              navigate("/profile");
                            }}
                            onCancel={onClose}
                            confirmBtnText="Přejít do mého profilu"
                            cancelBtnCssClass="d-none"
                            custom
                            title={
                              <div
                                style={{
                                  color: theme.palette.text.primary,
                                  fontSize: 20,
                                }}
                              >
                                {title}
                              </div>
                            }
                            //confirmBtnBsStyle="primary"
                            //cancelBtnBsStyle="default"
                            confirmBtnCssClass="w-100"
                            customIcon={
                              <div
                                style={{
                                  color: theme.palette.primary.main,
                                }}
                                className="mb-3"
                              >
                                <WarningIcon width="100" />
                              </div>
                            }
                            confirmBtnStyle={{
                              fontSize: 16,
                              fontWeight: 500,
                              background: theme.palette.primary.main,
                              boxShadow: 0,
                              borderColor: theme.palette.primary.main,
                            }}
                            style={{
                              backgroundColor: theme.palette.background.paper,
                            }}
                          >
                            <div
                              style={{
                                color: theme.palette.secondary.main,
                                fontSize: 16,
                                fontWeight: 500,
                              }}
                            >
                              {message}
                            </div>
                          </SweetAlert>
                        ),
                      });
                    } else {
                      navigate("/revision");
                    }
                  }}
                >
                  <embed
                    src={PlusCircleIcon}
                    alt="Circle Plus"
                    className="mw-150px w-100 ratio-1x1"
                  />
                </Link>
              </Box>
            </CustomCard>
          </Grid>
          <Grid item xs={6} md={3} lg={3}>
            <CustomCard title="Celkový počet revizí">
              <Box className=" px-3 px-sm-4 text-center">
                <CircularProgressBar value={
                  totalCount
                } level={countToLevels(+totalCount ?? 0)[1]} />
              </Box>
              <Typography
                variant="subtitle2"
                textAlign="center"
                color="secondary"
                fontWeight={"500"}
              >
                Úroveň: {countToLevels(+totalCount ?? 0)[0]}
              </Typography>
            </CustomCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomCard>
              <CalendarSlider
                // startDate={calendarData[0]?.date ?? "00"}
                // endDate={calendarData[calendarArr.length - 1]?.date ?? "00"}
                calendarData={calendarData}
                setSlideIndex={setSlideIndex}
                slideIndex={slideIndex}
              />
            </CustomCard>
          </Grid>
          <Grid item xs={12} md={6} order={{ xs: 3, md: 2 }}>
            <CustomCard title="Měsíční vývoj počtu revizí" align="left">
              <Typography variant="body2" color="secondary" style={{ marginTop: -10 }}>
                Bilance
                <Box component={"span"} sx={{ color: Increased > 0 ? theme.palette.text.green : Increased === 0 ? "primary.main" : "red" }}>
                  {" "}
                  {Increased > 0 ? `+${Increased}` : Increased}
                </Box>
              </Typography>
              <Box>
                <BarChart
                  chartData={reconstructedChartData}
                  chartDataTitle="počet revizí"
                />
              </Box>
            </CustomCard>
          </Grid>
          <Grid item xs={12} md={6} order={{ xs: 2, md: 3 }}>
            <CustomCard title="Nedávno vytvořené revize" align="left">
              <ProvierErrorLoading
                compromiseMessage="Revisions not found"
                compromiseCode={401}
                reducer={"revision"}
                action={"getRevisionsAsyncThunk"}
                asyncThunk={getRevisionsAsyncThunk}
                loadingIndicator={"getRevisionsAsyncThunk"}
              >
                <RevisionList listArr={revisions.data?.slice(0, 3)} />
              </ProvierErrorLoading>
            </CustomCard>
          </Grid>
        </Grid>
      </Box>
      <PdfModal />
    </>
  );
};

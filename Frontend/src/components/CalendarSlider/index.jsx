import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { MapSection } from "components/Map";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  LocationIcon,
} from "utils/icons";
import ProvierErrorLoading from "components/CustomComponents/ProvierErrorLoading";
import { getMeetingsForCountAsyncThunk } from "redux/slices/meetingSlice";
import moment from "moment";
import "moment/locale/cs";
import { Dropdown } from "components/Dropdown";


export const CalendarSlider = ({ calendarData, setSlideIndex, slideIndex }) => {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [mapModalNumbner, setmapModalNumbner] = useState(null);
  const handleToggleModal = (number) => {
    setmapModalNumbner(number);
    setOpenModal(!openModal);
  };

  function getCzMonths(m1){
    if (m1 === "ledna"){
      return "Leden"
    }
    if (m1 === "února"){
      return "Únor"
    }
    if (m1 === "března"){
      return "Březen"
    }
    if (m1 === "dubna"){
      return "Duben"
    }
    if (m1 === "května"){
      return "Květen"
    }
    if (m1 === "června"){
      return "Červen"
    }
    if (m1 === "července"){
      return "Červenec"
    }
    if (m1 === "srpna"){
      return "Srpen"
    }
    if (m1 === "září"){
      return "Září"
    }
    if (m1 === "října"){
      return "Říjen"
    }
    if (m1 === "listopadu"){
      return "Listopad"
    }
    if (m1 === "prosince"){
      return "Prosinec"
    }
    return ""
  }

  const meetings = [
    {
      name: "Jordan White",
      startTime: "12:00",
      endTime: "02:00",
      subtitle: "Capital 22",
    },
    {
      name: "Alex Black",
      startTime: "12:00",
      endTime: "02:00",
      subtitle: "Red Ave. 42",
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CustomSwiperButton
          className={"custom-swiper-button-prev"}
          icon={<ChevronLeftIcon width="12" height="12" />}
        />
        <Typography align="center" variant="h4" className="mb-2">
          {getCzMonths(calendarData[slideIndex].month)},{" "}
          <Typography component={"span"} variant="h4" color="secondary">
            {calendarData[slideIndex].year}
          </Typography>
        </Typography>
        <CustomSwiperButton2
          className={"custom-swiper-button-next"}
          icon={<ChevronRightIcon width="12" height="12" />}
        />
      </Box>
      <Typography
        color="secondary"
        align="center"
        variant="h5_old"
        className="mb-3"
      >
        &nbsp;
        {/* {startDate} - {endDate} */}
      </Typography>
      <Swiper
        slidesPerView={3.5}
        spaceBetween={30}
        navigation={
          (true,
          {
            nextEl: ".custom-swiper-button-next",
            prevEl: ".custom-swiper-button-prev",
          })
        }
        onSlideChange={(swiper) => {
          setSlideIndex(swiper.realIndex);
        }}
        initialSlide={
          moment().date() + moment().subtract(1, "month").daysInMonth() - 1
        }
        grabCursor={true}
        modules={[Navigation]}
        breakpoints={{
          600: {
            slidesPerView: 4,
          },
          820: {
            slidesPerView: 5,
          },

          900: {
            slidesPerView: 3.5,
          },

          1200: {
            slidesPerView: 3,
          },
          1536: {
            slidesPerView: 4.5,
          },
        }}
        className="mySwiper"
      >
        <ProvierErrorLoading
          compromiseMessage="Schůzky nenalezeny"
          compromiseCode={401}
          reducer={"meeting"}
          action={"getMeetingsForCountAsyncThunk"}
          asyncThunk={getMeetingsForCountAsyncThunk}
          loadingIndicator={"getMeetingsForCountAsyncThunk"}
        >
          {calendarData &&
            calendarData.length > 0 &&
            calendarData.map((calendar, index) => {
              moment.locale('cs');
              return (
                <SwiperSlide key={index}>
                  <Box
                    elevation={3}
                    sx={{
                      border: "4",
                      borderStyle: "solid",
                      borderRadius: 1,
                      borderColor: theme.palette.secondary.calendar,
                      paddingY: { xs: 1, sm: 3 },
                      paddingX: 1,
                      width: "100%",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: { xs: 1, sm: 2 },
                    }}
                  >
                    <Typography variant="body2" fontWeight={"600"}>
                      {calendar.day}
                    </Typography>
                    <Typography variant="h3" color="secondary">
                      {calendar.date}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    > 
                      {calendar.metting < 1 ? (
                        <Typography
                          variant="subtitle2"
                          color="primary"
                          fontWeight={"500"}
                        >
                          &nbsp;
                        </Typography>
                      ) : (
                        <Dropdown
                          title={
                            <Box sx={{
                              display: "flex",
                              gap: 1,
                              justifyContent: "center",
                              alignItems: "center",
                            }}>
                            <Paper
                              sx={{
                                width: 3,
                                height: 3,
                                background: theme.palette.primary.main,
                                borderRadius: "50%",
                                boxShadow: "0px 0px 4px 1px rgba(0, 133, 255, 1)",
                              }}
                            ></Paper>
                            <Typography
                              variant="subtitle2"
                              color="primary"
                              fontWeight={"500"}
                            >
                              {calendar.metting} {calendar.metting > 1 ? "schůzky" : "schůzka"}
                              
                            </Typography>
                            </Box>
                          }
                          //Meeting detail
                          children={
                            <Box padding={2} width={{ xs: 250, sm: 350 }}>
                              <Box sx={{marginTop: -1.5}}>
                                <Typography variant="h5_old" >Schůzky</Typography>
                                <Typography
                                  variant="subtitle2"
                                  color="secondary"
                                >
                                  {calendar.date}. 
                                  {" " + calendar.month}
                                  {" " + calendarData[slideIndex].year}
                                </Typography>
                              </Box>
                              <Divider sx={{ marginY: 0.5, borderBottomWidth: 1.5, opacity:0.5 }} />
                              {calendar.meetingsData.map((data, index) => (
                                <Box key={index}>
                                  <Grid container spacing={0} marginTop={1}>
                                    <Grid item xs={6}>
                                      <Typography variant="h6">
                                        {data.name}
                                      </Typography>
                                      <Typography
                                        variant="subtitle2"
                                        color="secondary"
                                      >
                                        <Box component="span" marginRight={1}>
                                          <ClockIcon/>
                                        </Box>
                                        {moment(data?.from?.toDate()).format('LT')} - {moment(data?.to?.toDate()).format("LT")}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6} textAlign="end">
                                      <Typography
                                        variant="subtitle2"
                                        color="secondary"
                                      >
                                        {data.street}, {data.city}
                                      </Typography>
                                      <Typography
                                        variant="subtitle2"
                                        color="primary"
                                        sx={{ cursor: "pointer" }}
                                        onClick={() => handleToggleModal(index)}
                                      >
                                        <Box component="span" marginRight={1}>
                                          <LocationIcon />
                                        </Box>
                                        Ukázat na mapě
                                      </Typography>
                                      {mapModalNumbner === index && (
                                        <MapSection
                                          handleToggleModal={handleToggleModal}
                                          openModal={openModal}
                                          getValues={(key) => data[key]}
                                        />
                                      )}
                                    </Grid>
                                  </Grid>
                                  {index < meetings.length && (
                                    <Divider sx={{ marginY: 1 }} />
                                  )}
                                </Box>
                              ))}
                            </Box>
                          }
                        />
                      )}
                    </Box>
                  </Box>
                </SwiperSlide>
              );
            })}
        </ProvierErrorLoading>
      </Swiper>
    </Box>
  );
};

const CustomSwiperButton = ({ className, icon }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 30,
        height: 30,
        borderRadius: 50,
        border: 1,
        borderColor: theme.palette.secondary.main,
        cursor: "pointer",
      }}
      className={className}
    >
      <Typography color="secondary" marginTop={-0.2} marginRight={0.3}>{icon}</Typography>
    </Box>
  );
};

const CustomSwiperButton2 = ({ className, icon }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 30,
        height: 30,
        borderRadius: 50,
        border: 1,
        borderColor: theme.palette.secondary.main,
        cursor: "pointer",
      }}
      className={className}
    >
      <Typography color="secondary" marginTop={-0.2} marginLeft={0.3}>{icon}</Typography>
    </Box>
  );
};

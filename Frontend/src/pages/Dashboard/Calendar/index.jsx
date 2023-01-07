import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getRevisionsAsyncThunk } from "redux/slices/revisionSlice";
import moment from "moment";
import "moment/locale/cs";
import { ClientModal } from "components/ClientModal";
import { useState } from "react";
import { Button, styled, useTheme } from "@mui/material";
import { PageHeader } from "utils/PageHeader";
import { MeetingModal } from "components/MeetingModal";
import { useModalContext } from "context/ModalContext";
import { getMeetingsAsyncThunk } from "redux/slices/meetingSlice";
import { MeetingDetail } from "components/MeetingDetail";
import AddIcon from '@mui/icons-material/Add';

/**
  * Komponenta/stránka kalendáře
  *
  * @return {} komponenta
  */

moment.locale('cs');
const localizer = momentLocalizer(moment);

const dayFormat = (date, culture, localizer) => localizer.format(date, 'D. MM. ', culture);

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


export const getDate = (e) => {
  if (e.includes("T")) {
    return new Date(e);
  } else {
    var tdate = e.split("-");
    return new Date(+tdate[2], tdate[1] - 1, +tdate[0]);
  }
};


const CalendarWrapper = styled("div")(({ theme }) => `
  .rbc-btn-group button {
    background-color: ${theme.palette.background.default};
    color: ${theme.palette.text.primary};
    border-color: ${theme.palette.secondary.main};
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .rbc-toolbar-label {
    color: ${theme.palette.text.primary};
    font-weight: 600;
    font-size: 1.5rem;
  }
  
  .rbc-month-view{
    border-color: ${theme.palette.secondary.main};
  }

  .rbc-time-view{
    border-color: ${theme.palette.secondary.main};
  }

  .rbc-time-content{
    border-color: ${theme.palette.secondary.main};
  }

  .rbc-time-header{
    border-color: ${theme.palette.secondary.main};
  }

  .rbc-day-slot rbc-time-column {
    border-color: ${theme.palette.secondary.main};
  }

  .rbc-day-slot .rbc-time-slot {
    border-color: ${theme.palette.third.main};
  }
  .rbc-events-container {
    border-color: ${theme.palette.secondary.main};
  }
  
  .rbc-timeslot-group{
    border-color: ${theme.palette.secondary.main};
  }

  .rbc-month-row{
    border-color: ${theme.palette.secondary.main};
  }
  
  .rbc-header{
    border-color: ${theme.palette.secondary.main};
  }

  .rbc-day-bg {
    border-color: ${theme.palette.secondary.main};
  }
  

  .rbc-btn-group button:hover, .rbc-active {
    background-color: ${theme.palette.text.primary} !important;
    color: ${theme.palette.background.default} !important;
  }
  .rbc-show-more {
    color: ${theme.palette.text.primary} !important;
    background-color: transparent !important;
  }
  .rbc-off-range-bg {
    cursor: not-allowed;
    background-color: ${theme.palette.mode === "dark" ? "#999" : "#ddd"} !important;
  }
  .rbc-off-range {
    color: ${theme.palette.text.primary} !important;
  }

`
);


const MyCalendar = () => {
  const revisions = useSelector((s) => s.revision.revisions);
  const meetings = useSelector((s) => s.meeting.meetings);
  const [selectedDate, setSelectedDate] = useState(false);
  const theme = useTheme();
  const style = {
    height: 500,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.secondary.main,
  };

  const d = useDispatch();
  const [open, setOpen] = useState(false);
  const [modelType, setModelType] = useState(false);
  const [data, setData] = useState(null);
  useEffect(() => {
    d(getRevisionsAsyncThunk({ perPage: Infinity, first: true }));
    d(getMeetingsAsyncThunk({ perPage: Infinity, first: true }));
  }, []);
  const myEventsList = [...revisions.data.map((el) => {
    return {
      ...el,
      type: "revision",
      title: `Expirace revize klienta: ${el.client.firstName + " " + el.client.lastName}`,
      allDay: true,
      start: getDate(el.additionalInformation.nextRevisionDate),
      end: getDate(el.additionalInformation.nextRevisionDate),
    };
  }),
  ...meetings.data.map((el) => {
    return {
      ...el,
      type: "meeting",
      title: el.meetingTitle || `Schůzka s klientem: ${el.name}`,
      start: el.from?.toDate(),
      end: el.to?.toDate(),
    };
  })
  ];

  return (
    <CalendarWrapper>
      <PageHeader
        title="Kalendář"
        children={
          <Button variant="contained" disableElevation sx={{fontWeight:500}} startIcon={<AddIcon />} onClick={()=> {
            setSelectedDate(true)
          }}>
            Nová schůzka
          </Button>
        }
      />
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        formats={{
          dayFormat
        }}
        style={style}
        selectable
        messages={{next:"Později", previous:"Dříve", today:"Dnes", month:"Měsíc", day:"Den", week:"Týden", showMore: total => `+${total} další`}}
        eventPropGetter={(event, start, end, type, isSelected) => {
          let newStyle = {
            backgroundColor: event.type === "meeting" ? "orange" : theme.palette.primary.main,
            // backgroundColor: 'orange',
            fontSize: 12,
            // color: "white",
            // borderRadius: "0px",
            border: 0,
          };

          if (event.isMine) {
            newStyle.backgroundColor = "lightgreen";
          }

          return {
            className: "",
            style: newStyle,
            
          };
        }}
        dayPropGetter={date=> {
          if(moment(date).isSame(moment(), 'day')){
            return {
              style: {
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.disabled,
                cursor: "pointer",
              }
            }
          } else {
            return {
              style: {
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                cursor: "pointer",
              }
            }
          }
        }}
        
        onSelectEvent={(e) => {
          setData(e);
          setModelType(e.type)
          setOpen(true);
        }}
        
        onSelectSlot={(e) => {
          setSelectedDate(e);
        }}
        views={["month", "week", "day"]}
        onView={(e)=> {
          //console.log(e)
        }}
      />
        <ClientModal
          open={open&& modelType =="revision"}
          setOpen={() => {
            setOpen(false);
            setData(null);
          }}
          data={data}
        />
        <MeetingDetail
          open={open && modelType =="meeting"}
          setOpen={() => {
            setOpen(false);
            setData(null);
          }}
          data={data}
        />
      <MeetingModal open={selectedDate} handleModelClose={()=> setSelectedDate(false)} />
    </CalendarWrapper>
  );
};
export default MyCalendar;

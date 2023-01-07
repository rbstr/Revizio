import React from "react";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/system/Box";
import {
  Autocomplete,
  Button,
  createFilterOptions,
  DialogTitle,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { GridSection } from "components/GridSection";
import { InputField } from "utils/InputField";
import { useModalContext } from "context/ModalContext";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createMeetingAsyncThunk } from "redux/slices/meetingSlice";
import CustomButton from "components/CustomComponents/CustomButton";
import { ChevronRightIcon } from "utils/icons";
import moment from "moment";
import { useEffect } from "react";
import { getClientsAsyncThunk } from "redux/slices/clientsSlice";
import { useState } from "react";
import { BlurryDialogModal } from "utils/BlurryDialogModal";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "dayjs/locale/cs";
import { useTheme } from "@emotion/react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


/**
  * Modal k uložení nové schůzky v kalendáři
  *
  * @param {open} x 
  * @param {handleModelClose} x 
  * @return {} komponenta
  */

// 0-23 with 15 min interval
const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
  const hours = Math.floor(i / 4);
  const minutes = (i % 4) * 15;
  return `${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
});
const filter = createFilterOptions();


export const MeetingModal = ({ open, handleModelClose }) => {
  //moment.locale("cs")

  const theme = useTheme();
  const d = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control
  } = useForm();
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [client, setClient] = useState(null);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const { clients } = useSelector((state) => state.client);
  useEffect(() => {
    d(getClientsAsyncThunk({ perPage: Infinity, first: true }));
  }, []);
  useEffect(()=> {
    if(typeof open !== "boolean") {
      setValue("date", open.start?.toISOString())
    }
  },[open])
  const onSubmit = (data) => {
    d(
      createMeetingAsyncThunk({
        data: {
          ...data,
          from: moment(data?.date)
            .set({
              hours: +from.split(":")[0],
              minutes: +from.split(":")[1],
            })
            .toDate(),
          to: moment(data?.date)
            .set({
              hours: +to.split(":")[0],
              minutes: +to.split(":")[1],
            })
            .toDate(),
          meetingDate: data?.date,
          name: client.name,
        },
        callBack: handleModelClose,
        fetchMeetings: true,
      })
    );
  };

  const mobileScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    const options = ["street", "city", "zipCode"];
    options.forEach((option) => {
      if (client && client[option]) {
        setValue(option, client[option]);
      }
    });
  }, [client]);
  return (
    <BlurryDialogModal onClose={handleModelClose} fullWidth maxWidth={"sm"} scroll={"body"} open={open}>
      <DialogTitle variant="h5" sx={{marginBottom: -2}}>
        Vytvořit schůzku
      </DialogTitle>
      <DialogContent>
      <Divider sx={{ 
          borderColor: theme.palette.secondary.main, 
          borderBottomWidth: 1.5, opacity: 0.5, marginTop: 1, marginBottom: 3 }} />
        <GridSection>
          <Grid item xs={5}>
            <Autocomplete
              id="clientName"
              options={clients.data || []}
              getOptionLabel={(option) => {
                if (typeof option === "string") {
                  return option;
                }
                // Add "xxx" option created dynamically
                if (option.name) {
                  return option.name;
                }
                //console.log(option);
                // Regular option
                return `${option.firstName} ${option.lastName}`;
              }}
              renderInput={(params) => (
                <InputField
                  label="Jméno klienta"
                  {...params}
                  InputProps={{
                    ...params?.InputProps,
                    disableUnderline: true,
                  }}
                />
              )}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some(
                  (option) =>
                    inputValue === `${option.firstName} ${option.lastName}`
                );
                if (inputValue !== "" && !isExisting) {
                  filtered.push({
                    name: inputValue,
                  });
                }
                return filtered;
              }}
              freeSolo
              onChange={(e, value) => {
              //console.log("VALUE:DDL", value);
                if (typeof value === "string") {
                  setClient({ name: value });
                } else if (value && (value.inputValue || value.name)) {
                  setClient({ name: value.inputValue, ...value });
                } else if (value) {
                  setClient({
                    name: `${value.firstName} ${value.lastName}`,
                    ...value,
                  });
                }
              }}
              value={client}
              open={optionsOpen}
              onOpen={() => {
                setOptionsOpen(true);
              }}
              onClose={() => {
                setOptionsOpen(false);
              }}
            />
          </Grid>

          <Grid item xs={7} sx={{ display: "flex" }} alignItems="end">
            <Controller
              name={"date"}
              control={control}
              {...register("date", { required: true })}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="cs">
                  <DesktopDatePicker
                    label={"Datum schůzky"}
                    control={control}
                    inputFormat="DD. MM. YYYY"
                    value={value}
                    onChange={(event) => {
                      try {
                        onChange(event?.toISOString());
                      } catch (error) {}
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
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              renderInput={(params) => (
                <InputField
                  id="dateFrom"
                  {...params}
                  InputProps={{
                    ...params?.InputProps,
                    disableUnderline: true,
                  }}
                  label={errors.dateFrom?.message ?? "Od"}
                />
              )}
              options={timeSlots}
              getOptionLabel={(option) => option}
              onChange={(e, value) => setFrom(value)}
              value={from}
              getOptionDisabled={(option) => {
                if (!to) return false;
                const [hours, minutes] = option.split(":");
                const [toHours, toMinutes] = to.split?.(":");
                return (
                  hours > toHours || (hours === toHours && minutes >= toMinutes)
                );
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              renderInput={(params) => (
                <InputField
                  id="dateTo"
                  label={errors.dateTo?.message ?? "Do"}
                  {...params}
                  InputProps={{
                    ...params?.InputProps,
                    disableUnderline: true,
                  }}
                />
              )}
              options={timeSlots}
              // Disable all options before the FROM time
              getOptionLabel={(option) => option}
              onChange={(e, value) => setTo(value)}
              value={to}
              getOptionDisabled={(option) => {
                if (!from) return false;
                const [hours, minutes] = option.split(":");
                const [fromHours, fromMinutes] = from.split(":");
                return (
                  hours < fromHours ||
                  (hours === fromHours && minutes < fromMinutes)
                );
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider textAlign="center" color={theme.palette.third.main}>
            <Typography color="secondary" sx={{ fontSize: 14 }}>Nepovinné</Typography>
            </Divider>
          </Grid>
          <Grid item xs={4}>
            <InputField
              id="street"
              label={errors.street?.street ?? "Ulice"}
              {...register("street", { required: false })}
              error={errors.street ? true : false}
            />
          </Grid>
          <Grid item xs={4}>
            <InputField
              id="city"
              label={errors.city?.street ?? "Město"}
              {...register("city", { required: false })}
              error={errors.city ? true : false}
            />
          </Grid>
          <Grid item xs={4}>
            <InputField
              id="zipCode"
              type="number"
              label={errors.zipCode?.street ?? "PSČ"}
              {...register("zipCode", { required: false })}
              error={errors.zipCode ? true : false}
            />
          </Grid>
          <Grid item xs={12} marginTop={4}>
            <Box sx={{ textAlign: "end" }}>
              <Button onClick={handleModelClose} color={"secondary"}>
                Zrušit
              </Button>
              <CustomButton
                onClick={handleSubmit(onSubmit)}
                btnProps={{ autoFocus: true, variant: "contained" }}
                title={"Uložit"}
                reducer="meeting"
                action="createMeetingAsyncThunk"
              />
            </Box>
          </Grid>
        </GridSection>
      </DialogContent>
    </BlurryDialogModal>
  );
};

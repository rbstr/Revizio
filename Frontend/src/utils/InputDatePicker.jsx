import React, { forwardRef } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { InputField } from "./InputField";

/**
  * Komponenta pro date picker
  *
  * @return {} komponenta
  */

export const InputDatePicker = forwardRef((props, ref) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DesktopDatePicker
        {...props}
        ref={ref}
        renderInput={(params) => (
          <InputField
            InputProps={{
              ...params?.InputProps,
              disableUnderline: true,
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
});

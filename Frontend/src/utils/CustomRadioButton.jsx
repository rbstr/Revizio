import React, { forwardRef } from "react";
import { FormControlLabel, Radio } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";

/**
  * Komponenta pro vlastní radio button
  *
  * @return {} komponenta
  */

export const CustomRadioButton = forwardRef((props, ref) => {
  const theme = useTheme();
  const mobileScreen = useMediaQuery("(max-width:600px)");
  return (
    <FormControlLabel
      sx={{
        width: "100%",
        display: "block",
        border: 1,
        margin: 0,
        borderRadius: mobileScreen? 1.5 : 1.25,
        height: mobileScreen? 45: 60,
        borderColor: props.checked
          ? theme.palette.secondary.main
          : theme.palette.secondary.main,
        position: "relative",
      }}
      control={
        <Radio
          ref={ref}
          {...props}
          sx={{
            //position: "relative",
            top: 0,
            right: 0,
            display: "none",
          }}
        />
      }
      label={props.label}
    />
  );
});

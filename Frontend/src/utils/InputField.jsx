import React, { forwardRef,useRef } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import { InputAdornment } from '@mui/material';

/**
  * Komponenta pro textové pole
  *
  * @return {} komponenta
  */

export const InputField = forwardRef((props, ref) => {
  const mobileScreen = useMediaQuery("(max-width:600px)");
  const theme = useTheme();
  const label = useRef(props.label);
  const helperText = useRef (props.helperText);
  const inputAdor =  useRef(props.inputAdor)
  return (
    <TextField
      variant="filled"
      InputProps={{ disableUnderline: true, ...props?.InputProps}}
      sx={{
        "& .MuiFormLabel-root": {
          fontSize: mobileScreen ? "0.85rem" : "1rem",
          lineHeight: mobileScreen ? 1.2 : 1.6,
          fontWeight: 400,
        "&.MuiInputLabel-shrink": {
          fontSize: mobileScreen ? "0.9rem" : "1.1rem",
          lineHeight: mobileScreen ? 1.5 : 1.5,
        }
        },
        "& .MuiFilledInput-root": {
          border: `1px solid ${
            props.error ? "red" : theme.palette.secondary.main
          }`,
          overflow: "hidden",
          height: mobileScreen ? 45 : 60,
          borderRadius: mobileScreen ? 1.5 : 1.25,
          fontSize: mobileScreen ? "0.85rem" : "1rem",
          fontWeight: "500",
          background: "none",
          transition: theme.transitions.create([
            "border-color",
            "background-color",
            "box-shadow",
          ]),
          "&:hover": {
            background: "none",
          },
          "&.Mui-focused": {
            background: "none",
            borderColor: props.error ? "red" : theme.palette.primary.main,
          },
          "&.Mui-disabled": {
            background: "none",
          },
        },
      }}
      fullWidth
      {...props}
      ref={ref}
      label={label.current}
      helperText={props.error ? props.label : helperText.current}
      FormHelperTextProps={{ sx: { fontSize: { xs: 8, sm: 12 }, ml: 0.5 } }}
      InputLabelProps={{...props?.InputLabelProps,  style: { color: theme.palette.secondary.main, opacity: 1}, }}
    >
      {props.options &&
        props.options.map((option, index) => {
          return (
            <MenuItem key={index} value={option.value}>
              {option.name}
            </MenuItem>
          );
        })}
    </TextField>
  );
});

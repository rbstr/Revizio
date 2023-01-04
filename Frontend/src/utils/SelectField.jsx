import React, { forwardRef } from "react";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import {
  Box,
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { ArrowDownIcon } from "./icons";
import { Controller } from "react-hook-form";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6.5 + ITEM_PADDING_TOP,
    },
  },
};

export const ReactHookFormSelect = forwardRef((props, ref) => {
  const smallScreen = useMediaQuery("(max-width:600px)");
  const theme = useTheme();
  const labelId = `list-label-${props.name}`;
  return (
    <Controller
      {...props}
      control={props.control}
      render={({ field, fieldState: { error } }) => (
        <FormControl
          variant="filled"
          sx={{
            "& .MuiFormLabel-root": {
              fontSize: smallScreen ? "0.85rem" : "1rem",
              lineHeight: smallScreen ? 1.2 : 1.6,
              fontWeight: 400,
              "&.MuiInputLabel-shrink": {
                fontSize: smallScreen ? "0.8rem" : "1.1rem",
                lineHeight: smallScreen ? 1 : 1.5,
              }
            },
            "& .MuiFilledInput-root": {
              border: `1px solid ${props.error ? "red" : theme.palette.secondary.main
                }`,
              overflow: "hidden",
              height: smallScreen ? 45 : 60,
              borderRadius: smallScreen ? 1.5 : 1.25,
              fontSize: smallScreen ? "0.85rem" : "1rem",
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
            }
          }}
          fullWidth
          IconComponent={false}
        >
          <InputLabel id={labelId}>{props.label}</InputLabel>
          <Select
            disableUnderline
            MenuProps={MenuProps}
            ref={ref}
            displayEmpty
            {...props}
            {...field}
            error={error ? true : false}
            helperText={error ? error.message : ""}
            IconComponent={() => (
              <Box
                sx={{
                  width: smallScreen ? 20 : 25,
                  height: smallScreen ? 20 : 25,
                  borderRadius: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  right: smallScreen ? 8 : 16,
                  position: "absolute",
                  zIndex: -3,
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    width: smallScreen ? 20 : 25,
                    height: smallScreen ? 20 : 25,
                    borderRadius: 50,
                    background: theme.palette.primary.main,
                    opacity: 0.1,
                    position: "absolute",
                  }}
                ></Box>
                <ArrowDownIcon width={smallScreen ? 8 : 12} color={theme.palette.primary.main} />
              </Box>
            )}
          >
            {props.options.map((option, index) => (
              <MenuItem
                key={index}
                value={option.value}
                sx={
                  props.fixedTop && index === 0
                    ? {
                      position: "sticky",
                      top: 0,
                      left: 0,
                      zIndex: 1,
                      "&.MuiMenuItem-root": {
                        background:
                          theme.palette.mode === "light"
                            ? "#FFFFFF"
                            : "#343434",

                        "&.Mui-selected": {
                          background:
                            theme.palette.mode === "light"
                              ? "#FFFFFF"
                              : "#343434",
                        },
                        paddingY: 1,
                        minHeight: "auto",
                      },
                    }
                    : {
                      "&.MuiMenuItem-root": {
                        background: "inherit",
                        
                        "&.MuiMenuItem-root:hover": {
                          background: theme.palette.third.main
                        },

                        "&.Mui-selected": {
                          background: "inherit",
                        },
                        paddingY: 1,
                        minHeight: "auto",
                      },
                    }
                }
              >
                {props.multiple ? (
                  <Checkbox
                    sx={{ paddingY: 0 }}
                    checked={
                      props.defaultValue === option.value ||
                      props.defaultValue?.includes(option.value)
                    }
                  />
                ) : (
                  ""
                )}
                <ListItemText primary={option.name} />
              </MenuItem>
            ))}
            <Box sx={{ boxShadow: 3, pt: 1 }}>
              {props.addnew && props.addnew}
            </Box>
          </Select>
        </FormControl>
      )}
    />
  );
});

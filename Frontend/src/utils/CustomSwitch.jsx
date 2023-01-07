import React from "react";
import { styled } from "@mui/material";
import Switch from "@mui/material/Switch";

/**
  * Komponenta pro vlastní theme switch
  *
  * @return {} komponenta
  */

const NotificationSwitch = styled((props) => (
  <Switch
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    {...props}
  />
))(({ theme }) => ({
  width: 56,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,

    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: `translateX(30px)`,
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor:
          theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 13,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
  [theme.breakpoints.down(600)]: {
    width: 36,
    height: 18,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      "&.Mui-checked": {
        transform: `translateX(18.5px)`,
      }
    },
    "& .MuiSwitch-thumb": {
      width: 15,
      height: 15,
    },
    "& .MuiSwitch-track": {
      borderRadius: 10,
    }
  },
}));
export const CustomSwitch = ({ checked, ...props }) => {
  return <NotificationSwitch checked={checked} {...props} />;
};

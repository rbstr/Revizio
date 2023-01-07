import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import { pageLinksArr } from "utils/pageUrls";
import { useTheme } from "@emotion/react";

/**
  * Zobrazení menu u mobilního zařízení
  *
  * @return {} komponenta
  */

export const BottomBar = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [value, setValue] = useState(location.pathname);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: { md: "none" },
        zIndex: 100,
        background: theme.palette.background.default,
        borderTop: 1,
        borderColor: theme.palette.third.main,
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        sx={{
          background: theme.palette.background.default,
          paddingX: 6,
          "&.MuiBottomNavigation-root": {
            marginTop: 0.5,
            marginBottom: 2,
          },
          "& .MuiBottomNavigationAction-root .Mui-selected": {
            color: theme.palette.text.primary,
            fontWeight: "600",
          },
          "& .MuiBottomNavigationAction-root span": {
            fontSize: "10px",
            marginTop: 0.5,
          },
          maxWidth: "500px",
          margin: "auto",
        }}
        showLabels
        onChange={handleChange}
      >
        {pageLinksArr.map((link, index) => (
          <BottomNavigationAction
            key={index}
            label={link.name}
            value={link.url}
            icon={link.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

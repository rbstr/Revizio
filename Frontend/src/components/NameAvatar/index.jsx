import React from "react";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@emotion/react";
import { useThemeContext } from "context/ThemeContext";
import { Typography } from "@mui/material";

export const NameAvatar = ({ name }) => {
  const { selectedTheme } = useThemeContext();
  const theme = useTheme();
  const nameArr = name.split(" ");
  return (
    name && (
      <Avatar
        sx={{
          width: { xs: 30, sm: 40 },
          height: { xs: 30, sm: 40 },
          bgcolor:
            selectedTheme === "dark" ? theme.palette.secondary.dark : "#F2F2F2",
          color: theme.palette.primary.main,
        }}
      >
        <Typography variant = "h6" sx={{ fontWeight: "500" }}>
          {nameArr.slice(0, 2).map((name) => name[0])}
        </Typography>
      </Avatar>
    )
  );
};

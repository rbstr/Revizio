import React from "react";
import { useThemeContext } from "context/ThemeContext";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useTheme } from "@emotion/react";

const ThemeToggleSwitch = styled(Switch)(({ theme }) => ({
  width: 70,
  height: 40,
  padding: 8,
  "& .MuiSwitch-switchBase": {
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(30px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(100, 100, 100, 1)"
            : "rgba(0,0,0, 0.1)",
      },
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 40 / 2,

    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(100, 100, 100, 1)"
        : "rgba(0,0,0, 0.1)",
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&:before": {
      backgroundImage: `url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${encodeURIComponent(
        "#ffffff"
      )}" viewBox="0 0 16 16"> <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/> </svg>')`,
      left: 12,
    },

    "&:after": {
      backgroundImage: `url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${encodeURIComponent(
        "#000000"
      )}"  class="bi bi-moon" viewBox="0 0 16 16"> <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/> </svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.secondary.main : "#fff",
    boxShadow: "0px 1.5px 4px 0px rgba(0, 0, 0, 0.25)",
    width: 18,
    height: 18,
    margin: 2,
  },
}));
export const ThemeSwitch = () => {
  const theme = useTheme();
  const { colorMode } = useThemeContext();

  return (
    <Box
      sx={{ display: "inline-flex" }}
      alignItems="center"
      justifyContent="center"
    >
      <Paper
        sx={{
          width: 4,
          height: 4,
          background:
            theme.palette.mode === "dark"
              ? theme.palette.primary.main
              : theme.palette.secondary.main,
          borderRadius: "50%",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0px 0px 4px 2px rgba(0, 133, 255, 1)"
              : "0px 0px 4px 2px rgba(0, 0, 0, 0.25)",
        }}
      ></Paper>
      <ThemeToggleSwitch onClick={colorMode.toggleColorMode} />
    </Box>
  );
};

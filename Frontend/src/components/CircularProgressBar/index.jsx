import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
/**
 * Animace načítání
 * @param {import("@mui/material/CircularProgress").CircularProgressProps} param0 
 * @returns 
 */
export const CircularProgressBar = ({ value, level, ...props }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        margin: "auto",
        width: "100%",
        maxWidth: "150px",
      }}
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress
        size={"100%"}
        thickness={2}
        variant="determinate"
        value={(value/level)*100}
        color="primary"
        style={{
          strokeLinecap: "round",
        }}
        sx={{
          borderRadius: "50%",
          background:
            theme.palette.mode === "dark"
              ? `radial-gradient(${theme.palette.secondary.light}, transparent, ${theme.palette.secondary.light})`
              : `radial-gradient(${theme.palette.secondary.dark}, transparent, ${theme.palette.secondary.dark})`,
        }}
        {...props}
      />
      <Box
        sx={{
          position: "absolute",
          width: "90%",
          height: "90%",
          borderRadius: "50%",
          borderColor: theme.palette.primary.main,
          display: "flex",
          background: theme.palette.background.paper,
        }}
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h2" component="div" color="primary">
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

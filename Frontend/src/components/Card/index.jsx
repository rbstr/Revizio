import React from "react";
import Stack from "@mui/system/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";

/**
  * Zjednodušený kalendář na přehledové straně
  *
  * @param {children} x 
  * @param {title} x nadpis okénka
  * @param {icon} x ikona
  * @param {align} x zarovnání
  * @param {elevation} x elevation
  * @return {} komponenta
  */

export const CustomCard = ({ children, title, icon, align, elevation }) => {
  const theme = useTheme();
  const mobileScreen = useMediaQuery("(max-width:600px)");
  return (
    <Paper
      className="p-3"
      elevation={elevation || 15}
      sx={{ height: "100%", background: theme.palette.background.paper}}
    >
      {(icon || title) && (
        <Box
          className={`d-flex align-items-center mb-3 gap-2 ${
            align === "left"
              ? "justify-content-start"
              : "justify-content-center"
          }`}
          marginTop= {mobileScreen ? 0.5 : 1}
        >
          {icon && icon}
          {title && (
            <Typography variant="h5_old" align="center">
              {title}
            </Typography>
          )}
        </Box>
      )}

      <Stack direction={"column"} spacing={2}>
        {children}
      </Stack>
    </Paper>
  );
};

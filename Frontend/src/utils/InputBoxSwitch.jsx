import { useTheme } from "@emotion/react";
import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import { CustomSwitch } from "./CustomSwitch";
import { useMediaQuery } from "@mui/material";

/**
  * Komponenta custom switche
  *
  * @return {} komponenta
  */


export const InputBoxSwitch = ({ title, icon, checked, ...props }) => {
  const mobileScreen = useMediaQuery("(max-width:600px)");
  const theme = useTheme();
  return (
    <Box
      sx={{
        border: "1px solid",
        borderRadius: mobileScreen ? 1.5 : 1.25,
        borderColor: theme.palette.secondary.main,
        padding: 2,
        height: mobileScreen ? 45:60,
      }}
    >
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent="space-between"
        marginTop={mobileScreen ? "-2px" : ""}
      >
        <Stack direction="row" spacing={1}>
          {icon && icon}
          <Typography variant="body">{title}</Typography>
        </Stack>
        <CustomSwitch checked={checked} {...props} />
      </Stack>
    </Box>
  );
};

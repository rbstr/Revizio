import React from "react";
import Box from "@mui/system/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/system/Stack";
import { GoBackLink } from "components/GoBackLink";
import { useTheme } from "@emotion/react";
import Divider from "@mui/material/Divider";
import { useMediaQuery } from "@mui/material";

export const PageHeader = ({
  title,
  subTitle,
  goBack,
  children,
  onClick,
  marginBottom,
}) => {
  const theme = useTheme();
  const mobileScreen = useMediaQuery("(max-width:600px)");

  return (
    <Stack spacing={1} sx={{ marginBottom: marginBottom || 3 }}>
      <Box
        onClick={onClick}
        sx={{ display: "flex" }}
        alignItems="center"
        justifyContent="space-between"
      >
        <div>
          {goBack && (
            <GoBackLink url={goBack.url} title={goBack.name || "Go Back"} />
          )}
          {title && (
            <Typography variant="h2" sx={{ marginBottom: mobileScreen ? 0.2 : 0.4 }}>
              {title}
            </Typography>
          )}

          {subTitle && (
            <Typography variant="body2" color="secondary">
              {subTitle}
            </Typography>
          )}
        </div>
        {children}
      </Box>
      <Divider sx={{ borderColor: theme.palette.secondary.main, borderBottomWidth: 1.5, opacity:0.5}}/>
    </Stack>
  );
};

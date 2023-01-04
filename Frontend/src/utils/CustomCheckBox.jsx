import React from "react";
import Box from "@mui/material/Box";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";

export const CustomCheckBox = ({ icon, label, checked, onChange }) => {
  const theme = useTheme();
  return (
    <FormControlLabel
      sx={{
        height: "100%",
        margin: 0,
        border: 1,
        borderRadius: 1,
        borderColor: checked
          ? theme.palette.primary.main
          : theme.palette.secondary.main,
        position: "relative",
        display: "block",
      }}
      control={
        <Checkbox
          size="small"
          checked={checked}
          onChange={onChange}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
          }}
        />
      }
      label={[
        <Box
          sx={{
            padding: 1,
            paddingTop: 4,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            color: checked
              ? theme.palette.primary.main
              : theme.palette.secondary.main,
          }}
          key={Math.random()}
        >
          {icon}
          <Typography variant="body2">{label}</Typography>
        </Box>,
      ]}
    />
  );
};

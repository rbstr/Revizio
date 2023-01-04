import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export const GridSection = ({
  title,
  children,
  titleVariant,
  align,
  spacing,
  marginBottom,
  style
}) => {
  return (
    <Box style={style}>
      {title && (
        <Typography
          variant={titleVariant || "h3"}
          className={marginBottom || "mb-2 mb-sm-4"}
          align={align}
        >
          {title}
        </Typography>
      )}

      <Grid container spacing={{ xs: 1.5, sm: spacing || 3 }}>
        {children}
      </Grid>
    </Box>
  );
};

import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { ChevronLeftIcon, ChevronRightIcon } from "utils/icons";
import { IconButton, Typography, useMediaQuery } from "@mui/material";
import { TheatersOutlined } from "@mui/icons-material";


export const StepButtons = ({
  activeStep,
  handleBack,
  handleNext,
  isLoading,
  mobileScreen,
}) => {
  return (
    
    <Box
      sx={{
        display: "flex",
        marginTop: 4,
        justifyContent: activeStep === 0 ? "flex-end" : "space-between",
        gap: 1,
      }}
    >
      {activeStep !== 0 && (
        <Box sx={{ flex: { xs: 1, sm: 0 } }}>
          <Button
            sx={{ height: mobileScreen ? 45 : 40}}
            color="secondary"
            variant="contained"
            fullWidth
            onClick={handleBack}
            disableElevation
          >
            <Typography sx={{ display: "flex", alignItems: "center", gap: 1, color: "white", fontWeight:500,
            fontSize: mobileScreen ? 14 :16 }}>
              <ChevronLeftIcon width="12" height="12" />
              <span>Zpět</span>
            </Typography>
          </Button>
        </Box>
      )}
      <Box sx={{ flex: { xs: 1, sm: 0 } }}>
        <Button
          sx={{ height: mobileScreen ? 45 : 40}}
          disabled={isLoading}
          onClick={handleNext}
          fullWidth
          variant="contained"
          disableElevation
        >
          <Typography sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 500,
        fontSize: mobileScreen ? 14 : 16 }}>
            <span>{isLoading ? "Načítám..." : "Další"}</span>
            <ChevronRightIcon width="12" height="12" />
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};

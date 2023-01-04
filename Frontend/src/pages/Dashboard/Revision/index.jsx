import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { PageHeader } from "utils/PageHeader";
import { Link } from "react-router-dom";
import { PatternIcon } from "utils/icons";
import { StepHeader } from "components/SteperHeader";
import { useTheme } from "@emotion/react";

export const Revision = () => {
  const steps = [
    "Údaje o klientovi",
    "Údaje o zařízení",
    "Nalezené závady",
    "Celkové hodnocení",
  ];

  const theme = useTheme();

  return (
    <>
      <PageHeader
        title="Nová revize"
        goBack={{ name: "Zpět na přehled", url: "/" }}
      />
      <Box sx={{ width: "100%" }}>
        <StepHeader activeStep={0} steps={steps} max={4} theme={theme} />
        <Box className="py-5">
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" sx={{ marginBottom: 3 }}>
              Vyber typ revize
            </Typography>
            <Box sx={{ display: "inline-flex", gap: 4 }}>
              <Link to={"initial"}>
                <Button variant="contained" disableElevation sx={{ fontWeight: 500 }}>Výchozí</Button>
              </Link>
              <Link to={"service"}>
                <Button variant="contained" disableElevation sx={{ fontWeight: 500 }}>Provozní</Button>
              </Link>
            </Box>
            <Typography variant="h6" sx={{ marginY: 2 }}>
              nebo
            </Typography>
            <Link to="loadpattern">
              <Button variant="contained" disableElevation sx={{ fontWeight: 500 }}>
                <span className="me-2">Načíst ze vzoru</span>{" "}
                <PatternIcon width="16" height="16" />
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </>
  );
};

import { Box, Button, Grid, Paper, Typography, useMediaQuery } from "@mui/material";
import { EmailModal } from "components/EmailModal";
import { useModalContext } from "context/ModalContext";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { resetRevisionForm } from "redux/slices/revisionSlice";
import { ChevronRightIcon, CircleTickIcon, MailIcon } from "utils/icons";
import { useTheme } from "@mui/material";

/**
  * Komponenta pro dokončený proces revize
  * @param {type} x 
  * @return {} komponenta
  */

export const CompleteRevision = ({ type }) => {
  const mobileScreen = useMediaQuery("(max-width:600px)");
  const theme = useTheme();
  const { handleToggleModal } = useModalContext();
  const dispatch = useDispatch();

return (
  <Box>
    <Grid container spacing={7} justifyContent="center">
      <Grid item md={6} lg={5}>
        <Paper elevation={15} align="center" sx={{ padding: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Typography color="primary">
              <CircleTickIcon width="170px" />
            </Typography>
            <Box>
              <Typography variant="h4" className="mb-1">
                Revize úspěšně uložena!
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.secondary.main }}>
                Revize je teď připravena pro další akce
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
      <Grid item md={3} lg={4}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h2" align="center" className="mb-3">
            Co dál?
          </Typography>
          <Button variant="contained" onClick={handleToggleModal} disableElevation
            sx={{ fontWeight: 500, height: mobileScreen ? 45 : 60, fontSize: mobileScreen ? 14 : 16 }}>
            <span className="me-2">Odeslat klientovi emailem</span> <MailIcon width={mobileScreen ? "18px" : "20px"} />
          </Button>
          <Link to="/">
            <Button onClick={() => dispatch(resetRevisionForm())} variant="contained" color="secondary" fullWidth
              disableElevation
              sx={{ fontWeight: 500, color: "white", height: mobileScreen ? 45 : 60, fontSize: mobileScreen ? 14 : 16 }}>
              <span className="me-2">Vrátit se na přehled</span>{" "}
              <ChevronRightIcon width={mobileScreen ? "15px" : "20px"} />
            </Button>
          </Link>
        </Box>
      </Grid>
    </Grid>
    <EmailModal type={type}  />
  </Box>
);
};

import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export const Error404 = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: "1rem",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Stránka nenalezena
      </Typography>
      <Box>
        <Link to="/" className="text-decoration-none">
          <Button variant="outlined" disableElevation>Zpět na přehled</Button>
        </Link>
      </Box>
    </Container>
  );
};

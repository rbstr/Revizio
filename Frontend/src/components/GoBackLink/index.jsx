import React from "react";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { ChevronLeftIcon } from "utils/icons";
import { useMediaQuery } from "@mui/material";

export const GoBackLink = ({ url, title }) => {
  const mobileScreen = useMediaQuery("(max-width:600px)");
  return (
    <Link to={url}>
      <Typography className="pe-cursor" variant="back" color="secondary">
        <ChevronLeftIcon height= {mobileScreen ? "12" : "16"} style = {{marginBottom:1.8}} /> {title}
      </Typography>
    </Link>
  );
};

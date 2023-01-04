import React from "react";
import { styled } from "@mui/system";
import { Dialog } from "@mui/material";
import { useMediaQuery } from "@mui/material";



const BlurryDialog = styled(Dialog)(({ theme }) => ({
  backdropFilter: useMediaQuery("(max-width:600px)") ? "blur(2px)" : "blur(4px)",
  "& .MuiBackdrop-root": { backgroundColor: "transparent" },
  "& .MuiPaper-root": { verticalAlign: "top", top: -5 },
  [theme.breakpoints.down("sm")]: {
    "& .MuiPaper-root": {
      width: "calc(100% - 24px)",
      minWidth: "calc(100% - 24px)",
      maxWidth: "calc(100% - 24px)",
      margin: 2.5,
      verticalAlign: "top",
      top: 5
    },
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
  },
}));
export { BlurryDialog as BlurryDialogModal }

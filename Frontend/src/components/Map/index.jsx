import React, { useMemo, useState } from "react";
import DialogContent from "@mui/material/DialogContent";
import { useModalContext } from "context/ModalContext";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/system/Box";
import CloseIcon from "@mui/icons-material/Close";
import { useMediaQuery } from "@mui/material";
import { BlurryDialogModal } from "utils/BlurryDialogModal";

export const MapSection = ({ openModal, handleToggleModal, getValues }) => {
  // const { openModal, handleToggleModal } = useModalContext();
  const [pageHeight, setPageHeight] = useState(window.innerHeight);

  const city = useMemo(
    () => (openModal ? getValues("city") : "New York"),
    [openModal]
  );
  const street = useMemo(
    () => (openModal ? getValues("street") : "Broadway"),
    [openModal]
  );
  const zip = useMemo(
    () => (openModal ? (getValues("zip") ?? getValues("zipCode")) : "10007"),
    [openModal]
  );

  window.onresize = () => {
    setPageHeight(window.innerHeight);
  };

  const mobleScreen = useMediaQuery("(max-width:600px)");

  return (
    <BlurryDialogModal
      fullWidth
      maxWidth={"md"}
      open={openModal}
      onClose={handleToggleModal}
      scroll={"body"}
      style={{marginTop: mobleScreen? 0 : 0}}
    >
      <DialogContent
        sx={{
          "&.MuiDialogContent-root": {
            padding: "0",
            height: mobleScreen? `${pageHeight * 0.65}px` : 530,
            borderRadius: 1,
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            background: "rgba(0, 133, 255, 0.3)",
            borderRadius: "60%",
            zIndex: 100,
          }}
        >
          <IconButton
            aria-label="delete"
            size="small"
            onClick={handleToggleModal}
          >
            <CloseIcon fontSize="16" color="primary" />
          </IconButton>
        </Box>
        <iframe
          src={`source`}
          width="100%"
          height={mobleScreen ? `${pageHeight * 0.65}px` : 530}
          style={{ border: 0, aspectRatio: 16 / 9}}
          allowFullScreen
          loading="lazy"
          title="map"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </DialogContent>
    </BlurryDialogModal>
  );
};

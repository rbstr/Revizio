import React from "react";
import DialogContent from "@mui/material/DialogContent";
import { useModalContext } from "context/ModalContext";
import {
  Box,
  Button,
  DialogActions,
  DialogTitle,
  Divider,
  Paper,
  useMediaQuery
} from "@mui/material";
import ReactSignatureCanvas from "react-signature-canvas";
import { useTheme } from "@emotion/react";
import { BlurryDialogModal } from "utils/BlurryDialogModal";

export const SignatureModal = ({ setSignImg }) => {
  const mobileScreen = useMediaQuery("(max-width:600px)");
  const theme = useTheme();
  const { openModal, handleToggleModal } = useModalContext();

  let signPad = {};

  const clearSign = () => {
    signPad.clear();
  };

  const addSign = () => {
    setSignImg(signPad.getTrimmedCanvas().toDataURL("image/png"));
  };

  return (
    <BlurryDialogModal
      fullWidth
      maxWidth={"xs"}
      open={openModal}
      scroll={"body"}
      style={{marginTop: mobileScreen ? -10 : 0}}
    >
      <DialogTitle variant="h4">
        Přidat podpis
        <Divider sx={{ 
          borderColor: theme.palette.secondary.main, 
          borderBottomWidth: 1.5, opacity: 0.5, marginTop: 1, marginBottom: 1 }} />
      </DialogTitle>
      <DialogContent>
        <Box
          border={`1px solid ${theme.palette.secondary.main}`}
          borderRadius={1}
        >
          <ReactSignatureCanvas
            ref={(ref) => {
              signPad = ref;
            }}
            penColor={theme.palette.primary.main}
            canvasProps={{
              height: 350,
              width: 300,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions style={{marginBottom: 10, marginRight: mobileScreen ? 10 : 15}}>
        <Button
          onClick={() => {
            clearSign();
            handleToggleModal();
          }}
          color={"secondary"}
          style={{ fontWeight: 500, marginRight: mobileScreen ? -5 : 0 }}
        >
          Zrušit
        </Button>
        <Button
          onClick={() => {
            addSign();
            handleToggleModal();
          }}
          autoFocus
          variant="contained"
          disableElevation
          sx={{fontWeight:500}}
        >
          Uložit
        </Button>
      </DialogActions>
    </BlurryDialogModal>
  );
};

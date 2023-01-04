import React from "react";
import DialogContent from "@mui/material/DialogContent";
import { useModalContext } from "context/ModalContext";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/system/Box";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  DialogActions,
  DialogTitle,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import { AllPages } from "components/PdfFile";
import { DownloadIcon, PrintIcon, TrashIcon } from "utils/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteRevisionAsyncThunk,
  downloadRevisionPdfFileAsyncThunk,
} from "redux/slices/revisionSlice";
import CustomButton from "components/CustomComponents/CustomButton";
import { customAlert } from "pages/Dashboard/Clients/clientProfileLayout";
import { useTheme } from "@emotion/react";
import { GridSection } from "components/GridSection";
import { InputField } from "utils/InputField";
import { BlurryDialogModal } from "utils/BlurryDialogModal";

export const ClientModal = ({ open, setOpen, data }) => {
  const { pdfRevisionData } = useSelector((state) => state.revision);
  const dispatch = useDispatch();
  const theme = useTheme();

  return (
    <BlurryDialogModal
      fullWidth
      maxWidth={"sm"}
      open={open}
      onClose={setOpen}
      scroll={"body"}
    >
      <Box
        sx={{
          position: "absolute",
          right: 10,
          top: 10,
          background: "rgba(0, 133, 255, 0.3)",
          borderRadius: "50%",
          zIndex: 100,
        }}
      >
        <IconButton aria-label="delete" size="small" onClick={setOpen}>
          <CloseIcon fontSize="16" color="primary" />
        </IconButton>
      </Box>
      <DialogTitle variant="h3">Client information</DialogTitle>
      <DialogContent>
        <Divider sx={{ marginBottom: 2 }} />
        <Grid item xs={12}>
          <GridSection>
            <Grid item xs={12} md={12}>
              <InputField
                id="street"
                disabled={true}
                label="Client Name"
                value={data?.client?.firstName + " " + data?.client?.lastName}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <InputField
                id="street"
                disabled={true}
                label="Client Email"
                value={data?.client?.email}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <InputField
                id="street"
                disabled={true}
                label="Client Phone"
                value={data?.client?.telephoneNumber}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <InputField
                id="street"
                disabled={true}
                label="Client Address"
                value={
                  data?.client?.street +
                  ", " +
                  data?.client?.city +
                  ", " +
                  data?.client?.zipCode
                }
              />
            </Grid>
          </GridSection>
        </Grid>
      </DialogContent>
    </BlurryDialogModal>
  );
};

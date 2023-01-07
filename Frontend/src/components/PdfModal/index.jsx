import React from "react";
import DialogContent from "@mui/material/DialogContent";
import { useModalContext } from "context/ModalContext";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/system/Box";
import CloseIcon from "@mui/icons-material/Close";
import { Button, DialogActions } from "@mui/material";
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
import { BlurryDialogModal } from "utils/BlurryDialogModal";

/**
  * Modal k zobrazení PDF dokumentu.
  *
  * @param {open} x 
  * @param {setOpen} x 
  * @return {} komponenta
  */

export const PdfModal = ({ open, setOpen }) => {
  const { openModal, handleToggleModal } = useModalContext();
  const { pdfRevisionData } = useSelector((state) => state.revision);
  const dispatch = useDispatch();
  const theme = useTheme();

  return (
    <BlurryDialogModal
      fullWidth
      maxWidth={"sm"}
      open={openModal || open}
      onClose={setOpen ?? handleToggleModal}
      scroll={"body"}
    >
      <DialogContent
        sx={{
          "&.MuiDialogContent-root": {
            paddingBottom: "0",
          },
        }}
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
          <IconButton
            aria-label="delete"
            size="small"
            onClick={setOpen ?? handleToggleModal}
          >
            <CloseIcon fontSize="16" color="primary" />
          </IconButton>
        </Box>
        {/* <Paper
          elevation={5}
          style={{
            aspectRatio: "8.26/11.69",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        ></Paper> */}
        <Box
          style={{
            aspectRatio: "8/11",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {
            // pdfString &&
            pdfRevisionData && pdfRevisionData?.pdfUrl && (
              <AllPages
                // pdf={pdfString}
                pdf={pdfRevisionData?.showReport ? pdfRevisionData?.pdfReportUrl : pdfRevisionData?.pdfUrl}
              />
            )
          }
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={(event) => {
            //console.log("clicked");
            event.preventDefault();
            window.open(
              pdfRevisionData?.showReport ? pdfRevisionData?.pdfReportUrl : pdfRevisionData?.pdfUrl,
              "PRINT",
              "height=400,width=600"
            );
          }}
          variant="contained"
          color={"secondary"}
          style={{boxShadow: "0 0", fontWeight: "500", color: "#ffffff"}}
        >
          <span className="me-2">Tisk</span>
          <PrintIcon width="16" height="16" />
        </Button>
        <CustomButton
          onClick={() => {
            customAlert(
              "Odstranit revizi",
              "Opravdu chceš tuto revizi odstranit?",
              () => {
                dispatch(
                  deleteRevisionAsyncThunk({
                    id: pdfRevisionData.id,
                    fetchList: true,
                    callBack: () => {
                      setOpen ? setOpen() : handleToggleModal();
                    },
                  })
                );
              },
              theme
            );
          }}
          btnProps={{
            variant: "contained",
            color: "secondary",
            autoFocus: true,
          }}
          title={"Odstranit"}
          reducer={"revision"}
          action={"deleteRevisionAsyncThunk"}
          icon={<TrashIcon width="16" height="16" />}
        />
        <CustomButton
          onClick={() =>
            dispatch(
              downloadRevisionPdfFileAsyncThunk({
                url: pdfRevisionData?.showReport ? pdfRevisionData?.pdfReportUrl : pdfRevisionData?.pdfUrl,
                fileName: "Revision.pdf",
              })
            )
          }
          btnProps={{ variant: "contained", autoFocus: true }}
          title={"Uložit"}
          reducer={"revision"}
          action={"downloadRevisionPdfFileAsyncThunk"}
          icon={<DownloadIcon width="16" height="16" />}
        />
      </DialogActions>
    </BlurryDialogModal>
  );
};

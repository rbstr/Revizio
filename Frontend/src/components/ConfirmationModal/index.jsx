import React from "react";
import DialogContent from "@mui/material/DialogContent";
import { useModalContext } from "context/ModalContext";
import { Button, DialogActions, DialogTitle, Divider } from "@mui/material";
import { BlurryDialogModal } from "utils/BlurryDialogModal";

export const ConfirmationModal = ({ updateDataFun, nextWithoutSave }) => {
  const { openModal, handleToggleModal } = useModalContext();

  return (
    <BlurryDialogModal
      fullWidth
      maxWidth={"xs"}
      open={openModal}
      scroll={"body"}
    >
      <DialogTitle variant="h3">Client Basic Info</DialogTitle>
      <DialogContent>
        <Divider sx={{ marginBottom: 2 }} />
        Client is already exist with the same email do you want to update the
        information or want to keep old information
      </DialogContent>
      <DialogActions sx={{ textAlign: "end" }}>
        <Button
          onClick={() => {
            updateDataFun();
            handleToggleModal();
          }}
          color={"secondary"}
        >
          Update Data
        </Button>
        <Button
          onClick={() => {
            nextWithoutSave();
            handleToggleModal();
          }}
          autoFocus
          variant="contained"
        >
          Keep Old one
        </Button>
      </DialogActions>
    </BlurryDialogModal>
  );
};

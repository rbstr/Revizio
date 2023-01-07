import React from "react";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/system/Box";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  DialogTitle,
  Divider,
  Grid,
} from "@mui/material";
import { GridSection } from "components/GridSection";
import { InputField } from "utils/InputField";
import moment from "moment";
import { BlurryDialogModal } from "utils/BlurryDialogModal";
import { useTheme } from "@emotion/react";

/**
  * Modal k zobrazení detailu schůzky v kalendáři
  *
  * @param {open} x 
  * @param {setOpen} x 
  * @param {data} x 
  * @return {} komponenta
  */

export const MeetingDetail = ({ open, setOpen, data={} }) => {
  const theme = useTheme();
  return (
    <BlurryDialogModal
      fullWidth
      maxWidth={"sm"}
      open={open}
      onClose={setOpen}
      scroll={"body"}
    >
      <DialogContent
        sx={{
          padding: "0",
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
          <IconButton aria-label="delete" size="small" onClick={setOpen}>
            <CloseIcon fontSize="16" color="primary" />
          </IconButton>
        </Box>
        {/*  */}
        <DialogTitle variant="h3">Schůzka s klientem</DialogTitle>
        <DialogContent>
        <Divider sx={{ 
          borderColor: theme.palette.secondary.main, 
          borderBottomWidth: 1.5, opacity: 0.5, marginTop: 1, marginBottom: 3 }} />
          <GridSection>
            <Grid item xs={5}>
              <InputField
                id="name"
                label={"Jméno klienta"}
                readOnly
                disabled
                value={data?.name}
              />
            </Grid>
            <Grid item xs={7} sx={{ display: "flex" }} alignItems="end"></Grid>
            <Grid item xs={4}>
              <InputField
                id="dateFrom"
                label={"Od"}
                readOnly
                disabled
                value={moment(data?.from?.toDate()).format("HH:mm")}
              />
            </Grid>
            <Grid item xs={4}>
              <InputField
                id="dateTo"
                label={"Do"}
                readOnly
                disabled
                value={moment(data?.to?.toDate()).format("HH:mm")}
              />
            </Grid>
            <Grid item xs={12}>
            <Divider></Divider>
            </Grid>
            <Grid item xs={4}>
              <InputField
                id="street"
                label={"Ulice"}
                readOnly
                disabled
                value={data?.street}
              />
            </Grid>
            <Grid item xs={4}>
              <InputField
                id="city"
                label={"Město"}
                readOnly
                disabled
                value={data?.city}
              />
            </Grid>
            <Grid item xs={4}>
              <InputField
                id="zipCode"
                label={"PSČ"}
                readOnly
                disabled
                value={data?.zipCode}
              />
            </Grid>
          </GridSection>
        </DialogContent>
      </DialogContent>
    </BlurryDialogModal>
  );
};

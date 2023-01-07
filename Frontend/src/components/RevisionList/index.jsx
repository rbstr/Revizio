import React, { useState } from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Stack from "@mui/system/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { NameAvatar } from "components/NameAvatar";
import { EditIcon, PdfIcon, TrashIcon } from "utils/icons";
import moment from "moment";
import { deleteRevisionAsyncThunk, setPdfRevisionData, setRevisionData } from "redux/slices/revisionSlice";
import { useDispatch } from "react-redux";
import CustomButtonChild from "components/CustomComponents/CustomButtonChild";
import { useNavigate } from "react-router-dom";
import { useModalContext } from "context/ModalContext";
import { customAlert } from "pages/Dashboard/Clients/clientProfileLayout";
import { useTheme } from "@emotion/react";
import { ThemeProvider, createTheme, useMediaQuery } from "@mui/material";

/**
  * Komponenta nedávno vytvořených revizí na přehledové stránce
  *
  * @param {listArr} x 
  * @return {} komponenta
  */

export const RevisionList = ({ listArr }) => {
  const dispatch = useDispatch()
  const [selectedId, setSelectedId] = useState(null)
  const navigate = useNavigate();
  const { handleToggleModal } = useModalContext();
  const theme = useTheme()
  const mobileScreen = useMediaQuery("(max-width:600px)");

  return (
    <List sx={{ overflowX: "auto", marginTop: mobileScreen ? 0 : 2 }}>
      {listArr &&
        listArr.length > 0 ?
        listArr.map((list, index) => {
          return (
            <Box key={index}>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Box
                  sx={{
                    display: "inline-flex",
                    gap: 2,
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <NameAvatar name={list?.client?.firstName + " " + list?.client?.lastName ?? "dummy"} />
                  <Box>
                    <Typography variant="h6" onClick={() => navigate(`/clients/${list?.client?.id}`)} fontWeight={"bold"} sx={{cursor: "pointer"}}>
                      {list?.client?.firstName + " " + list?.client?.lastName  ?? "dummy"}
                    </Typography>
                    <Typography color="secondary" variant="subtitle2">
                      {moment(list?.timestamp?.seconds * 1000).format(
                        "DD. MM. YYYY"
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Stack direction="row" spacing={1}>
                  <IconButton onClick={() => {
                    dispatch(setRevisionData(list));
                    navigate(`/revision/${list?.type}`);
                  }} aria-label="edit" color="secondary">
                    <EditIcon width="20" />
                  </IconButton>
                  {/* <IconButton onClick={()=>window.open(list?.pdfUrl, "PRINT", "height=400,width=600")} aria-label="print" color="secondary"> */}
                  <IconButton onClick={() => {
                    handleToggleModal()
                    dispatch(setPdfRevisionData(list))

                  }} aria-label="print" color="secondary">
                    <PdfIcon width="20" />
                  </IconButton>
                  <IconButton onClick={() => {
                    customAlert("Odstranit revizi", "Opravdu chceš tuto revizi odstranit?", () => {
                      setSelectedId(list.id)
                      dispatch(deleteRevisionAsyncThunk({ id: list.id, fetchList: true }))
                    }, theme)
                  }} aria-label="delete" color="secondary">

                    <CustomButtonChild
                      selected={list?.id == selectedId}
                      icon={<TrashIcon width="20" />}
                      reducer="revision"
                      action="deleteRevisionAsyncThunk"
                    />
                  </IconButton>
                </Stack>
              </Stack>
              {index + 1 !== listArr.length && (
                <Divider sx={{ bgColor: theme.palette.third.main, marginY: mobileScreen ? 1 : 2 , borderBottomWidth: 1.5, opacity:0.5 }} />
              )}
            </Box>
          );
        })
        :
        <Box
                    sx={{
                      height: 250,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography color={"secondary"} textAlign="center">
                      Zatím žádné vytvořené revize.
                    </Typography>
                  </Box>
      }
    </List>
  );
};

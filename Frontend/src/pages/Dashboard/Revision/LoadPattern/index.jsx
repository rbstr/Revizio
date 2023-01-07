import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import {
  deletePatternAsyncThunk,
  getPatternsAsyncThunk,
  setPatternIdToEdit,
} from "redux/slices/patternSlice";
import { CustomRadioButton } from "utils/CustomRadioButton";
import { EditIcon, TrashIcon } from "utils/icons";
import { PageHeader } from "utils/PageHeader";
import moment from "moment";
import ProvierErrorLoadingScroll from "components/CustomComponents/ProvierErrorLoadingScroll";
import CustomButtonChild from "components/CustomComponents/CustomButtonChild";
import { useNavigate } from "react-router-dom";
import { setRevisionData } from "redux/slices/revisionSlice";
import { PatternModal } from "components/PatternModal";
import { useModalContext } from "context/ModalContext";
import { customAlert } from "pages/Dashboard/Clients/clientProfileLayout";
import { useTheme } from "@mui/material";
import { StepHeader } from "components/SteperHeader";
import { useMediaQuery } from "@mui/material";


/**
  * Komponenta načtení vzoru
  * @return {} komponenta
  */


export const LoadPattern = () => {
  const mobileScreen = useMediaQuery("(max-width:600px)");
  const [selectedPatter, setSelectedPatter] = useState(null);
  const { handleToggleModal } = useModalContext();
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    patterns: { data: patternArr },
  } = useSelector((state) => state.pattern);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPatternsAsyncThunk({ perPage: 10, search: "", first: true }));
  }, []);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const steps = [
    "Údaje o klientovi",
    "Údaje o zařízení",
    "Nalezené závady",
    "Celkové hodnocení",
    "pdf Page",
    "completion Page",
  ];


  const onSubmit = (data) => {
    console.log("choose", data);
  };
  const PatterCard = (data) => (
    <Box marginY={2}>
      <Controller
        control={control}
        name={data?.patternName}
        defaultValue={false}
        render={({ field: { onChange, value } }) => (
          <CustomRadioButton
            name={data?.patternName}
            checked={value || true}
            onChange={onChange}
            label={
              <ListItem
                onClick={() => {
                  dispatch(setRevisionData({ ...data, id: undefined }));
                  navigate(`/revision/${data?.type}`);
                }}
                // onClick={() => console.log(data)}
                sx={{marginTop:-1}}
                secondaryAction={
                  <Stack direction="row" spacing={0}>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(setPatternIdToEdit(data?.id));
                        handleToggleModal();
                      }}
                      aria-label="edit"
                      color="secondary"
                    >
                      <EditIcon width= {mobileScreen ? "18" :"20"} />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        customAlert(
                          "Odstranit vzor",
                          "Opravdu chceš odstranit tento vzor?",
                          () => {
                            dispatch(deletePatternAsyncThunk({ id: data?.id }));
                            setSelectedPatter(data?.id);
                          },
                          theme
                        );
                      }}
                      aria-label="delete"
                      color="secondary"
                    >
                      <CustomButtonChild
                        selected={data?.id == selectedPatter}
                        icon={<TrashIcon width={mobileScreen ? "18" :"20"} />}
                        reducer="pattern"
                        action="deletePatternAsyncThunk"
                      />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemText
                  disableTypography
                  primary={<Typography type="p3" style={{ color: theme.palette.text.primary, fontWeight:500 }}>{data?.patternName}</Typography>}
                  //primary={data?.patternName}
                  secondary={<Typography type="p3" style={{ color: theme.palette.secondary.main, fontWeight:500 }}> {moment(data?.timestamp?.seconds * 1000).format(
                    "DD. MM. YYYY")} </Typography>
                  }
                  
                />
              </ListItem>
            }
          />
        )}
      />
    </Box>
  );
  return (
    <>
      <PageHeader
        title="Nová revize"
        goBack={{ name: "Zpět na výběr revize", url: "/revision" }}
      />
      <StepHeader steps={steps} max={4} activeStep={0} theme={theme} />
      <Box sx={{ flexGrow: 1, marginTop: 8 }} component="form" noValidate autoComplete="off">
        <Grid container spacing={5} justifyContent={"center"}>
          <Grid item xs={12} sm={10} md={6} lg={5}>
            <Paper elevation={15} sx={{ padding: 3 }}>
              <Box>
                <Typography variant="h4">Uložené vzory zpráv</Typography>
                <Divider sx={{ borderColor: theme.palette.secondary.main, borderBottomWidth: 1.5, opacity: 0.5, 
                  marginTop: 1, marginBottom: 3 }} />

                <ProvierErrorLoadingScroll
                  reducer="pattern"
                  action="getPatternsAsyncThunk"
                  dataKey="patterns"
                  Component={PatterCard}
                  loadMore={() =>
                    dispatch(getPatternsAsyncThunk({ perPage: 10, search: "" }))
                  }
                  loadingIndicator=""
                  asyncThunk={getPatternsAsyncThunk}
                />
                {/* <Grid item xs={12} sx={{ textAlign: "end" }}>
                    <Button
                      variant="contained"
                      onClick={handleSubmit(onSubmit)}
                    >
                      Choose
                    </Button>
                  </Grid> */}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <PatternModal />
    </>
  );
};

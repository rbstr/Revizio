import { useTheme } from "@emotion/react";
import { CloseOutlined } from "@mui/icons-material";
import {
  Box,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { PdfModal } from "components/PdfModal";
import { CustomTable } from "components/Table";
import { useModalContext } from "context/ModalContext";
import { useSearchDebounce } from "hooks/debounce";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRevisionsAsyncThunk,
  setPdfRevisionData,
} from "redux/slices/revisionSlice";
import { SearchIcon } from "utils/icons";
import { InputField } from "utils/InputField";
import { PageHeader } from "utils/PageHeader";


/**
  * Komponenta evidence revizních zpráv
  * @return {} komponenta
  */


export const Revisions = () => {
  const [search, setSearch] = useSearchDebounce();
  useEffect(() => {
    dispatch(getRevisionsAsyncThunk({ perPage: 10, search, first: true }));
  }, [search]);
  const dispatch = useDispatch();
  const revision = useSelector((state) => state.revision);
  const { profile } = useSelector((state) => state.auth);
  console.log("profile:", profile);
  const theme = useTheme();
  const lgScreen = useMediaQuery("(min-width:900px)");

  const tableHeadArr = [
    lgScreen ? "Evidenční číslo" : "Ev. číslo",
    "Typ revize",
    "Jméno klienta",
    "Vytvořeno",
    "",
  ];

  const [showSearch, setShowSearch] = useState(false);
  const handleToggleSearch = () => {
    setShowSearch(!showSearch);
  };
  const { handleToggleModal } = useModalContext();
  const revisionAction = (data) => {
    handleToggleModal();
    dispatch(setPdfRevisionData(data));
  };
  return (
    <>
      <PageHeader
        title="Evidence zpráv"
        subTitle={profile?.firstName + " " + profile?.lastName}
        goBack={{ name: "Zpět na seznam klientů ", url: "/clients" }}
        marginBottom={1}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={3}>
          {lgScreen ? (
            <Box sx={{ width: { lg: 400, xl: 500 } }}>
              <TextField
                fullWidth
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Hledat revizi.."
                InputLabelProps={{ shrink: true }}
                id="search"
                size="small"
                sx={{
                  borderRadius: 1, background: theme.palette.third.main, borderColor: theme.palette.third.main,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: theme.palette.third.main,
                    },
                    "&:hover fieldset": {
                      borderColor: theme.palette.third.main,
                    },
                    "& ::placeholder": {
                      fontWeight: 500,
                      color: theme.palette.secondary.search,
                  }
                }}}
                InputProps={{ style: {fontWeight: 500},
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography color="secondary" variant="body2">
                        <SearchIcon />
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          ) : (
            <Typography
              color="secondary"
              sx={{ cursor: "pointer" }}
              onClick={handleToggleSearch}
            >
              {!showSearch ? <SearchIcon /> : <CloseOutlined />}
            </Typography>
          )}
        </Stack>
      </PageHeader>
      {showSearch && !lgScreen && (
        <Box sx={{ padding: 1, marginBottom: 2 }}>
          <TextField
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hledat revizi.."
            id="search"
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{
              borderRadius: 1,
            }}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography color="secondary">
                    <SearchIcon width="16" />
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

      <CustomTable
        tableHeadArr={tableHeadArr}
        avatarName={false}
        action={revisionAction}
        reducer={"revision"}
        asyncThunkName={"getRevisionsAsyncThunk"}
        dataKey={"revisions"}
        showHeaderOnSmallScreen={true}
        loadMore={() =>
          dispatch(getRevisionsAsyncThunk({ perPage: 10, search }))
        }
      />
      <PdfModal />
    </>
  );
};

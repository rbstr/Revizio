import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { CustomTable } from "components/Table";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getClientsAsyncThunk, resetClientFields } from "redux/slices/clientsSlice";
import { InputField } from "utils/InputField";
import { PageHeader } from "utils/PageHeader";
import { useTheme } from "@emotion/react";
import { PageIcon, SearchIcon } from "utils/icons";
import { useSearchDebounce } from "hooks/debounce";
import { CloseOutlined } from "@mui/icons-material";


/**
  * Komponenta/stránka klienti
  *
  * @return {} komponenta
  */


export const Clients = () => {
  const [search, setSearch] = useSearchDebounce();
  useEffect(() => {
    dispatch(getClientsAsyncThunk({ perPage: 12, first: true }));
  }, []);

  const navigator = useNavigate();
  const theme = useTheme();
  const lgScreen = useMediaQuery("(min-width:900px)");
  const dispatch = useDispatch();
  const Client = useSelector((state) => state.client);
  //console.log(Client);

  const [showSearchBar, setShowSearchbar] = useState(false);

  const handleToggleSearchBar = () => {
    setShowSearchbar(!showSearchBar);
  };

  const tableHeadArr = [
    "Jméno",
    "Telefonní číslo",
    "Emailová adresa",
    "Vytvořen",
    "",
  ];

  const handleAction = (pageName) => {
    navigator(pageName);
  };
  useEffect(()=> {
    dispatch(resetClientFields())
  },[])
  const clients = useMemo(() => {
    if (!search) return Client.clients.data || [];
    return (
      Client?.clients?.data
        ?.map((e) => ({ ...e, name: `${e.firstName} ${e.lastName}` }))
        .filter((client) => {
          const fields = ["name", "email"];
          return fields.some((field) => {
            return client[field].toLowerCase().includes(search.toLowerCase());
          });
        }) || []
    );
  }, [Client.clients.data, search]);
  return (
    <>
      <PageHeader title="Klienti" marginBottom={1}>
        <Stack direction={"row"} alignItems={"center"} spacing={3}>
          <Link to="revisions">
            <Button variant="contained" disableElevation sx={{ fontWeight: 500 }} startIcon={<PageIcon/>}>
              Evidence zpráv
            </Button>
          </Link>
          {lgScreen ? (
            <Box sx={{ width: { lg: 400, xl: 500 } }}>
              <TextField
                fullWidth
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Hledat klienty.."
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
              onClick={() => {
                handleToggleSearchBar();
              }}
            >
              {!showSearchBar ? <SearchIcon /> : <CloseOutlined />}
            </Typography>
          )}
        </Stack>
      </PageHeader>
      {/* {showSearch && ( */}
      {showSearchBar && !lgScreen && (
        <Box sx={{ marginTop: 0 }}>
          <TextField
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hledat klienty.."
            id="search"
            size="small"
            sx={{
              borderRadius: 1,
              background: theme.palette.third.main,
              borderColor: theme.palette.third.main,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: theme.palette.third.main,
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.third.main,
                },
                "& ::placeholder": {
                  fontWeight: 500,
                  fontSize: 14,
                  color: theme.palette.secondary.search,
              }
            }
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
      <Stack direction={"row"} spacing={{ xs: 2, md: 5 }}>
        <Box sx={{ width: "100%" }}>
          <CustomTable
            tableBodyArr={clients}
            tableHeadArr={tableHeadArr}
            avatarName={true}
            action={handleAction}
            reducer={"client"}
            asyncThunkName={"getClientsAsyncThunk"}
            dataKey={"clients"}
            showHeaderOnSmallScreen={false}
            loadMore={() => dispatch(getClientsAsyncThunk({ perPage: 10 }))}
          />
        </Box>
      </Stack>
    </>
  );
};

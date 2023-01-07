import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { NameAvatar } from "components/NameAvatar";
import Box from "@mui/material/Box";
import { useTheme } from "@emotion/react";
import { ChevronRightIcon, EyeIcon } from "utils/icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getClientsAsyncThunk } from "redux/slices/clientsSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";
import { useMediaQuery } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { Dropdown } from "components/Dropdown";

/**
  * Vytvoření seznamu klientů/evidence revizí
  *
  * @return {} komponenta
  */

function getTypeCz(type){
  if (type === "initial"){
    return "výchozí"
  }

  if (type === "service"){
    return "provozní"
  }
}

export const CustomTable = ({
  tableBodyArr,
  tableHeadArr,
  avatarName,
  action,
  reducer,
  asyncThunkName,
  dataKey,
  loadMore,
  showHeaderOnSmallScreen,
}) => {
  //Table Row
  const Method = {};
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const printOptions = [
    {
      icon: <EyeIcon width="19" className="pe-cursor" />,
      name: "Otevřít revizi",
      // onclick: (_id) => action ? () => action(data) : null,
      onclick: (_id) =>action({...response?.data?.find((e) => e.id == _id)})
    },
  ];
  // const mappedOptions = printOptions.map(e=> e.name ==="Send as email" ? {...e,onClick:()=>setOpen(true)} : e)
  Method["getClientsAsyncThunk"] = ({
    email,
    firstName,
    lastName,
    telephoneNumber,
    techInformation,
    type,
    timestamp,
    id,
  }) => {
    return (
      <TableRow sx={{ "&: MuiTableRow-root": {
        borderBottom: "1px solid black",
      }, "&:last-child td, &:last-child th": { border: 0 }, }}>
        <TableCell
          component="th"
          scope="row"
          sx={{ fontWeight: "600", fontSize: 16 }}
          className="pe-cursor"
          onClick={action ? () => action(id) : null}
        >
          <Box
            sx={{ display: "flex", gap: 2, flexWrap: "nowrap" }}
            alignItems="center"
          >
            {avatarName && <NameAvatar name={`${firstName} ${lastName}`} />}
            {firstName + " " + lastName}
          </Box>
        </TableCell>

        {lgScreen && (
          <TableCell sx={{ fontWeight: "600", fontSize: 16 }} className="pe-cursor" onClick={action ? () => action(id) : null}>
            {telephoneNumber}
          </TableCell>
        )}
        {lgScreen && (
          <TableCell sx={{ fontWeight: "600", fontSize: 16 }} className="pe-cursor" onClick={action ? () => action(id) : null}>
            {email}
          </TableCell>
        )}
        {lgScreen && (
          <TableCell sx={{ fontWeight: "600", fontSize: 16 }} className="pe-cursor" onClick={action ? () => action(id) : null}>
            {moment(timestamp?.seconds * 1000).format("DD. MM. YYYY")}
          </TableCell>
        )}
        <TableCell sx={{ fontWeight: "600", fontSize: 16 }} align="right">
          <ChevronRightIcon
            className="pe-cursor"
            onClick={action ? () => action(id) : null}
          />
        </TableCell>
      </TableRow>
    );
  };
  Method["getRevisionsAsyncThunk"] = (data) => {
    const { clientId, techInformation, type, client, timestamp, userId,id } = data;
    return (
      <TableRow sx={{"&:last-child td, &:last-child th": { border: 0 },
    }}>
        <TableCell
          component="th"
          scope="row"
          sx={{ fontWeight: "600", fontSize: 16 }}
        >
          <Box
            sx={{ display: "flex", gap: 2, flexWrap: "nowrap" }}
            alignItems="center"
          >
            {/* {avatarName && <NameAvatar name={basicInformation?.firstName} />} */}

            {techInformation?.evidenceNumber}
          </Box>
        </TableCell>

        <TableCell sx={{ fontWeight: "600", fontSize: 16 }}>{getTypeCz(type)}</TableCell>
        {lgScreen && (
          <TableCell sx={{ fontWeight: "600", fontSize: 16 }}>
            {client?.firstName + " " + client?.lastName}  
          </TableCell>
        )}
        {lgScreen && (
          <TableCell sx={{ fontWeight: "600", fontSize: 16 }}>
            {moment(timestamp?.seconds * 1000).format("DD. MM. YYYY ")}
          </TableCell>
        )}
        <TableCell sx={{ fontWeight: "600", fontSize: 16 }} align="right">
          {/* <ChevronRightIcon
            className="pe-cursor"
            onClick={action ? () => action(data) : null}
          /> */}
        <Dropdown id={id} options={type==="initial" ? [...printOptions,  {
      icon: <EyeIcon width="19" className="pe-cursor" />,
      name: "Otevřít zápis o zkoušce",
      onclick: (_id) =>action({...response?.data?.find((e) => e.id == _id),showReport:true})
    },]:printOptions}></Dropdown>
        </TableCell>
      </TableRow>
    );
  };
  const RenderMethod = Method[asyncThunkName];
  const loading = useSelector(
    (state) => state[reducer]?.loadings[asyncThunkName]
  );
  const response = useSelector((state) => state[reducer]?.[dataKey]);
  const error = useSelector((state) => state[reducer].errors[asyncThunkName]);
  const params = useSelector(
    (state) => state[reducer].paramsForThunk[asyncThunkName]
  );
 
  const theme = useTheme();
  const lgScreen = useMediaQuery("(min-width:900px)");
  return (
    <InfiniteScroll
      dataLength={response?.data?.length ?? 0}
      next={() => !loading && loadMore()}
      hasMore={response?.loadMore}
      loader={""}
    >
      <TableContainer>
        <Table>
          {tableHeadArr &&
            tableHeadArr.length > 0 &&
            (showHeaderOnSmallScreen || lgScreen) && (
              <TableHead>
                <TableRow>
                  {tableHeadArr.map((data, index) => (
                    <TableCell
                      sx={{
                        color: theme.palette.secondary.main,
                        display:
                          !lgScreen &&
                          index > 1 &&
                          index < tableHeadArr.length - 1
                            ? "none"
                            : null,
                        fontSize: lgScreen ? 16 : 14,
                      }}
                      key={index}
                    >
                      {data}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
            )}

          <TableBody>
            {(tableBodyArr || response?.data).map((data, index) => (
              <RenderMethod
                key={index}
                {...data}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </InfiniteScroll>
  );
};

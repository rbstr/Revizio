import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import Loader from "./Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTheme } from "@mui/material";
// import { Container, Row, Col } from "react-bootstrap";
// this provider get the loading and error values from the store and show related messages otherwise show the children
export default function ProvierErrorLoadingScroll({
  reducer,
  action,
  dataKey,
  Component,
  loadMore,
  loadingIndicator,
  asyncThunk,
}) {
  const theme = useTheme();
  const dispatch = useDispatch()
  const loading = useSelector((state) => state[reducer]?.loadings[action]);
  const response = useSelector((state) => state[reducer]?.[dataKey]);
  const error = useSelector((state) => state[reducer].errors[action]);
  const params = useSelector((state) => state[reducer].paramsForThunk[action]);

  const errorMessages = useSelector(
    (state) => state[reducer].errorMessages[action]
  );
  return error ? (
    <div
      onClick={() => {
        asyncThunk && dispatch(asyncThunk(params ?? {}));
      }}
    >
      <div className="container data-error">
        <p>žádná data</p>
      </div>
    </div>
  ) : response?.data?.length ? (
    <InfiniteScroll
      style={{ backgroundColor: "blue !important", width: "100% !important" }}
      dataLength={response?.data?.length ?? 0}
      next={() => !loading && loadMore()}
      hasMore={response?.loadMore}
      loader={"Načítám..."}
    >
      {response?.data?.map((item, index) => {
        return <Component {...item} key={index} />;
      })}
      {!response?.data.length && <p>No Data</p>}
    </InfiniteScroll>
  ) : loading ? (
    <h1></h1>
  ) : (
    <div style={{color: theme.palette.secondary.main, textAlign: "center"}}>Žádné uložené vzory</div>
  );
}

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTheme } from "@mui/material";

/**
  * Tento provider získává načítací a error hodnoty ze Store a vrací příslušné zprávy
  *
  * @param {reducer} x 
  * @param {action} x 
  * @param {dataKey} x 
  * @param {Component} x 
  * @param {loadMore} x 
  * @param {asyncThunk} x 
  * @return {} komponenta
  */
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

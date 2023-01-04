import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import Loader from "./Loader";
// import { Label, Row, Col, Spinner } from "react-bootstrap";
// import Image from 'next/image'
import CircularProgress from '@mui/material/CircularProgress';

// this provider get the loading and error values from the store and show related messages otherwise show the children
export default function ProvierErrorLoading({
  reducer,
  action,
  children,
  asyncThunk,
  loadingIndicator,
  compromiseCode,
  compromiseMessage,
}) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state[reducer].loadings[action]);
  const error = useSelector((state) => state[reducer].errors[action]);
  const errorMessages = useSelector(
    (state) => state[reducer].errorMessages[action]
  );
  const errorCodes = useSelector((state) => state[reducer].errorCodes[action]);
  const serverParams = useSelector(
    (state) => state[reducer].paramsForThunk[action]
  );

  //original is loading replaced with true to check loaders
  return loading ? (
    // <Loader indicator={loadingIndicator ?? action} />
    <CircularProgress />

  ) : error ? (
    +compromiseCode === +errorCodes || errorMessages === compromiseMessage ?
      children
      :
      <div
        onClick={() => {
          asyncThunk && dispatch(asyncThunk(serverParams ?? {}));
        }}
      >
        <div className="container data-error">
          {error ? errorMessages : "Něco se pokazilo."}
        </div>
      </div>
  ) : (
    children
  )
}

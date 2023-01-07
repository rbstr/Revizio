// ** Reducers Imports
import auth from "./slices/authSlice";
import client from "./slices/clientsSlice";
import revision from "./slices/revisionSlice";
import defect from "./slices/defectSlice";
import pattern from "./slices/patternSlice";
import meeting from "./slices/meetingSlice";
import { combineReducers } from "@reduxjs/toolkit";

/**
  * Vícenásobný reducer
  * @return {} reducer
  */

const rootReducer = combineReducers({
  auth,
  client,
  revision,
  defect,
  pattern,
  meeting,
});

export default rootReducer;

// ** Reducers Imports
import auth from "./slices/authSlice";
import client from "./slices/clientsSlice";
import revision from "./slices/revisionSlice";
import defect from "./slices/defectSlice";
import pattern from "./slices/patterSlice";
import meeting from "./slices/meetingSlice";


import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  auth,
  client,
  revision,
  defect,
  pattern,
  meeting,
});

export default rootReducer;

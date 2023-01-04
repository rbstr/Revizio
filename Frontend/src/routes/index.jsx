import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import  Calendar  from "pages/Dashboard/Calendar";
import { Clients } from "pages/Dashboard/Clients";
import { Home } from "pages/Dashboard/Home";
import { Layout } from "pages/Dashboard/Layout";
import { Profile } from "pages/Dashboard/Profile";
import { Error404 } from "pages/Error/Error404";
import { EditProfile } from "pages/Dashboard/Profile/EditProfile";
import { ProfileLayout } from "pages/Dashboard/Profile/ProfileLayout";
import { ProfileSetting } from "pages/Dashboard/Profile/ProfileSetting";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "config/firebase";
import { getProfileAsyncThunk, logout, setUser } from "redux/slices/authSlice";
import { DummyData } from "Authentication/DummyData";
import ProtectedRoute from "hooks/ProtectedRoute";
import CircularProgress from "@mui/material/CircularProgress";
import { ViewClientProfile } from "pages/Dashboard/Clients/viewClientProfile";
import { EditClientProfile } from "pages/Dashboard/Clients/editClientProfile";
import { ClientLayout } from "pages/Dashboard/Clients/clientLayout";
import { Revisions } from "pages/Dashboard/Clients/revisions";
import { Revision } from "pages/Dashboard/Revision";
import { RevisionService } from "pages/Dashboard/Revision/Service";
import { RevisionInitial } from "pages/Dashboard/Revision/Inital";
import { LoadPattern } from "pages/Dashboard/Revision/LoadPattern";
import { resetRevisionForm } from "redux/slices/revisionSlice";
import { useTheme } from "@mui/material";

export const WebRoutes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const location = useLocation()
  const theme = useTheme()
  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // const uid = user.uid;
        dispatch(setUser({ user }));
        dispatch(getProfileAsyncThunk());
        setIsLoading(false);
      } else {
        dispatch(logout());
        setIsLoading(false);
        //console.log("not login");
      }
    });
  }, []);
  useEffect(()=> {
    if(!location.pathname.includes("/revision")) {
      dispatch(resetRevisionForm())
    }
  },[location.pathname, dispatch]);
  if (isLoading) {
    return (
      <div style={{
        backgroundColor: theme.palette.background.default,
      }} className="app-loading">
        <CircularProgress />{" "}
      </div>
    );
  };
  return (
      <Routes>
        {!isLoggedIn ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<DummyData />} />
          </Route>
        ) : (
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="revision/">
              <Route index element={<Revision />} />
              <Route path="loadpattern" element={<LoadPattern />} />
              <Route path="service" element={<RevisionService />} />
              <Route path="initial" element={<RevisionInitial />} />
            </Route>

            <Route path="clients/" element={<ClientLayout />}>
              <Route index element={<Clients />} />
              <Route path="revisions" element={<Revisions />} />
              <Route path=":id" element={<ViewClientProfile />} />
              <Route path="edit/:id" element={<EditClientProfile />} />
            </Route>
            <Route path="calendar" element={<Calendar />} />

            <Route path="profile/" element={<ProfileLayout />}>
              <Route index element={<Profile />} />
              <Route path="edit" element={<EditProfile />} />
              <Route path="setting" element={<ProfileSetting />} />
            </Route>
          </Route>
        )}

        <Route path="*" element={<Error404 />} />
      </Routes>
  );
};

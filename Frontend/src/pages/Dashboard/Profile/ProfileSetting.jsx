import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { PageHeader } from "utils/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { NotificationIcon } from "utils/icons";
import { InputBoxSwitch } from "utils/InputBoxSwitch";
import {
  getSettingsAsyncThunk,
  setSettingsAsyncThunk,
} from "redux/slices/authSlice";
import { CircularProgress, Typography } from "@mui/material";
import { getToken, isSupported} from "firebase/messaging";
import { messaging } from "config/firebase";
import { toast } from "react-toastify";
import { useMediaQuery } from "@mui/material"

export const ProfileSetting = () => {

  const mobileScreen = useMediaQuery("(max-width:600px)");

  function isIOS() {
    const browserInfo = navigator.userAgent.toLowerCase();
    
    if (browserInfo.match('iphone') || browserInfo.match('ipad')) {
      return true;
    }
    if (['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform)) {
      return true;
    } 
    return false;
  }

  function isGranted() {
    if (isIOS()) return;
    return Notification.permission === "granted"
  }


  const { user, profile, settings } = useSelector((state) => state.auth);
  const {
    setSettingsAsyncThunk: ssLoading,
    getSettingsAsyncThunk: gsLoading,
  } = useSelector((state) => state.auth.loadings);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSettingsAsyncThunk());
  }, [dispatch]);
  const [token, setToken] = React.useState("");
  useEffect(() => {
    if (isGranted()) {
      getToken(messaging).then((token) => {
        setToken(token);
      });
    }
  }, []);

  return (
    <>
      <PageHeader
        title="Nastavení"
        subTitle={
          (profile?.firstName
            ? profile?.firstName + " " + profile?.lastName
            : false) ??
          user?.displayName ??
          "Guest"
        }
        goBack={{ name: "Zpět na můj profil", url: "/profile" }}
      />
      <Grid container>
        <Grid item xs={12} sm={6} md={4} sx={{
              ".MuiStack-root":{
                marginTop: mobileScreen ? -0.7 : 0
              }
            }}>
          
          <InputBoxSwitch
            icon={
                <NotificationIcon width={mobileScreen ? "22" :"25"} style={{
                  marginTop: mobileScreen ? 4 : 0
                }} />     
            }
            title= {<Typography sx={{fontWeight: 500, 
              fontSize: mobileScreen ? 15 : 16, 
              marginTop: mobileScreen ? 0.7 : 0.2}}> Notifikace </Typography> }

            onChange={async (e) => {
              const supported = await isSupported();
              if(!supported) {
                toast.error("Notifikace nejsou na tvém zařízení povoleny 🫠");
                e.preventDefault();
                return;
              }
              const permission = await Notification.requestPermission();

              if (isGranted()) {
                if(settings?.[token]) {
                  const token = await getToken(messaging);
                  //console.log(e.target.checked)
                  dispatch(
                    setSettingsAsyncThunk({
                      callBack: () => dispatch(getSettingsAsyncThunk()),
                      data: {
                        [token]: false,
                      },
                    })
                  );
                } else {
                  const token = await getToken(messaging);
                  dispatch(
                    setSettingsAsyncThunk({
                      callBack: () => dispatch(getSettingsAsyncThunk()),
                      data: {
                        [token]: true,
                      },
                    })
                  );
                }
              } else {
                //toast.error("Please allow notification");
                e.preventDefault();
                if(token) {
                  dispatch(
                    setSettingsAsyncThunk({
                      callBack: () => dispatch(getSettingsAsyncThunk()),
                      data: {
                        [token]: false,
                      },
                    })
                  );
                }
              }
            }}
            checked={isGranted() ? settings?.[token] : false}
          />
        </Grid>
      </Grid>
    </>
  );
};

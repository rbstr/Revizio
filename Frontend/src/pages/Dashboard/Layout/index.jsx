import React from "react";
import { useSidebarContext } from "context/SidebarContext";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { Sidebar } from "components/Layout/sidebar";
import { BottomBar } from "components/Layout/bottombar";
import useMediaQuery from "@mui/material/useMediaQuery";


/**
  * Definice zobrazení stránky
  * @return {}
  */


export const Layout = () => {
  const tableScreen = useMediaQuery("(max-width:900px)");
  const { sidebarWidth } = useSidebarContext();
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 5.5, lg: `calc(4%)`, xl: `calc(5%)` },
          width: {
            xs: "calc(100%)",
            sm: `calc(100% - ${sidebarWidth}px)`,
          },
        }}
      >
        <Outlet />
        <BottomBar />
        {tableScreen && (
          <>
            <Box paddingY={1.5}></Box>
            <Toolbar />
          </>
        )}
      </Box>
    </Box>
  );
};

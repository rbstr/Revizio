import React, { createContext, useState, useContext } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
const SidebarContext = createContext();

export const SidebarContextProvider = (props) => {
  const largeScreen = useMediaQuery("(min-width:1200px)");
  const expandedSidebar = largeScreen;
  let sidebarWidth = expandedSidebar ? 240 : 100;
  const [sidebar, setSidebar] = useState(false);
  const handleSidebarToggle = () => {
    setSidebar(!sidebar);
  };

  return (
    <SidebarContext.Provider
      value={{
        sidebarWidth,
        sidebar,
        expandedSidebar,
        setSidebar,
        handleSidebarToggle,
      }}
    >
      {props.children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = () => {
  return useContext(SidebarContext);
};

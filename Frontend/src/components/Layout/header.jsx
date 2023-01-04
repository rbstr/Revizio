import React from "react";
import { useSidebarContext } from "context/SidebarContext";
import { useThemeContext } from "context/ThemeContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export const Header = () => {
  const { sidebarWidth } = useSidebarContext();
  const { colorMode, selectedTheme } = useThemeContext();
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${sidebarWidth}px)` },
        ml: { sm: `${sidebarWidth}px` },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Responsive drawer
        </Typography>
        <IconButton
          sx={{ ml: 1 }}
          onClick={colorMode.toggleColorMode}
          color="inherit"
        >
          {selectedTheme === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

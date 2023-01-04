import React from "react";
import {BrowserRouter as Router, Link} from 'react-router-dom';
import { useSidebarContext } from "context/SidebarContext";
import { NavLink } from "react-router-dom";
import { useThemeContext } from "context/ThemeContext";

import { pageLinksArr } from "utils/pageUrls";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import logoLight from "assets/images/logo/logo-light.webp";
import logoDark from "assets/images/logo/logo-dark.webp";

export const Sidebar = (props) => {
  const theme = useTheme();
  const { selectedTheme } = useThemeContext();
  const { sidebarWidth, sidebar, handleSidebarToggle, expandedSidebar } =
    useSidebarContext();
  const { window } = props;
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const SidebarItem = ({ icon, name, onClick, activeTab }) => {
    return (
      <ListItem disablePadding onClick={onClick}>
        <ListItemButton
          sx={{
            color: activeTab
              ? theme.palette.text.primary
              : theme.palette.secondary.main,
          }}
        >
          <Box
            sx={{
              justifyContent: expandedSidebar ? "left" : "center",
              margin: expandedSidebar ? "auto 1rem auto" : ".5rem auto",
              color: activeTab
                ? theme.palette.primary.main
                : theme.palette.secondary.main,
            }}
          >
            {icon}
          </Box>
          <ListItemText
            disableTypography
            primary={<Typography type="body2" style={{ color: activeTab ? theme.palette.text.primary : theme.palette.text.secondary, 
              fontWeight: activeTab ? 600 : 400}}>{name}</Typography>}
            sx={{
              display: expandedSidebar ? "block" : "none",
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const sidebarSection = (
    <div>
      <Box
        sx={{
          textAlign: "center",
          padding: expandedSidebar ? "4rem 3.5rem" : "4rem 1rem 2rem",
        }}
      >
        <Link to="/">
        <img
          src={selectedTheme === "light" ? logoDark : logoLight}
          alt="Logo"
          className="img-fluid"
        />
        </Link>
      </Box>
      <List>
        {pageLinksArr.map((sidebarItem, index) => (
          <NavLink
            to={sidebarItem.url}
            key={index}
            end={sidebarItem.url == "/" ? true : false}
          >
            {({ isActive }) => (
              <SidebarItem
                name={sidebarItem.name}
                icon={sidebarItem.icon}
                activeTab={isActive}
              />
            )}
          </NavLink>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: sidebarWidth },
        flexShrink: { sm: 0 },
      }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={sidebar}
        onClose={handleSidebarToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },

          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: sidebarWidth,
          },
        }}
      >
        {sidebarSection}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            background: theme.palette.background.default,
            width: sidebarWidth,
          },
        }}
        open
      >
        {sidebarSection}
      </Drawer>
    </Box>
  );
};

Sidebar.propTypes = {
  window: PropTypes.func,
};

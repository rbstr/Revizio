import React, { useMemo, useState } from "react";
import Box from "@mui/system/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuList from "@mui/material/MenuList";
import { MoreHorizontalIcon } from "utils/icons";
import { toast } from "react-toastify";
import Divider from "@mui/material/Divider";
import { useTheme } from "@emotion/react";

/**
  * Dropdown komponenta = rozbalení možností
  *
  * @param {options} x 
  * @param {title} x 
  * @param {id} x 
  * @param {icon} x 
  * @param {children} x 
  * @param {maxWidth} x 
  * @param {onOpen} x 
  * @param {textAlign} x
  * @param {getValues} x  
  * @param {names} x 
  * @return {} komponenta
  */

export const Dropdown = ({
  options,
  title,
  id,
  icon,
  children,
  maxWidth,
  onOpen,
  textAlign,
  getValues,
  name
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    if(onOpen) onOpen(event)
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = useMemo(()=> {
    if(name) {
      if(Boolean(anchorEl) && getValues(name)) {
        return true
      } else if(Boolean(anchorEl)) {
        toast.error("Prosím nejprve vyplň název.", {
          toastId: "dropdown-error",
        })
        setAnchorEl(null)
      } else {
        return false
      }
    } else {
      return Boolean(anchorEl)
    }
  },[anchorEl, getValues, name])
  return (
    <Box>
      <Box sx={{ textAlign: textAlign }}>
        <Typography
          id="basic-button"
          component="span"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          className={"pe-cursor"}
        >
          {!icon && !title && <MoreHorizontalIcon style={{color: "#666666"}} />}
          {icon && icon}
          {title && title}
        </Typography>
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ maxWidth: maxWidth || null, marginTop:0.1,
          "& .MuiPaper-root": {
          background: theme.palette.background.paper
        }  }}
      >
        {options && options.length > 0 && (
          <MenuList disablePadding sx={{background: theme.palette.background.paper}}>
            {options.map((option, index) => {
              return (
                <MenuItem
                  sx={{
                    "&.MuiButtonBase-root": {
                      minHeight: "auto",
                      
                    }
                  }}
                  onClick={
                    option.onClick || option.onclick
                      ? () => {
                          option?.onclick
                            ? option.onclick(id)
                            : option?.onClick && option?.onClick(id);
                          handleClose();
                        }
                      : handleClose
                  }
                  key={index}
                >
                  <ListItemIcon style={{color: theme.palette.text.primary, opacity:1}}>{option.icon}</ListItemIcon>
                  <Typography variant="dropdown">{option.name}</Typography>
                </MenuItem> 
              );
            })}
          </MenuList>
        )}
        {typeof children === "function" ? children({
          open,
          handleClose,
          handleClick,
        }) : children}
      </Menu>
    </Box>
  );
};

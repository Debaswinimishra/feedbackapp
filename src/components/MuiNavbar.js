import React, { useState } from "react";
import { useDispatch } from "react-redux";
// components
import MuiDrawer from "./MuiDrawer";

// MUI
import {
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Stack,
  Menu,
  MenuItem,
} from "@mui/material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { logout } from "../pages/login/Login.Slice";
import { Version, networkStatus } from "../api/api";

function MuiNavbar() {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#e0f7fa" }}>
      <Toolbar>
        {/* <MuiDrawer /> */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={2}>
            <div className="mis-title1" style={{ color: "black" }}>
              <b>Feedback App</b>
            </div>
            {/* <div>
              ThinkZone Edubridge
              <sub style={{ fontSize: "12px", fontStyle: "italic" }}>
                v{Version.version} {networkStatus}
              </sub>
            </div> */}
          </Stack>
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            color="inherit"
            id="userprofile-button"
            aria-controls={open ? "userprofile-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleMenuClick}
          >
            {/* Profile */}
            <Avatar sx={{ m: 1, bgcolor: "#3f51b5", width: 37, height: 37 }}>
              <AccountCircleIcon />
            </Avatar>
          </Button>
        </Stack>
        <Menu
          id="userprofile-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          MenuListProps={{
            "aria-labelledby": "userprofile-button",
          }}
        >
          <MenuItem onClick={handleClose}>
            <Stack
              onClick={handleLogout}
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <IconButton
                size="small"
                edge="start"
                color="inherit"
                aria-label="logo"
              >
                <ExitToAppIcon />
              </IconButton>
              <Typography component="div">Logout</Typography>
            </Stack>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default MuiNavbar;

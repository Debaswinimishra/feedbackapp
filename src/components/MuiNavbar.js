import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2"; // Import SweetAlert
// components
import MuiDrawer from "./MuiDrawer";

// MUI
import {
  Avatar,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { logout } from "../pages/login/Login.Slice";

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
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3f51b5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
      }
    });
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#e0f7fa" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={2}>
            <div className="mis-title1" style={{ color: "black" }}>
              <b>Feedback App</b>
            </div>
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
            <Avatar
              sx={{ m: 1, bgcolor: "#3f51b5", width: 37, height: 37 }}
              onClick={handleLogout}
            >
              <LogoutIcon />
            </Avatar>
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default MuiNavbar;

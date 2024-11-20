import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2"; // Import SweetAlert
// components
import MuiDrawer from "./MuiDrawer";
import AssessmentIcon from "@mui/icons-material/Assessment";
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
import { useNavigate } from "react-router-dom";

function MuiNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleSaveClick = async () => {
    const result = await Swal.fire({
      title: "Enter Password!",
      input: "text",
      inputPlaceholder: "Enter your password.",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Submit",
      confirmButtonColor: "#3085d6",
      inputValidator: (value) => {
        if (!value) {
          return "Please enter the password!";
        } else if (value !== "tHINKZONEcda-11") {
          return "Password is incorrect!";
        }
      },
    });

    if (result.isConfirmed) {
      Swal.fire("Success!", "Successfully Verified.", "success");
      navigate("/feedbackReport");
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#e0f7fa" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={2}>
            {/* <div className="mis-title1">MIS</div> */}
            <div className="mis-title1" style={{ color: "black" }}>
              <b>Parents Response</b>
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
                <AssessmentIcon />
              </IconButton>
              <Typography component="div" onClick={handleSaveClick}>
                Report
              </Typography>
            </Stack>
          </MenuItem>

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

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MuiLoader from "../../components/MuiLoader";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  createTheme,
  ThemeProvider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff"; // Import the visibility off icon

import avatar from "./../../assets/logo.png";
import { authenticateUserThunk } from "./Login.Thunk";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

const theme = createTheme();

function LoginPage() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const loading = useSelector((state) => state.LoginSlice.loading);
  const message = useSelector((state) => state.LoginSlice.message);

  const loggedin = useSelector((state) => state.LoginSlice.loggedin);
  const [toastShown, setToastShown] = useState(false);
  console.log("loggedin---------->", loggedin);

  if (!localStorage.getItem("uniqueId")) {
    const newUuid = uuidv4();
    localStorage.setItem("uniqueId", newUuid);
    console.log("New UUID generated and set:", newUuid);
  }

  useEffect(() => {
    console.log(message);
  }, [message]);

  const login_button_click = async () => {
    if (!email) {
      showToast("Please enter a valid email id");
    } else if (!password) {
      showToast("Please enter a valid password");
    } else {
      const user = {
        userid: email,
        pswd: password,
      };

      try {
        await dispatch(authenticateUserThunk(user));

        if (loggedin === false) {
          showToast("Invalid userid/ password");
        } else {
          showToast(message);
        }
      } catch (error) {
        console.error("Authentication error:", error);
      }
    }
  };

  const showToast = (message) => {
    toast.error(message);
  };

  return (
    <>
      <style>
        {`
  body {
    margin: 0;
    padding: 0;
    background-color: #e0f7fa; /* Light blue background */
  }
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #e0f7fa; /* Same light blue background */
  }
  .login-box {
    background: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  }
  .avatar-container {
    display: flex; /* Added to center the avatar */
    align-items: center; /* Center vertically */
    justify-content: center; /* Center horizontally */
    margin-bottom: 20px;
  }
  .login-title {
    margin-bottom: 20px;
    font-weight: bold;
    color: #333;
  }
  .login-button {
    background-color: #3f51b5;
    color: white;
    font-weight: bold;
  }
  .login-button:hover {
    background-color: #303f9f;
  }
  .footer-text {
    margin-top: 40px;
    color: #999;
  }
  .footer-text a {
    color: #3f51b5;
  }
  `}
      </style>

      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs" className="login-container">
          <CssBaseline />
          <Box className="login-box">
            <Box className="avatar-container">
              <Avatar sx={{ m: 1, bgcolor: "#3f51b5", width: 42, height: 42 }}>
                <Avatar alt="Logo" src={avatar} />
              </Avatar>
            </Box>
            <Typography
              component="h1"
              variant="h5"
              className="login-title"
              sx={{ textAlign: "center" }}
            >
              Sign in here!
            </Typography>
            <Box noValidate sx={{ mt: 1 }}>
              <TextField
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                margin="normal"
                required
                fullWidth
                autoFocus
              />
              <TextField
                id="password"
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"} // Toggle password visibility
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                margin="normal"
                required
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((prev) => !prev)} // Toggle state
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <div className="text-center text-md-start mt-4 pt-2">
                <Button
                  onClick={login_button_click}
                  fullWidth
                  variant="contained"
                  className="login-button"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In here
                </Button>
              </div>
            </Box>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            className="footer-text"
            sx={{ mt: 8, mb: 4 }}
          >
            {"Copyright © "}
            <Link color="inherit" href="https://thinkzone.in/" target="_blank">
              ThinkZone Edubridge
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
        </Container>
      </ThemeProvider>

      <MuiLoader open={loading} />
      <ToastContainer />
    </>
  );
}

export default LoginPage;

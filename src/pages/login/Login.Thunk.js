import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const authenticateUserThunk = createAsyncThunk(
  "login/authenticate",
  async (user) => {
    let response = await api.get(`/authUserCred/${user.userid}/${user.pswd}`);
    return response.data;
  }
);

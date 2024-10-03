import axios from "axios";
const baseURL = "https://thinkzone.in.net/thinkzone";
// const baseURL = "https://thinkzone.co/thinkzone";
// const baseURL = "http://3.142.110.38/thinkzone";
//Application Version to change here
export const Version = {
  version: "1.5.6",
};

export const networkStatus =
  baseURL === "https://thinkzone.in.net/thinkzone"
    ? "Test 🔴"
    : "Production 🟢";

//Axios create baseUrls for changing different servers
export default axios.create({
  baseURL,
});

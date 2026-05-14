import axios from "axios";

const API = axios.create({
  baseURL: "https://scholarship-management-system-runz.onrender.com/api", // your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
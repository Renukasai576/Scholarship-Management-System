import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api", // your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
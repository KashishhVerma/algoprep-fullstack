import { post, get } from "./api";

export const registerUser = ({ name, email, password }) =>
  post("/auth/register", { name, email, password });

export const loginUser = ({ email, password }) =>
  post("/auth/login", { email, password });

export const getMe = () => get("/auth/me");

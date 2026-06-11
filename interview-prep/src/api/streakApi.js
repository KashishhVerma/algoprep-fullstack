import { get, post } from "./api";

export const fetchStreak    = ()  => get("/streak");
export const recordActivity = ()  => post("/streak/activity");

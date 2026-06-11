import { get, patch } from "./api";

export const fetchProgress       = ()          => get("/progress");
export const apiToggleSolved     = (problemId) => patch(`/progress/${problemId}/solved`);
export const apiToggleBookmark   = (problemId) => patch(`/progress/${problemId}/bookmark`);

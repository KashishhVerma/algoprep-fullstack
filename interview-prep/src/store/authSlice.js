import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../api/authApi";
import { resetDSA } from "./dsaSlice";
import { resetNotes } from "./notesSlice";
import { resetStreak } from "./streakSlice";

// ── Thunks ──────────────────────────────────────────────────────
export const loginThunk = createAsyncThunk("auth/login", async (creds, { rejectWithValue }) => {
  try {
    const data = await loginUser(creds);
    localStorage.setItem("ip_token", data.token);
    return data.user;
  } catch (err) { return rejectWithValue(err.message); }
});

export const registerThunk = createAsyncThunk("auth/register", async (creds, { rejectWithValue }) => {
  try {
    const data = await registerUser(creds);
    localStorage.setItem("ip_token", data.token);
    return data.user;
  } catch (err) { return rejectWithValue(err.message); }
});

// ── Slice ────────────────────────────────────────────────────────
const stored = localStorage.getItem("ip_user");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: stored ? JSON.parse(stored) : null,
    isAuthenticated: !!localStorage.getItem("ip_token"),
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("ip_token");
      localStorage.removeItem("ip_user");
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending  = (state)       => { state.loading = true;  state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };
    const fulfilled = (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("ip_user", JSON.stringify(action.payload));
    };
    builder
      .addCase(loginThunk.pending,    pending)
      .addCase(loginThunk.fulfilled,  fulfilled)
      .addCase(loginThunk.rejected,   rejected)
      .addCase(registerThunk.pending,    pending)
      .addCase(registerThunk.fulfilled,  fulfilled)
      .addCase(registerThunk.rejected,   rejected);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

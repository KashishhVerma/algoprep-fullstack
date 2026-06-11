import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchStreak,
  recordActivity as apiRecord,
} from "../api/streakApi";

export const loadStreak = createAsyncThunk(
  "streak/load",
  async (_, { rejectWithValue }) => {
    try {
      return (await fetchStreak()).streak;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const recordActivityThunk = createAsyncThunk(
  "streak/record",
  async (_, { rejectWithValue }) => {
    try {
      return (await apiRecord()).streak;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const streakSlice = createSlice({
  name: "streak",

  initialState: {
    currentStreak: 0,
    maxStreak: 0,
    lastSolvedDate: null,
    dailyLog: {},
  },

  reducers: {
    resetStreak(state) {
      state.currentStreak = 0;
      state.maxStreak = 0;
      state.lastSolvedDate = null;
      state.dailyLog = {};
    },
  },

  extraReducers: (builder) => {
    const apply = (state, a) => {
      if (a.payload) {
        Object.assign(state, a.payload);
      }
    };

    builder
      .addCase(loadStreak.fulfilled, apply)
      .addCase(recordActivityThunk.fulfilled, apply);
  },
});

export const { resetStreak } = streakSlice.actions;

export default streakSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProgress, apiToggleSolved, apiToggleBookmark } from "../api/progressApi";

export const loadProgress = createAsyncThunk(
  "dsa/loadProgress",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchProgress();
      return data.progress;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleSolvedThunk = createAsyncThunk(
  "dsa/toggleSolved",
  async (problemId, { rejectWithValue }) => {
    try {
      const data = await apiToggleSolved(problemId);
      return { problemId: data.problemId, solved: data.solved };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleBookmarkThunk = createAsyncThunk(
  "dsa/toggleBookmark",
  async (problemId, { rejectWithValue }) => {
    try {
      const data = await apiToggleBookmark(problemId);
      return {
        problemId: data.problemId,
        bookmarked: data.bookmarked,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const dsaSlice = createSlice({
  name: "dsa",
  initialState: {
    progress: {},
    filter: "All",
    search: "",
    loading: false,
  },

  reducers: {
    setFilter(state, action) {
      state.filter = action.payload;
    },

    setSearch(state, action) {
      state.search = action.payload;
    },

    resetDSA(state) {
      state.progress = {};
      state.filter = "All";
      state.search = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadProgress.fulfilled, (state, action) => {
        state.progress = action.payload || {};
      })

      .addCase(toggleSolvedThunk.fulfilled, (state, action) => {
        const { problemId, solved } = action.payload;

        state.progress[problemId] = {
          ...state.progress[problemId],
          solved,
          solvedAt: solved ? new Date().toISOString() : null,
        };
      })

      .addCase(toggleBookmarkThunk.fulfilled, (state, action) => {
        const { problemId, bookmarked } = action.payload;

        state.progress[problemId] = {
          ...state.progress[problemId],
          bookmarked,
        };
      });
  },
});

export const { setFilter, setSearch, resetDSA } =
  dsaSlice.actions;

export default dsaSlice.reducer;
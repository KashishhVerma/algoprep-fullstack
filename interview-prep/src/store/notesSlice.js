import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchNotes,
  createNote as apiCreate,
  updateNote as apiUpdate,
  deleteNote as apiDelete,
} from "../api/notesApi";

export const loadNotes = createAsyncThunk(
  "notes/load",
  async (_, { rejectWithValue }) => {
    try {
      return (await fetchNotes()).notes;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addNoteThunk = createAsyncThunk(
  "notes/add",
  async (note, { rejectWithValue }) => {
    try {
      return (await apiCreate(note)).note;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateNoteThunk = createAsyncThunk(
  "notes/update",
  async ({ id, ...note }, { rejectWithValue }) => {
    try {
      return (await apiUpdate(id, note)).note;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteNoteThunk = createAsyncThunk(
  "notes/delete",
  async (id, { rejectWithValue }) => {
    try {
      await apiDelete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const notesSlice = createSlice({
  name: "notes",

  initialState: {
    notes: [],
    loading: false,
  },

  reducers: {
    resetNotes(state) {
      state.notes = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadNotes.fulfilled, (state, a) => {
        state.notes = a.payload;
      })

      .addCase(addNoteThunk.fulfilled, (state, a) => {
        state.notes.unshift(a.payload);
      })

      .addCase(updateNoteThunk.fulfilled, (state, a) => {
        const idx = state.notes.findIndex(
          (n) => n._id === a.payload._id
        );

        if (idx !== -1) {
          state.notes[idx] = a.payload;
        }
      })

      .addCase(deleteNoteThunk.fulfilled, (state, a) => {
        state.notes = state.notes.filter(
          (n) => n._id !== a.payload
        );
      });
  },
});

export const { resetNotes } = notesSlice.actions;

export default notesSlice.reducer;
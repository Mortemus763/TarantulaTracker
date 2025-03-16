import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { csrfFetch } from "./csrf";

// Fetch Forum Posts
export const fetchForums = createAsyncThunk(
  "forums/fetchForums",
  async (_, { rejectWithValue }) => {
    try {
      const response = await csrfFetch("/api/forums/");
      if (!response.ok) throw new Error("Failed to fetch forum posts");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a New Forum Post
export const createForum = createAsyncThunk(
  "forums/createForum",
  async (forumData, { rejectWithValue }) => {
    try {
      const response = await csrfFetch("/api/forums/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(forumData),
      });
      if (!response.ok) throw new Error("Failed to create forum post");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Edit Forum Post
export const editForum = createAsyncThunk(
  "forums/editForum",
  async ({ forumId, forumData }, { rejectWithValue }) => {
    try {
      const response = await csrfFetch(`/api/forums/${forumId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(forumData),
      });
      if (!response.ok) throw new Error("Failed to edit forum post");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Forum Post
export const deleteForum = createAsyncThunk(
  "forums/deleteForum",
  async (forumId, { rejectWithValue }) => {
    try {
      const response = await csrfFetch(`/api/forums/${forumId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete forum post");
      return { forumId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const forumSlice = createSlice({
  name: "forums",
  initialState: { list: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchForums.fulfilled, (state, action) => {
        state.list = action.payload.forums;
      })
      .addCase(createForum.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editForum.fulfilled, (state, action) => {
        const index = state.list.findIndex(forum => forum.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteForum.fulfilled, (state, action) => {
        state.list = state.list.filter(forum => forum.id !== action.payload.forumId);
      });
  },
});

export default forumSlice.reducer;

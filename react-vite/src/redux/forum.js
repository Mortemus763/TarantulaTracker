import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { csrfFetch } from "./csrf";

// Fetch Forum Posts
export const fetchForums = createAsyncThunk(
  "forums/fetchForums",
  async (_, { rejectWithValue }) => {
    try {
      const response = await csrfFetch("/api/forums/");

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.error || "Failed to fetch forum posts");
      }

      const data = await response.json();
      return data.forums.map(post => ({
        ...post,
        tags: post.tags || [] // Ensure tags exist
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a New Forum Post with Tags
export const createForum = createAsyncThunk(
  "forums/createForum",
  async (forumData, { rejectWithValue }) => {
    try {
      const response = await csrfFetch("/api/forums/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(forumData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        return rejectWithValue(errorData.error || "Failed to create forum post");
      }

      const newForum = await response.json();
      console.log("New Forum Created:", newForum);

      return {
        ...newForum.forumPost,
        tags: newForum.forumPost.tags || []
      };
    } catch (error) {
      console.error("Create Forum Catch Block Error:", error);
      return rejectWithValue(error?.message || "Unknown error occurred");
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to edit forum post");
      }

      const updatedForum = await response.json();
      return {
        ...updatedForum.forumPost,
        tags: updatedForum.forumPost.tags || [] // Ensure tags exist
      };
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete forum post");
      }

      return { forumId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const forumSlice = createSlice({
  name: "forums",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchForums.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchForums.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchForums.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createForum.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(createForum.rejected, (state, action) => {
        console.error("Create Forum Failed:", action.payload);
        state.error = action.payload;
      })
      .addCase(editForum.fulfilled, (state, action) => {
        const index = state.list.findIndex(forum => forum.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteForum.fulfilled, (state, action) => {
        state.list = state.list.filter(forum => forum.id !== action.payload.forumId);
      });
  },
});

export default forumSlice.reducer;

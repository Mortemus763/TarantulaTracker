import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { csrfFetch } from "./csrf";

// Fetch Favorite Tarantulas
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await csrfFetch("/api/favorites/");
      if (!response.ok) throw new Error("Failed to fetch favorites");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add a Tarantula to Favorites
export const addFavorite = createAsyncThunk(
  "favorites/addFavorite",
  async (tarantulaId, { rejectWithValue }) => {
    try {
      const response = await csrfFetch("/api/favorites/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tarantula_id: tarantulaId }),
      });
      if (!response.ok) throw new Error("Failed to add to favorites");
      return { tarantulaId }; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Remove a Tarantula from Favorites
export const removeFavorite = createAsyncThunk(
  "favorites/removeFavorite",
  async (tarantulaId, { rejectWithValue }) => {
    try {
      const response = await csrfFetch(`/api/favorites/${tarantulaId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove from favorites");
      return { tarantulaId }; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: { list: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.list = action.payload.favorites.map((fav) => fav.id); 
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        if (!state.list.includes(action.payload.tarantulaId)) {
          state.list.push(action.payload.tarantulaId);
        }
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.list = state.list.filter((id) => id !== action.payload.tarantulaId);
      });
  },
});

export default favoritesSlice.reducer;

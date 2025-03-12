import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { csrfFetch } from "./csrf";


export const fetchTarantulas = createAsyncThunk(
  "tarantulas/fetchTarantulas",
  async (_, { rejectWithValue }) => {
    try {
      const response = await csrfFetch("/api/tarantulas/");
      if (!response.ok) {
        throw new Error("Failed to fetch tarantulas");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTarantula = createAsyncThunk(
  "tarantulas/addTarantula",
  async (tarantulaData, { rejectWithValue }) => {
    try {
      const response = await csrfFetch("/api/tarantulas/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarantulaData),
      });

      if (!response.ok) {
        throw new Error("Failed to add tarantula");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const tarantulasSlice = createSlice({
  name: "tarantulas",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTarantulas.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTarantulas.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.tarantulas;
      })
      .addCase(fetchTarantulas.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addTarantula.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default tarantulasSlice.reducer;

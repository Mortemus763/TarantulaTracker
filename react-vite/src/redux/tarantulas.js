import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { csrfFetch } from "./csrf";


export const fetchTarantulas = createAsyncThunk(
  "tarantulas/fetchTarantulas",
  async (_, { rejectWithValue }) => {
    try {
      const response = await csrfFetch("/api/tarantulas/");
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch tarantulas");
      }
      return data;
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
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to add tarantula");
      }

      const responseData = await response.json();

      return responseData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const updateTarantula = createAsyncThunk(
  "tarantulas/updateTarantula",
  async (tarantulaData, { rejectWithValue }) => {
    try {
      console.log("Submitting update:", tarantulaData);
      const response = await csrfFetch(`/api/tarantulas/${tarantulaData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarantulaData),
      });
      const data = await response.json();
      console.log("Update response:", data);

      if (!response.ok) {
        throw new Error("Failed to update tarantula");
      }

      return data;
    } catch (error) {
      console.error("Update failed:", error.message);
      return rejectWithValue(error.message);
    }
  }
);


export const deleteTarantula = createAsyncThunk(
  "tarantulas/deleteTarantula",
  async (tarantulaId, { rejectWithValue }) => {
    try {
      const response = await csrfFetch(`/api/tarantulas/${tarantulaId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete tarantula");
      }

      return tarantulaId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTarantulaById = createAsyncThunk(
  "tarantulas/fetchTarantulaById",
  async (tarantulaId, { rejectWithValue }) => {
    try {
      const response = await csrfFetch(`/api/tarantulas/${tarantulaId}`);
      if (!response.ok) throw new Error("Failed to fetch tarantula");
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
      })
      .addCase(updateTarantula.fulfilled, (state, action) => {
        if (!action.payload.tarantula) return;
      
        const updatedTarantula = action.payload.tarantula;
        const index = state.list.findIndex((t) => t.id === updatedTarantula.id);
      
        if (index !== -1) {
          state.list[index] = updatedTarantula; 
        }
      })
      .addCase(deleteTarantula.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t.id !== action.payload);
      });
  },
});

export default tarantulasSlice.reducer;

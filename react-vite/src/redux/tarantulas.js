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
      console.log("Submitting Data:", tarantulaData); // Debugging Log

      const response = await csrfFetch("/api/tarantulas/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarantulaData),
      });

      console.log("Full Response:", response); // Debugging Log

      if (!response.ok) {
        const errorData = await response.json();
        console.log("API Error:", errorData); // Log backend error response
        return rejectWithValue(errorData.error || "Failed to add tarantula");
      }

      const responseData = await response.json();
      console.log("API Success:", responseData); // Log success response

      return responseData;
    } catch (error) {
      console.log("Caught Error:", error.message); // Log any caught errors
      return rejectWithValue(error.message);
    }
  }
);


export const updateTarantula = createAsyncThunk(
  "tarantulas/updateTarantula",
  async (tarantulaData, { rejectWithValue }) => {
    try {
      const response = await csrfFetch(`/api/tarantulas/${tarantulaData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarantulaData),
      });

      if (!response.ok) {
        throw new Error("Failed to update tarantula");
      }

      return await response.json();
    } catch (error) {
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
        const index = state.list.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload; 
        }
      })
      .addCase(deleteTarantula.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t.id !== action.payload);
      });
  },
});

export default tarantulasSlice.reducer;

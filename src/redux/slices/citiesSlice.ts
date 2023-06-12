import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios-config";

export type City = {
  id: number;
  name: string;
};

type CitiesState = {
  cities: Array<City>;
  status: string;
  error: string | undefined;
};

const initialState: CitiesState = {
  cities: [],
  status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
  error: undefined,
}

export const fetchCities = createAsyncThunk(
  "cities/fetchCities",
  async () => {
    const response = await axiosInstance.get("/cities");
    return response.data;
  }
);

const citiesSlice = createSlice({
  name: "cities",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
  },
});

export const {} = citiesSlice.actions;

export default citiesSlice.reducer;

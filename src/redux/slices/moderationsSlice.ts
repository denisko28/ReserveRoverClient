import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios-config";

export type ModerPlace = {
  id: number;
  title: string;
  managerId: string;
  cityName: string;
  imagesCount: number;
  submissionDateTime: string;
  publicDate: string | null;
};

interface SearchParams {
  titleQuery?: string | null;
  moderationStatus: number;
  fromTime?: string | null;
  tillTime?: string | null;
}

interface UpdateStatusParams {
  placeId: number;
  moderationStatus: number;
}

type CitiesState = {
  moderPlaces: Array<ModerPlace>;
  status: string;
  error: string | undefined;
};

const initialState: CitiesState = {
  moderPlaces: [],
  status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
  error: undefined,
};

const PAGE_SIZE = 20;

export const fetchModerPlaces = createAsyncThunk(
  "moderations/fetchPlaces",
  async (searchParams: SearchParams) => {
    const response = await axiosInstance.get("/moderation/placesSearch", {
      params: {
        ...searchParams,
        pageNumber: 1,
        pageSize: PAGE_SIZE,
      },
    });
    return response.data;
  }
);

export const loadMoreModerPlaces = createAsyncThunk(
  "moderations/loadMore",
  async (searchParams: SearchParams, { getState }) => {
    const state: any = getState();
    const pageNumber = Math.ceil(state.moderPlaces.length / PAGE_SIZE);
    const response = await axiosInstance.get("/moderation/placesSearch", {
      params: {
        ...searchParams,
        pageNumber,
        pageSize: PAGE_SIZE,
      },
    });
    return response.data;
  }
);

export const updatePlaceStatus = async (updateParams: UpdateStatusParams) => {
  const response = await axiosInstance.post(
    "/moderation/updatePlaceStatus",
    updateParams
  );
  return response.data;
};

const moderationsSlice = createSlice({
  name: "moderations",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchModerPlaces.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchModerPlaces.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.moderPlaces = action.payload;
      })
      .addCase(fetchModerPlaces.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {} = moderationsSlice.actions;

export default moderationsSlice.reducer;

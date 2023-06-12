import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios-config";

export type PlaceDetails = {
  id: number;
  cityId: number;
  cityName: string;
  mainImageUrl: string;
  title: string;
  opensAt: string;
  closesAt: string;
  avgMark: number | null;
  avgBill: number;
  address: string;
  submissionDateTime: string;
  publicDate: string | null;
  moderationStatus: number;
  description: string;
  imageUrls: string[];
  paymentMethods: number[];
};

export type Review = {
  id: string;
  authorPhotoUrl: string;
  authorFullName: string;
  creationDate: string;
  mark: number;
  comment: string | null;
};

type PlaceDetailsState = {
  placeDetails: PlaceDetails | null;
  reviews: Review[];
  status: string;
  error: string | undefined;
};

const initialState: PlaceDetailsState = {
  placeDetails: null,
  reviews: [],
  status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
  error: undefined,
};

export const getPlaceDetails = createAsyncThunk(
  "places/getPlaceDetails",
  async (id: number) => {
    const response = await axiosInstance.get(`/places/details/${id}`);
    return response.data;
  }
);

const REVIEWS_PAGE_SIZE = 15;

export const getPlaceReviews = createAsyncThunk(
  "places/getReviews",
  async (placeId: number) => {
    const response = await axiosInstance.get("/places/reviews", {
      params: { placeId, pageNumber: 1, pageSize: REVIEWS_PAGE_SIZE },
    });
    return response.data;
  }
);

export const loadMoreReviews = createAsyncThunk(
  "places/loadMoreReviews",
  async (placeId: number, { getState }) => {
    const state: any = getState();
    const pageNumber = Math.ceil(state.places.length / REVIEWS_PAGE_SIZE);
    const response = await axiosInstance.get("/places/reviews", {
      params: { placeId, pageNumber, pageSize: REVIEWS_PAGE_SIZE },
    });
    return response.data;
  }
);

const placeDetailsSlice = createSlice({
  name: "placeDetails",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getPlaceDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPlaceDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.placeDetails = action.payload;
      })
      .addCase(getPlaceDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(getPlaceReviews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPlaceReviews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews = action.payload;
      })
      .addCase(getPlaceReviews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(loadMoreReviews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadMoreReviews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews = state.reviews.concat(action.payload);
      })
      .addCase(loadMoreReviews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {} = placeDetailsSlice.actions;

export default placeDetailsSlice.reducer;

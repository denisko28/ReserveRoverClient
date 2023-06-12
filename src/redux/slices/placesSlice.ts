import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { serverUrl } from "../../services/axios-config";

export type Place = {
  id: number;
  mainImageUrl: string;
  title: string;
  opensAt: string;
  closesAt: string;
  avgMark: number | null;
  avgBill: number;
};

interface SearchParams {
  cityId: number;
  titleQuery: string | null;
  sortOrder: number;
  // pageNumber: number
}

interface NewPlaceParams {
  cityId: number;
  mainImageUrl: string;
  title: string;
  opensAt: string;
  closesAt: string;
  avgBill: number;
  address: string;
  description: string;
  paymentMethods: number[];
  imageUrls: string[];
}

type PlacesState = {
  places: Array<Place>;
  noMore: boolean;
  placeImages: Array<string>;
  status: string;
  error: string | undefined;
};

const initialState: PlacesState = {
  places: [],
  noMore: false,
  placeImages: [],
  status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
  error: undefined,
};

const PAGE_SIZE = 20;

export const fetchPlaces = createAsyncThunk(
  "places/fetchPlaces",
  async (searchParams: SearchParams) => {
    const { cityId, titleQuery, sortOrder } = searchParams;
    const response = await axiosInstance.get("/places", {
      params: {
        cityId,
        titleQuery,
        sortOrder,
        pageNumber: 1,
        pageSize: PAGE_SIZE,
      },
    });
    return response.data;
  }
);

export const loadMore = createAsyncThunk(
  "places/loadMore",
  async (searchParams: SearchParams, { getState }) => {
    const { cityId, titleQuery, sortOrder } = searchParams;
    const state: any = getState();
    const pageNumber = Math.ceil(state.places.length / PAGE_SIZE);
    const response = await axiosInstance.get("/places", {
      params: {
        cityId,
        titleQuery,
        sortOrder,
        pageNumber,
        pageSize: PAGE_SIZE,
      },
    });
    return response.data;
  }
);

export const createPlace = createAsyncThunk(
  "places/createPlace",
  async (placeParams: NewPlaceParams) => {
    const response = await axiosInstance.post(
      "/places/manager/createPlace",
      placeParams
    );
    return response.data;
  }
);

export const uploadPlaceImg = createAsyncThunk(
  "places/uploadImage",
  async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axiosInstance.post(
      "/places/manager/uploadImage",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
);

const placesSlice = createSlice({
  name: "places",
  initialState,
  reducers: {
    setPlaceImages(state, action) {
      state.placeImages = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPlaces.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.places = action.payload;

        if (action.payload.length < PAGE_SIZE) state.noMore = true;
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(loadMore.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadMore.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.places = state.places.concat(action.payload);

        if (action.payload.length < PAGE_SIZE) state.noMore = true;
      })
      .addCase(loadMore.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(createPlace.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPlace.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createPlace.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(uploadPlaceImg.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadPlaceImg.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.placeImages.push(serverUrl + action.payload);
      })
      .addCase(uploadPlaceImg.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setPlaceImages } = placesSlice.actions;

export default placesSlice.reducer;

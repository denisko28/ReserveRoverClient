import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios-config";
import { format } from "date-fns";
import { ReservStatus } from "../../components/status-badge/StatusBadge";

export type UserReservation = {
  id: string;
  placeImageUrl: string;
  placeTitle: string;
  placeId: number;
  tableSetId: number;
  userId: string;
  reservDate: string;
  beginTime: string;
  endTime: string;
  peopleNum: number;
  status: number;
  creationDateTime: string;
};

type UserReservationsCount = {
  totalCount: number;
  futureCount: number;
  pastCount: number;
};

export type TableReservation = {
  id: string;
  userId: string;
  userName: string;
  beginTime: string;
  endTime: string;
};

export type TimelineReservation = {
  tableCapacity: number;
  tableReservations: TableReservation[];
};

export type TimeOffer = {
  tableSetId: number;
  offeredStartTime: string;
  offeredEndTime: string;
};

interface TimelineReservationsParams {
  placeId: number;
  targetDate: string;
}

interface UserReservationsParams {
  userId: string;
  fromTime?: string;
  tillTime?: string;
}

interface GetTimeOffersParams {
  placeId: number;
  reservDate: string;
  desiredTime: string;
  duration: number;
  peopleNum: number;
}

interface NewReservationParams {
  tableSetId: number;
  userId: string;
  reservDate: string;
  beginTime: string;
  endTime: string;
  peopleNum: number;
}

type ReservationsState = {
  timeOffers: Array<TimeOffer>;
  reservationsCount: UserReservationsCount | null;
  userReservations: UserReservation[];
  timelineReservations: TimelineReservation[];
  noMore: boolean;
  status: string;
  error: string | undefined;
};

const initialState: ReservationsState = {
  timeOffers: [],
  reservationsCount: null,
  userReservations: [],
  timelineReservations: [],
  noMore: false,
  status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
  error: undefined,
};

const PAGE_SIZE = 10;

export const cancelReserv = createAsyncThunk(
  "reservations/cancelReserv",
  async (reservationId: string) => {
    const response = await axiosInstance.patch("/reservation/updateStatus", {
      reservationId,
      newStatus: ReservStatus.CANCELED,
    });
    response.data = { id: reservationId };
    return response.data;
  }
);

export const fetchTimelineReservs = createAsyncThunk(
  "reservations/fetchTimelineReservs",
  async (timelineReservationsParams: TimelineReservationsParams) => {
    const response = await axiosInstance.get("/reservation/getForTimeline", {
      params: timelineReservationsParams,
    });
    return response.data;
  }
);

export const getUserReservsCount = createAsyncThunk(
  "reservations/getUserReservsCount",
  async (userId: string) => {
    const response = await axiosInstance.get("/reservation/getCountByUser", {
      params: {
        userId,
        dateTime: format(new Date(), "yyyy/MM/dd HH:mm"),
      },
    });
    return response.data;
  }
);

export const fetchUserReservs = createAsyncThunk(
  "reservations/fetchUserReservs",
  async (userReservationsParams: UserReservationsParams) => {
    const { userId, fromTime, tillTime } = userReservationsParams;
    const response = await axiosInstance.get("/reservation/getByUser", {
      params: {
        userId,
        fromTime,
        tillTime,
        pageNumber: 1,
        pageSize: PAGE_SIZE,
      },
    });
    return response.data;
  }
);

export const loadMoreUserReservs = createAsyncThunk(
  "reservations/loadMoreUserReservs",
  async (userReservationsParams: UserReservationsParams, { getState }) => {
    const { userId, fromTime, tillTime } = userReservationsParams;
    const state: any = getState();
    const pageNumber = Math.ceil(state.reservations.length / PAGE_SIZE);
    const response = await axiosInstance.get("/reservation/getByUser", {
      params: {
        userId,
        fromTime,
        tillTime,
        pageNumber,
        pageSize: PAGE_SIZE,
      },
    });
    return response.data;
  }
);

export const getTimeOffers = createAsyncThunk(
  "reservations/getTimeOffers",
  async (timeOffersParams: GetTimeOffersParams) => {
    const response = await axiosInstance.get("/reservation/timeOffers", {
      params: timeOffersParams,
    });
    return response.data;
  }
);

export const addReservation = createAsyncThunk(
  "reservations/addReservation",
  async (reservationParams: NewReservationParams) => {
    debugger;
    const response = await axiosInstance.post(
      "/reservation/create",
      reservationParams
    );
    return response.data;
  }
);

const reservationsSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(cancelReserv.pending, (state) => {
        state.status = "loading";
      })
      .addCase(cancelReserv.fulfilled, (state, action) => {
        state.status = "succeeded";
        var updatedReservation = state.userReservations.find(x => x.id === action.payload.id);
        if(!updatedReservation)
          return;

        updatedReservation.status = ReservStatus.CANCELED;
      })
      .addCase(cancelReserv.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      
      .addCase(fetchTimelineReservs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTimelineReservs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.timelineReservations = action.payload;
      })
      .addCase(fetchTimelineReservs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      
      .addCase(fetchUserReservs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserReservs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userReservations = action.payload;

        if (action.payload.length < PAGE_SIZE) state.noMore = true;
      })
      .addCase(fetchUserReservs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(getUserReservsCount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserReservsCount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reservationsCount = action.payload;
      })
      .addCase(getUserReservsCount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(loadMoreUserReservs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadMoreUserReservs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userReservations = state.userReservations.concat(action.payload);

        if (action.payload.length < PAGE_SIZE) state.noMore = true;
      })
      .addCase(loadMoreUserReservs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(getTimeOffers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTimeOffers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.timeOffers = action.payload.map((offer: TimeOffer) => ({
          tableSetId: offer.tableSetId,
          offeredStartTime: offer.offeredStartTime.slice(0, -3),
          offeredEndTime: offer.offeredEndTime.slice(0, -3),
        }));
      })
      .addCase(getTimeOffers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(addReservation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addReservation.fulfilled, (state, action) => {
        if (action.payload == true) {
          state.status = "succeeded";
          return;
        }
        state.status = "failed";
        state.error = "Резервація не вдалась :(";
      })
      .addCase(addReservation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {} = reservationsSlice.actions;

export default reservationsSlice.reducer;

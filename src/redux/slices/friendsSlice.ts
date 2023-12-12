import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios-config";

export type PublicUser = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
};

export type Friendship = {
  id: string;
  friendId: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
};

type FriendsCount = {
  friendsCount: number;
  requestsCount: number;
};

type FriendsState = {
  friendsCount: FriendsCount | null;
  publicUsers: PublicUser[];
  friendships: Friendship[];
  noMore: boolean;
  status: string;
  error: string | undefined;
};

const initialState: FriendsState = {
  friendsCount: null,
  publicUsers: [],
  friendships: [],
  noMore: false,
  status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
  error: undefined,
};

const PAGE_SIZE = 10;

export const getFriendsCount = createAsyncThunk(
  "friends/getCount",
  async () => {
    const response = await axiosInstance.get("/friends/getCount");
    return response.data;
  }
);

export const fetchFriends = createAsyncThunk(
  "friends/fetchFriends",
  async (searchQuery: string | null) => {
    const response = await axiosInstance.get("/friends", {
      params: {
        searchQuery,
        pageNumber: 1,
        pageSize: PAGE_SIZE,
      },
    });
    return response.data;
  }
);

export const loadMoreFriends = createAsyncThunk(
  "friends/loadMoreFriends",
  async (_, { getState }) => {
    const state: any = getState();
    const pageNumber = Math.ceil(state.reservations.length / PAGE_SIZE);
    const response = await axiosInstance.get("/friends", {
      params: {
        pageNumber,
        pageSize: PAGE_SIZE,
      },
    });
    return response.data;
  }
);

export const fetchFriendRequests = createAsyncThunk(
  "friends/fetchFriendRequests",
  async () => {
    const response = await axiosInstance.get("/friends/requests");
    return response.data;
  }
);

export const searchNewFriends = createAsyncThunk(
  "friends/searchNewFriends",
  async (searchQuery: string | null) => {
    const response = await axiosInstance.get("/friends/searchForNew", {
      params: {
        searchQuery,
        pageNumber: 1,
        pageSize: PAGE_SIZE,
      },
    });
    return response.data;
  }
);

export const loadMoreNewFriends = createAsyncThunk(
  "friends/loadMoreNewFriends",
  async (searchQuery: string | null, { getState }) => {
    const state: any = getState();
    const pageNumber = Math.ceil(state.friends.length / PAGE_SIZE);
    const response = await axiosInstance.get("/friends/searchForNew", {
      params: {
        searchQuery,
        pageNumber,
        pageSize: PAGE_SIZE,
      },
    });
    return response.data;
  }
);

export const addFriend = async (friendId: string) => {
  const response = await axiosInstance.post(
    "/friends/",
    friendId
  );
  return response.data.error ? false : true;
};

export const removeFriend = async (friendshipId: string) => {
  const response = await axiosInstance.delete(
    `/friends/${friendshipId}`
  );
  return response.data.error ? false : true;
};

export const acceptFriend = async (friendshipId: string) => {
  const response = await axiosInstance.put(
    `/friends/accept/${friendshipId}`
  );
  return response.data.error ? false : true;
};

export const refuseFriend = async (friendshipId: string) => {
  return await removeFriend(friendshipId);
};

const reservationsSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getFriendsCount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFriendsCount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.friendsCount = action.payload;
      })
      .addCase(getFriendsCount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchFriends.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.friendships = action.payload;

        if (action.payload.length < PAGE_SIZE) state.noMore = true;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(loadMoreFriends.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadMoreFriends.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.friendships = state.friendships.concat(action.payload);

        if (action.payload.length < PAGE_SIZE) state.noMore = true;
      })
      .addCase(loadMoreFriends.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchFriendRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.friendships = action.payload;
      })
      .addCase(fetchFriendRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      
      .addCase(searchNewFriends.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchNewFriends.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.publicUsers = action.payload;

        if (action.payload.length < PAGE_SIZE) state.noMore = true;
      })
      .addCase(searchNewFriends.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(loadMoreNewFriends.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadMoreNewFriends.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.publicUsers = state.publicUsers.concat(action.payload);

        if (action.payload.length < PAGE_SIZE) state.noMore = true;
      })
      .addCase(loadMoreNewFriends.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {} = reservationsSlice.actions;

export default reservationsSlice.reducer;

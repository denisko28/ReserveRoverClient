import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios-config";

type City = {
  id: number;
  name: string;
}

type ManagerPlaceInfo = {
  id: number;
  moderationStatus: number;
}

export interface UserInfoState {
  role: string | null;
  city: City;
  managerPlaceInfo: ManagerPlaceInfo | null; 
}

const initialState: UserInfoState = { 
  role: null, 
  city: { id: 1, name: "Чернвці" }, 
  managerPlaceInfo: null 
};

export const getManagersPlaceInfo = createAsyncThunk(
  "userInfo/getManagersPlaceId",
  async (uid: string) => {
    const response = await axiosInstance.get(`/places/manager/${uid}`);
    return response.data;
  }
);

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserRole(state, action) {
      state.role = action.payload;
    },
    setUserCity(state, action) {
      state.city = action.payload;
    },
    setManagerPlaceInfo(state, action) {
      state.managerPlaceInfo = action.payload;
    },
    clearUserInfo(state) {
      state.role = null;
      state.managerPlaceInfo = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getManagersPlaceInfo.fulfilled, (state, action) => {
        debugger;
        const { id, moderationStatus } = action.payload;
        state.managerPlaceInfo = { id, moderationStatus };
      })
  }
});

export const { setUserRole, setUserCity, setManagerPlaceInfo, clearUserInfo } =
  userInfoSlice.actions;

export default userInfoSlice.reducer;

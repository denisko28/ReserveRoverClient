import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios-config";

export type TableSet = {
  id: number;
  placeId: number;
  tableCapacity: number;
  tablesNum: number;
};

type TableSetsState = {
  tableSets: Array<TableSet>;
  tableSetIdsToDelete: Array<number>;
  status: string;
  error: string | undefined;
};

const initialState: TableSetsState = {
  tableSets: [],
  tableSetIdsToDelete: [],
  status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
  error: undefined,
}

export const fetchTableSets = createAsyncThunk(
  "tableSets/fetchTableSets",
  async (placeId: number) => {
    const response = await axiosInstance.get("places/manager/placeTableSets", { params: {placeId} });
    return response.data;
  }
);

const tableSetsSlice = createSlice({
  name: "tableSets",
  initialState,
  reducers: {
    addNewTableSet(state, action) {
      state.tableSets.push(action.payload);
    },
    updateTableSet(state, action) {
      const {index, newTableSet} = action.payload;
      state.tableSets[index] = newTableSet;
    },
    deleteTableSet(state, action) {
      const tableSetToDelete = state.tableSets[action.payload as number] as (TableSet | undefined);
      if(tableSetToDelete?.id)
        state.tableSetIdsToDelete.push(tableSetToDelete.id);
      state.tableSets.splice(action.payload, 1);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTableSets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTableSets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tableSets = action.payload;
      })
      .addCase(fetchTableSets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
  },
});

export const {addNewTableSet, updateTableSet, deleteTableSet} = tableSetsSlice.actions;

export default tableSetsSlice.reducer;

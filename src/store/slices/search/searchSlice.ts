import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

interface SearchState {
  lastQuery: string;
}

const initialState: SearchState = {
  lastQuery: "",
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setLastQuery: (state, action: PayloadAction<string>) => {
      state.lastQuery = action.payload;
    },
  },
});

export const { setLastQuery } = searchSlice.actions;

export const selectLastQuery = (state: RootState) => state.search.lastQuery;

export default searchSlice.reducer;

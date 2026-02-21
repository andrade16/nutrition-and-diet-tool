import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface FavoritesState {
  fdcIds: number[];
}

// Initial state
const initialState: FavoritesState = {
  fdcIds: [],
};

// Create the slice
export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    // Add a favorite food item by FDC ID
    addFavorite: (state, action: PayloadAction<number>) => {
      state.fdcIds.push(action.payload);
    },
    // Remove a favorite food item by FDC ID
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.fdcIds = state.fdcIds.filter((id) => id !== action.payload);
    },
    // Clear all favorite food items
    clearFavorites: (state) => {
      state.fdcIds = [];
    },
  },
});

// Export actions
export const { addFavorite, removeFavorite, clearFavorites } =
  favoritesSlice.actions;

// Export selectors
export const selectFavoriteIds = (state: RootState) => state.favorites.fdcIds;

// Export reducer
export default favoritesSlice.reducer;

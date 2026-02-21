import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FoodItem, FavoriteItem } from "@/lib/types/usda";
import type { RootState } from "../store";

interface FavoritesState {
  favoritedFoods: FavoriteItem[];
}

// Initial state
const initialState: FavoritesState = {
  favoritedFoods: [],
};

// Create the slice
export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    // Add a favorite food item by FDC ID
    addFavorite: (state, action: PayloadAction<FavoriteItem>) => {
      state.favoritedFoods.push(action.payload);
    },
    // Remove a favorite food item by FDC ID
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.favoritedFoods = state.favoritedFoods.filter(
        (food) => food.fdcId !== action.payload,
      );
    },
    // Clear all favorite food items
    clearFavorites: (state) => {
      state.favoritedFoods = [];
    },
  },
});

// Export actions
export const { addFavorite, removeFavorite, clearFavorites } =
  favoritesSlice.actions;

// Export selectors
export const selectFavoritedFoods = (state: RootState) =>
  state.favorites.favoritedFoods;

// Export reducer
export default favoritesSlice.reducer;

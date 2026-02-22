import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FavoriteItem } from "@/lib/types/usda";
import type { RootState } from "../../store";

interface FavoritesState {
  favoritedFoods: FavoriteItem[];
  favoritedIngredients: string[];
}

const initialState: FavoritesState = {
  favoritedFoods: [],
  favoritedIngredients: [],
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<FavoriteItem>) => {
      state.favoritedFoods.push(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.favoritedFoods = state.favoritedFoods.filter(
        (food) => food.fdcId !== action.payload,
      );
    },
    clearFavorites: (state) => {
      state.favoritedFoods = [];
    },
    addFavoriteIngredient: (state, action: PayloadAction<string>) => {
      state.favoritedIngredients.push(action.payload);
    },
    removeFavoriteIngredient: (state, action: PayloadAction<string>) => {
      state.favoritedIngredients = state.favoritedIngredients.filter(
        (ingredient) => ingredient !== action.payload,
      );
    },
    clearFavoriteIngredients: (state) => {
      state.favoritedIngredients = [];
    },
    updateFavoriteNote: (
      state,
      action: PayloadAction<{ fdcId: number; note: string }>,
    ) => {
      const { fdcId, note } = action.payload;
      const food = state.favoritedFoods.find((food) => food.fdcId === fdcId);
      if (food) {
        food.note = note;
      }
    },
  },
});

export const {
  addFavorite,
  removeFavorite,
  clearFavorites,
  addFavoriteIngredient,
  removeFavoriteIngredient,
  clearFavoriteIngredients,
  updateFavoriteNote,
} = favoritesSlice.actions;

export const selectFavoritedFoods = (state: RootState) =>
  state.favorites.favoritedFoods;

export const selectFavoriteIngredients = (state: RootState) =>
  state.favorites.favoritedIngredients;

export default favoritesSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Define types for nutrition data
interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: number;
}

interface NutritionState {
  dailyGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: Meal[];
  currentDate: string;
}

// Initial state
const initialState: NutritionState = {
  dailyGoals: {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fats: 65,
  },
  meals: [],
  currentDate: new Date().toISOString().split('T')[0],
};

// Create the slice
export const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    // Set daily nutrition goals
    setDailyGoals: (
      state,
      action: PayloadAction<NutritionState['dailyGoals']>
    ) => {
      state.dailyGoals = action.payload;
    },
    // Add a meal
    addMeal: (state, action: PayloadAction<Omit<Meal, 'id' | 'timestamp'>>) => {
      const newMeal: Meal = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.meals.push(newMeal);
    },
    // Remove a meal
    removeMeal: (state, action: PayloadAction<string>) => {
      state.meals = state.meals.filter((meal) => meal.id !== action.payload);
    },
    // Clear all meals
    clearMeals: (state) => {
      state.meals = [];
    },
    // Set current date
    setCurrentDate: (state, action: PayloadAction<string>) => {
      state.currentDate = action.payload;
    },
  },
});

// Export actions
export const {
  setDailyGoals,
  addMeal,
  removeMeal,
  clearMeals,
  setCurrentDate,
} = nutritionSlice.actions;

// Export selectors
export const selectDailyGoals = (state: RootState) => state.nutrition.dailyGoals;
export const selectMeals = (state: RootState) => state.nutrition.meals;
export const selectCurrentDate = (state: RootState) => state.nutrition.currentDate;

// Selector to calculate total nutrition for the day
export const selectDailyTotals = (state: RootState) => {
  const meals = state.nutrition.meals;
  return meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + meal.calories,
      protein: totals.protein + meal.protein,
      carbs: totals.carbs + meal.carbs,
      fats: totals.fats + meal.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
};

// Export reducer
export default nutritionSlice.reducer;

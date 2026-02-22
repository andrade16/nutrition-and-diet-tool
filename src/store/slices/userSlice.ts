import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define the shape of the user state
interface UserState {
  role: "consumer" | "dietitian" | null;
}

// Define the initial state
const initialState: UserState = {
  role: null,
};

// Create the slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to set user role
    setUserRole: (state, action: PayloadAction<UserState["role"]>) => {
      state.role = action.payload;
    },
  },
});

// Export actions
export const { setUserRole } = userSlice.actions;

// Export selectors
export const selectUser = (state: RootState) => state.user;
export const selectUserRole = (state: RootState) => state.user.role;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;

// Export reducer
export default userSlice.reducer;

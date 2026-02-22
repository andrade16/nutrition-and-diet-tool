import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

interface UserState {
  role: "consumer" | "dietitian" | null;
}

const initialState: UserState = {
  role: null,
};

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
export const selectUserRole = (state: RootState) => state.user.role;

// Export reducer
export default userSlice.reducer;

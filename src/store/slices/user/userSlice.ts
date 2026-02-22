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

export const { setUserRole } = userSlice.actions;

export const selectUserRole = (state: RootState) => state.user.role;

export default userSlice.reducer;

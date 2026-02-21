import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Define the shape of the user state
interface UserState {
  name: string;
  email: string;
  role: 'consumer' | 'dietitian' | null;
  isAuthenticated: boolean;
}

// Define the initial state
const initialState: UserState = {
  name: '',
  email: '',
  role: null,
  isAuthenticated: false,
};

// Create the slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action to set user info
    setUser: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isAuthenticated = true;
    },
    // Action to set user role
    setUserRole: (state, action: PayloadAction<UserState['role']>) => {
      state.role = action.payload;
    },
    // Action to logout
    logout: (state) => {
      state.name = '';
      state.email = '';
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

// Export actions
export const { setUser, setUserRole, logout } = userSlice.actions;

// Export selectors
export const selectUser = (state: RootState) => state.user;
export const selectUserRole = (state: RootState) => state.user.role;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;

// Export reducer
export default userSlice.reducer;

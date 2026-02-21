import { configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userSlice";
import favoritesReducer from "./slices/favoritesSlice";

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["role"], // only persist role, not auth state
};

const favoritesPersistConfig = {
  key: "favorites",
  storage,
};

export const makeStore = () =>
  configureStore({
    reducer: {
      user: persistReducer(userPersistConfig, userReducer),
      favorites: persistReducer(favoritesPersistConfig, favoritesReducer),
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

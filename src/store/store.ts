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
import chatReducer from "./slices/chatSlice";

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["role"], // only persist role, not auth state
};

const favoritesPersistConfig = {
  key: "favorites",
  storage,
};

const chatPersistConfig = {
  key: "chat",
  storage,
};

export const makeStore = () =>
  configureStore({
    reducer: {
      user: persistReducer(userPersistConfig, userReducer),
      favorites: persistReducer(favoritesPersistConfig, favoritesReducer),
      chat: persistReducer(chatPersistConfig, chatReducer),
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

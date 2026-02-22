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
import userReducer from "./slices/user/userSlice";
import favoritesReducer from "./slices/favorites/favoritesSlice";
import chatReducer from "./slices/chat/chatSlice";
import searchReducer from "./slices/search/searchSlice";

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["role"],
};

const favoritesPersistConfig = {
  key: "favorites",
  storage,
};

const chatPersistConfig = {
  key: "chat",
  storage,
};

const searchPersistConfig = {
  key: "search",
  storage,
};

export const makeStore = () =>
  configureStore({
    reducer: {
      user: persistReducer(userPersistConfig, userReducer),
      favorites: persistReducer(favoritesPersistConfig, favoritesReducer),
      chat: persistReducer(chatPersistConfig, chatReducer),
      search: persistReducer(searchPersistConfig, searchReducer),
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

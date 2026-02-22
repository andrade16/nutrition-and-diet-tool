import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import favoritesReducer from "@/store/slices/favorites/favoritesSlice";
import userReducer from "@/store/slices/user/userSlice";
import chatReducer from "@/store/slices/chat/chatSlice";
import searchReducer from "@/store/slices/search/searchSlice";

const rootReducer = combineReducers({
  user: userReducer,
  favorites: favoritesReducer,
  chat: chatReducer,
  search: searchReducer,
});

type TestRootState = ReturnType<typeof rootReducer>;

// Lightweight store for tests — no redux-persist, no localStorage side effects
export function createTestStore(preloadedState?: Partial<TestRootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

type TestStore = ReturnType<typeof createTestStore>;

interface RenderWithStoreOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: Partial<TestRootState>;
  store?: TestStore;
}

export function renderWithStore(
  ui: React.ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    ...renderOptions
  }: RenderWithStoreOptions = {},
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

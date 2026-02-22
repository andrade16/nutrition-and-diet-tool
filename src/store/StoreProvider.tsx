"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { persistStore, Persistor } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { makeStore, AppStore } from "./store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Official Redux Toolkit pattern - refs are used for singleton store creation
  const storeRef = useRef<AppStore | undefined>(undefined);
  const persistorRef = useRef<Persistor | undefined>(undefined);

  if (!storeRef.current) {
    // Create store and persistor during initialization, not render
    const store = makeStore();
    const persistor = persistStore(store);
    storeRef.current = store;
    persistorRef.current = persistor;
  }

  return (
    <Provider store={storeRef.current!}>
      <PersistGate loading={null} persistor={persistorRef.current!}>
        {children}
      </PersistGate>
    </Provider>
  );
}

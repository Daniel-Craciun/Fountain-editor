import { configureStore } from "@reduxjs/toolkit";
import { appDataReducer } from "./appData";
import { appConfigReducer } from "./appConfig";
import { appStateReducer } from "./appState";

// configure the store
export const store = configureStore({
    reducer: {
        appState: appStateReducer,
        appData: appDataReducer,
        appConfig: appConfigReducer
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;
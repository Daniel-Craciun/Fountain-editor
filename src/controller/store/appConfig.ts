import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAppConfig, IStoreState } from "./types";

const initialAppConfig: IAppConfig = {
    msKeyframeStep: 50
}

const appConfigSlice = createSlice({
    name: 'appConfig',

    initialState: initialAppConfig,

    reducers: {
        setMsKeyframeStep: (state, action: PayloadAction<number>) => {
            state.msKeyframeStep = action.payload;
        },
    }
});

// actions
export const {
    setMsKeyframeStep,
} = appConfigSlice.actions;

// getters
export const getMsKeyframeStep = (state: IStoreState) => state.appConfig.msKeyframeStep;

// reducer
export const appConfigReducer = appConfigSlice.reducer;
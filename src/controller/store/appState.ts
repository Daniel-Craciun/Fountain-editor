import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAppState, IStoreState } from "./types";

const initialAppState: IAppState = {

}

const appStateSlice = createSlice({
    name: 'appState',

    initialState: initialAppState,

    reducers: {
        
    }
});

// actions
export const {
    
} = appStateSlice.actions;

// getters

// reducer
export const appStateReducer = appStateSlice.reducer;
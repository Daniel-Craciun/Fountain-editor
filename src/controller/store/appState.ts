import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAppState, IStoreState, TNozzleCopyState } from "./types";
import { NozzleUnit } from "../../model/model";

const initialAppState: IAppState = {
    nozzles: [],
    selectedKeyframeIds: [],
    selectedRowID: 0,
    selectedNozzleIds: [],
    nozzleCopyState: {
        pump: null,
        light: null,
        brightness: null,
    },
    areNozzlesSaved: true
}

const appStateSlice = createSlice({
    name: 'appState',

    initialState: initialAppState,

    reducers: {
        setNozzles: (state, action: PayloadAction<Array<NozzleUnit>>) => {
            state.nozzles = action.payload;
        },

        setSelectedKeyframeIds: (state, action: PayloadAction<Array<string>>) => {
            state.selectedKeyframeIds = action.payload;
        },

        setSelectedRowID: (state, action: PayloadAction<number>) => {
            state.selectedRowID = action.payload;
        },

        setSelectedNozzleIds: (state, action: PayloadAction<Array<number>>) => {
            state.selectedNozzleIds = action.payload;
        },

        setNozzleCopyState: (state, action: PayloadAction<TNozzleCopyState>) => {
            state.nozzleCopyState = action.payload;
        },

        setAreNozzlesSaved: (state, action: PayloadAction<boolean>) => {
            state.areNozzlesSaved = action.payload;
        }
    }
});

// actions
export const {
    setNozzles,
    setSelectedKeyframeIds,
    setSelectedRowID,
    setSelectedNozzleIds,
    setNozzleCopyState,
    setAreNozzlesSaved
} = appStateSlice.actions;

// getters
export const getNozzles = (state: IStoreState) => state.appState.nozzles;
export const getSelectedKeyframeIds = (state: IStoreState) => state.appState.selectedKeyframeIds;
export const getSelectedRowID = (state: IStoreState) => state.appState.selectedRowID;
export const getSelectedNozzleIds = (state: IStoreState) => state.appState.selectedNozzleIds;
export const getNozzleCopyState = (state: IStoreState) => state.appState.nozzleCopyState;
export const getAreNozzlesSaved = (state: IStoreState) => state.appState.areNozzlesSaved;

// reducer
export const appStateReducer = appStateSlice.reducer;
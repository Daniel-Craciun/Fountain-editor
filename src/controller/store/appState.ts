import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAppState, IStoreState, TNozzleCopyState } from "./types";
import { NozzleUnit } from "../../model/model";

const initialAppState: IAppState = {
    nozzles: [
        new NozzleUnit("fountain_nozzle_unit_8adbe8", "Y5"),
        new NozzleUnit("fountain_nozzle_unit_8d26dc", "Y4"),
        new NozzleUnit("fountain_nozzle_unit_8b5748", "Y3"),
        new NozzleUnit("fountain_nozzle_unit_8c5570", "Y2"),
        new NozzleUnit("fountain_nozzle_unit_8ad0c0", "Y1"),
        new NozzleUnit("fountain_nozzle_unit_8b4dcc", "S1"),
        new NozzleUnit("fountain_nozzle_unit_8b4ce8", "S2"),
        new NozzleUnit("fountain_nozzle_unit_8d0300", "S3"),
        new NozzleUnit("fountain_nozzle_unit_8cfc9c", "S4"),
        new NozzleUnit("fountain_nozzle_unit_8aedd8", "S5")
    ],
    selectedKeyframeIds: [],
    selectedRowID: 0,
    selectedNozzleIds: [],
    nozzleCopyState: {
        pump: null,
        light: null,
        brightness: null,
    }
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
        }
    }
});

// actions
export const {
    setNozzles,
    setSelectedKeyframeIds,
    setSelectedRowID,
    setSelectedNozzleIds,
    setNozzleCopyState
} = appStateSlice.actions;

// getters
export const getNozzles = (state: IStoreState) => state.appState.nozzles;
export const getSelectedKeyframeIds = (state: IStoreState) => state.appState.selectedKeyframeIds;
export const getSelectedRowID = (state: IStoreState) => state.appState.selectedRowID;
export const getSelectedNozzleIds = (state: IStoreState) => state.appState.selectedNozzleIds;
export const getNozzleCopyState = (state: IStoreState) => state.appState.nozzleCopyState;

// reducer
export const appStateReducer = appStateSlice.reducer;
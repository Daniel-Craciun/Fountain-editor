import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAppState, IStoreState } from "./types";
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
    ]
}

const appStateSlice = createSlice({
    name: 'appState',

    initialState: initialAppState,

    reducers: {
        setNozzles: (state, action: PayloadAction<Array<NozzleUnit>>) => {
            state.nozzles = action.payload;
        }
    }
});

// actions
export const {
    setNozzles
} = appStateSlice.actions;

// getters
export const getNozzles = (state: IStoreState) => state.appState.nozzles;

// reducer
export const appStateReducer = appStateSlice.reducer;
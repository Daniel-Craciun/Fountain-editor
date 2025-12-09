import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAppData, IStoreState } from "./types";
import TimelineController from "../TimelineController/TimelineController";

const initialAppData: IAppData = {
    timelineController: null,
}

const appDataSlice = createSlice({
    name: 'appData',

    initialState: initialAppData,

    reducers: {
        setTimelineController: (state, action: PayloadAction<TimelineController>) => {
            state.timelineController = action.payload;
        }
    }
});

// actions
export const {
    setTimelineController,
} = appDataSlice.actions;

// getters
export const getTimelineController = (state: IStoreState) => state.appData.timelineController;

// reducer
export const appDataReducer = appDataSlice.reducer;
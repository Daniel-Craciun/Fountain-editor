import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAppData, IStoreState } from "./types";
import TimelineController from "../TimelineController/TimelineController";
import { TimelineModel } from "animation-timeline-js";

const initialAppData: IAppData = {
    timelineController: null,
    timelineModel: null
}

const appDataSlice = createSlice({
    name: 'appData',

    initialState: initialAppData,

    reducers: {
        setTimelineController: (state, action: PayloadAction<TimelineController>) => {
            state.timelineController = action.payload;
        },

        setTimelineModel: (state, action: PayloadAction<TimelineModel>) => {
            state.timelineModel = action.payload;
        }
    }
});

// actions
export const {
    setTimelineController,
    setTimelineModel
} = appDataSlice.actions;

// getters
export const getTimelineController = (state: IStoreState) => state.appData.timelineController;
export const getTimelineModel      = (state: IStoreState) => state.appData.timelineModel;

// reducer
export const appDataReducer = appDataSlice.reducer;
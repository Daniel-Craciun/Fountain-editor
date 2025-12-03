import { TimelineKeyframe, TimelineModel, TimelineRow } from "animation-timeline-js";

export interface ExtTimelineKeyframe<T> extends TimelineKeyframe {
    frameValue?: T;
    frameId?: string;
}

export interface ExtTimelineRow<T> extends TimelineRow {
    keyframes?: Array<ExtTimelineKeyframe<T>>;
    id?: number;
    rowId?: number;
}

export interface ExtTimelineModel<T> extends TimelineModel {
    rows: Array<ExtTimelineRow<T>>;
}

export interface KeyframeLocation {
    rowNumber: number;
    frameNumber: number;
}
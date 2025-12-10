import { TimelineKeyframe, TimelineModel, TimelineRow } from "animation-timeline-js";
import { Frame } from "../../model/model";

export interface ExtTimelineKeyframe extends TimelineKeyframe {
    frameValue?: Frame;
    frameId?: string;
    rowId?: number;
    transition?: boolean;
}

export interface ExtTimelineRow extends TimelineRow {
    keyframes?: Array<ExtTimelineKeyframe>;
    id?: number;
}

export interface ExtTimelineModel extends TimelineModel {
    rows: Array<ExtTimelineRow>;
}

export interface KeyframeLocation {
    rowNumber: number;
    frameNumber: number;
}

export interface TPrevNextKeyframes {
    prev: Array<ExtTimelineKeyframe | null>;
    next: Array<ExtTimelineKeyframe | null>;
}
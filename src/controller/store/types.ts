import { TimelineModel } from "animation-timeline-js";
import TimelineController from "../TimelineController/TimelineController";

export interface IAppConfig {
    msKeyframeStep: number;
};

export interface IAppData {
    timelineController: TimelineController | null;
    timelineModel: TimelineModel | null;
};

export interface IAppState {
    
};

export interface IStoreState {
    appState: IAppState;
    appData: IAppData;
    appConfig: IAppConfig;
};
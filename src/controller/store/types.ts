import { TimelineModel } from "animation-timeline-js";
import TimelineController from "../TimelineController/TimelineController";
import { NozzleUnit } from "../../model/model";

export interface IAppConfig {
    msKeyframeStep: number;
};

export interface IAppData {
    timelineController: TimelineController | null;
    timelineModel: TimelineModel | null;
};

export interface IAppState {
    nozzles: Array<NozzleUnit>;
    selectedKeyframeIds: Array<string>;
    selectedRowID: number;
};

export interface IStoreState {
    appState: IAppState;
    appData: IAppData;
    appConfig: IAppConfig;
};

export interface NozzleUpdateBody {
    pumpHeight: number;
    hexColor: string;
}
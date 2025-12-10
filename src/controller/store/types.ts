import TimelineController from "../TimelineController/TimelineController";
import { NozzleUnit } from "../../model/model";

export interface TNozzleCopyState {
    pump: number | null;
    light: Array<number> | null;
    brightness: number | null;
}

export interface IAppConfig {
    msKeyframeStep: number;
};

export interface IAppData {
    timelineController: TimelineController | null;
};

export interface IAppState {
    nozzles: Array<NozzleUnit>;
    selectedKeyframeIds: Array<string>;
    selectedRowID: number;
    selectedNozzleIds: Array<number>;
    nozzleCopyState: TNozzleCopyState;
    areNozzlesSaved: boolean;
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
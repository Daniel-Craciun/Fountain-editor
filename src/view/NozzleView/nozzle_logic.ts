import { dispatchCustomEvent, TNozzleSelect } from "../../controller/events";
import { store } from "../../controller/store";
import { setNozzleCopyState } from "../../controller/store/appState";
import { TNozzleCopyState } from "../../controller/store/types";

export function selectNozzle(id: number, select: boolean, ctrlKey: boolean) {
    const selectObject: TNozzleSelect = {
        nozzleID: id, 
        shouldSelect: select, 
        overrideSelected: true
    }

    if (ctrlKey) {
        selectObject.overrideSelected = false;
    }

    dispatchCustomEvent('selectNozzle', selectObject);
}

export function copyPumpValue(pump: number) {
    const copyState: TNozzleCopyState = {
        pump: pump,
        light: null,
        brightness: null
    };

    store.dispatch(setNozzleCopyState(copyState));
}

export function copyLightValue(rgb: Array<number>, brightness: number) {
    const copyState: TNozzleCopyState = {
        pump: null,
        light: rgb,
        brightness: brightness
    };

    store.dispatch(setNozzleCopyState(copyState));
}

export function copyPumpAndLight(pump: number, rgb: Array<number>, brightness: number) {
    const copyState: TNozzleCopyState = {
        pump: pump,
        light: rgb,
        brightness: brightness
    };

    store.dispatch(setNozzleCopyState(copyState));
}
import { store } from ".";
import { NozzleUnit } from "../../model/model";

type NozzleUnitKey = keyof NozzleUnit;

export default class StoreController {
    static updateNozzleParameter<T extends NozzleUnitKey>(paramName: T, paramValue: NozzleUnit[T], nozzleIdx: number): void {
        store.getState().appState.nozzles[nozzleIdx][paramName] = paramValue;
    }
}
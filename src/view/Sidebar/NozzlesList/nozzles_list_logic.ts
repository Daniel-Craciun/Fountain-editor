import { store } from "../../../controller/store";
import { setNozzles } from "../../../controller/store/appState";
import { NozzleUnit } from "../../../model/model";

type NozzleUnitKey = keyof NozzleUnit;

/**
 * The function `updateNozzleParameter` updates a specific parameter of a nozzle unit at a given index
 * in the state.
 * @param {T} paramName - The `paramName` parameter is a generic type `T` that extends the
 * `NozzleUnitKey` type. It represents the key of a specific parameter in the `NozzleUnit` type.
 * @param paramValue - The `paramValue` in the `updateNozzleParameter` function refers to the new value
 * that you want to set for a specific parameter of a nozzle unit. This value should be of the type
 * specified for the parameter name `paramName`.
 * @param {number} nozzleIdx - The `nozzleIdx` parameter in the `updateNozzleParameter` function
 * represents the index of the nozzle within the `nozzles` array that you want to update with the new
 * parameter value.
 */
export function updateNozzleParameter<T extends NozzleUnitKey>(paramName: T, paramValue: NozzleUnit[T], nozzleIdx: number): void {
    const { nozzles } = store.getState().appState;
    const newNozzles = nozzles.concat();

    newNozzles[nozzleIdx][paramName] = paramValue;

    store.dispatch(setNozzles(newNozzles));
}


export function createNewNozzle() {
    const { nozzles } = store.getState().appState;
    const newNozzle = new NozzleUnit("fountain_nozzle_unit_<mac>", `Nozzle-${nozzles.length+1}`);
    const newNozzles = nozzles.concat([newNozzle]);
    store.dispatch(setNozzles(newNozzles));
}


export function deleteNozzle(nozzleIdx: number) {
    const { nozzles } = store.getState().appState;
    
    const filteredNozzles = nozzles.filter((_, idx) => idx != nozzleIdx);

    store.dispatch(setNozzles(filteredNozzles));
}
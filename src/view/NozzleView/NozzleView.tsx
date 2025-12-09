import { useSelector } from "react-redux";
import { NozzleRow, NozzleViewContainer } from "./nozzle_components";
import NozzleUnitCard from "./NozzleUnitCard";
import { getNozzleCopyState, getNozzles, getSelectedNozzleIds, getSelectedRowID } from "../../controller/store/appState";
import { useMemo } from "react";
import { dispatchCustomEvent } from "../../controller/events";

export default function NozzleView() {
    const nozzles = useSelector(getNozzles);
    const selectedRowID = useSelector(getSelectedRowID);
    const selectedNozzleIds = useSelector(getSelectedNozzleIds);
    const nozzleCopyState = useSelector(getNozzleCopyState);
    
    const disablePaste = useMemo(() => {
        return nozzleCopyState.pump === null && 
               nozzleCopyState.light === null && 
               nozzleCopyState.brightness === null
    }, [nozzleCopyState]);

    return (
        <NozzleViewContainer 
            onClick={(e) => {
                if (e.ctrlKey) return;
                dispatchCustomEvent('selectNozzle', { nozzleID: -1, shouldSelect: false, overrideSelected: true });
            }}
        >
            <NozzleRow>
                {nozzles.map((nozzle, idx) => (
                    <NozzleUnitCard 
                        nozzle={nozzle} 
                        nozzleIndex={idx} 
                        key={Math.random()} 
                        disablePump={selectedRowID === 1}
                        disableLight={selectedRowID === 0}
                        disablePaste={disablePaste}
                        selected={selectedNozzleIds.includes(nozzle.id)}
                    />
                ))}
            </NozzleRow>
        </NozzleViewContainer>
    )
}
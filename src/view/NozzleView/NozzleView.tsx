import { useSelector } from "react-redux";
import { NozzleRow, NozzlesSavedContainer, NozzlesUnsavedName, NozzleViewContainer, TrackName, TrackNameContainer } from "./nozzle_components";
import NozzleUnitCard from "./NozzleUnitCard";
import { getAreNozzlesSaved, getNozzleCopyState, getNozzles, getSelectedNozzleIds, getSelectedRowID } from "../../controller/store/appState";
import { useMemo } from "react";
import { dispatchCustomEvent } from "../../controller/events";

export default function NozzleView() {
    const nozzles = useSelector(getNozzles);
    const selectedRowID = useSelector(getSelectedRowID);
    const selectedNozzleIds = useSelector(getSelectedNozzleIds);
    const nozzleCopyState = useSelector(getNozzleCopyState);
    const areNozzlesSaved = useSelector(getAreNozzlesSaved);
    
    const disablePaste = useMemo(() => {
        return nozzleCopyState.pump === null && 
               nozzleCopyState.light === null && 
               nozzleCopyState.brightness === null
    }, [nozzleCopyState]);

    const trackName = useMemo(() => {
        if (selectedRowID === 0) return "Pump";
        return "Light";
    }, [selectedRowID]);

    return (
        <NozzleViewContainer 
            onClick={(e) => {
                if (e.ctrlKey) return;
                dispatchCustomEvent('selectNozzle', { nozzleID: -1, shouldSelect: false, overrideSelected: true });
            }}
        >
            <TrackNameContainer>
                <TrackName ispump={trackName === "Pump"}>{trackName.toUpperCase()}</TrackName>
            </TrackNameContainer>

            {/* Only render if nozzles are not saved */}
            <NozzlesSavedContainer>
                {!areNozzlesSaved &&
                    <NozzlesUnsavedName>UNSAVED</NozzlesUnsavedName>
                }
            </NozzlesSavedContainer>

            <NozzleRow>
                {nozzles.map((nozzle, idx) => (
                    <NozzleUnitCard 
                        nozzle={nozzle} 
                        nozzleIndex={idx} 
                        key={nozzle.id} 
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
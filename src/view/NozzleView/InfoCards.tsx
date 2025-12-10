import { useSelector } from "react-redux";
import { NozzlesSavedContainer, NozzlesUnsavedName, TrackName, TrackNameContainer } from "./nozzle_components";
import { getAreNozzlesSaved, getSelectedRowID } from "../../controller/store/appState";
import { useMemo } from "react";

export default function InfoCards() {
    const selectedRowID = useSelector(getSelectedRowID);
    const areNozzlesSaved = useSelector(getAreNozzlesSaved);

    const trackName = useMemo(() => {
        if (selectedRowID === 0) return "Pump";
        return "Light";
    }, [selectedRowID]);

    const saveStatus = useMemo(() => {
        return !areNozzlesSaved ? "UNSAVED" : "";
    }, [areNozzlesSaved]);

    return (
        <>
            <TrackNameContainer>
                <TrackName ispump={trackName === "Pump"}>{trackName.toUpperCase()}</TrackName>
            </TrackNameContainer>

            {/* Only render if nozzles are not saved */}
            <NozzlesSavedContainer>
                <NozzlesUnsavedName>{saveStatus}</NozzlesUnsavedName>
            </NozzlesSavedContainer>
        </>
    )
}
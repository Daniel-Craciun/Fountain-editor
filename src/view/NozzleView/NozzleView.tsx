import { useSelector } from "react-redux";
import { NozzleRow, NozzleViewContainer } from "./nozzle_components";
import NozzleUnitCard from "./NozzleUnitCard";
import { getNozzles, getSelectedRowID } from "../../controller/store/appState";

export default function NozzleView() {
    const nozzles = useSelector(getNozzles);
    const selectedRowID = useSelector(getSelectedRowID);

    return (
        <NozzleViewContainer>
            <NozzleRow>
                {nozzles.map((nozzle, idx) => (
                    <NozzleUnitCard 
                        nozzle={nozzle} 
                        nozzleIndex={idx} 
                        key={Math.random()} 
                        disablePump={selectedRowID === 1}
                        disableLight={selectedRowID === 0}
                    />
                ))}
            </NozzleRow>
        </NozzleViewContainer>
    )
}
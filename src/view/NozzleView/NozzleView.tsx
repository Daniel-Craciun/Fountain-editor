import { useSelector } from "react-redux";
import { NozzleRow, NozzleViewContainer } from "./nozzle_components";
import NozzleUnitCard from "./NozzleUnitCard";
import { getNozzles } from "../../controller/store/appState";

export default function NozzleView() {
    const nozzles = useSelector(getNozzles);

    return (
        <NozzleViewContainer>
            <NozzleRow>
                {nozzles.map((nozzle, idx) => (
                    <NozzleUnitCard nozzle={nozzle} key={idx} />
                ))}
            </NozzleRow>
        </NozzleViewContainer>
    )
}
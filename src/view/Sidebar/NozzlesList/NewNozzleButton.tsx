import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NewButton, NewNozzleContainer } from "./nozzle_components";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { createNewNozzle } from "./nozzles_list_logic";

export default function NewNozzleButton() {
    return (
        <NewNozzleContainer>
            <NewButton onClick={() => createNewNozzle()}>
                <FontAwesomeIcon icon={faCirclePlus} size="2x" />
            </NewButton>
        </NewNozzleContainer>
    )
}
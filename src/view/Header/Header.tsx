import { HeaderContainer, IconButton } from "./header_components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { dispatchCustomEvent } from "../../controller/events";

export default function Header() {
    return (
        <HeaderContainer>
            <div>
                <IconButton onClick={() => dispatchCustomEvent('playShow')}>
                    <FontAwesomeIcon icon={faPlay} color="white" />
                </IconButton>

                <IconButton onClick={() => dispatchCustomEvent('pauseShow')}>
                    <FontAwesomeIcon icon={faPause} color="white" />
                </IconButton>
            </div>
        </HeaderContainer>
    )
}
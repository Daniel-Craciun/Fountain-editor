import { Button } from "@mui/material";
import { ControlButtonGroup, ControlsCard, ControlsTitle, MainContainer } from "./track_components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { getSelectedKeyframeIds } from "../../../../controller/store/appState";
import { dispatchCustomEvent } from "../../../../controller/events";
import { createToast } from "../../../toast";

export default function TrackControls() {
    const selectedKeyframeIds = useSelector(getSelectedKeyframeIds);

    return (
        <MainContainer>
            <ControlsCard>
                <ControlsTitle>Track Controls</ControlsTitle>

                <ControlButtonGroup>
                    <Button
                        sx={{
                            textTransform: "none",
                            color: "white",
                            backgroundColor: 'grey',
                            padding: '7px',
                            fontSize: "0.8rem",
                            borderRadius: "50px"
                        }}
                        size="small"
                        onClick={() => dispatchCustomEvent('selectPrevRow')}
                    >
                        <FontAwesomeIcon icon={faArrowUp} />
                    </Button>

                    <Button
                        sx={{
                            textTransform: "none",
                            color: "white",
                            backgroundColor: 'grey',
                            padding: '7px',
                            fontSize: "0.8rem",
                            borderRadius: "50px"
                        }}
                        size="small"
                        onClick={() => dispatchCustomEvent('selectNextRow')}
                    >
                        <FontAwesomeIcon icon={faArrowDown} />
                    </Button>
                </ControlButtonGroup>
            </ControlsCard>
        </MainContainer>
    )
}
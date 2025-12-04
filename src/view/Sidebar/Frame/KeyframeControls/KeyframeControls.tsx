import { Button } from "@mui/material";
import { ControlButtonGroup, ControlsCard, ControlsTitle, MainContainer } from "./keyframe_components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { getSelectedKeyframeIds } from "../../../../controller/store/appState";
import { dispatchCustomEvent } from "../../../../controller/events";

export default function KeyframeControls() {
    const selectedKeyframeIds = useSelector(getSelectedKeyframeIds);

    return (
        <MainContainer>
            <ControlsCard>
                <ControlsTitle>Keyframe Controls</ControlsTitle>

                <ControlButtonGroup>
                    <Button
                        sx={{
                            textTransform: "none",
                            color: "white",
                            backgroundColor: 'rgba(2, 146, 9, 1)',
                            padding: '5px',
                            fontSize: "0.8rem",
                            borderRadius: "50px"
                        }}
                        size="small"
                        onClick={() => dispatchCustomEvent('saveCurrentKeyframe')}
                    >
                        <FontAwesomeIcon icon={faFloppyDisk} />
                    </Button>

                    <Button
                        sx={{
                            textTransform: "none",
                            color: "white",
                            backgroundColor: 'red',
                            padding: '5px',
                            fontSize: "0.8rem",
                            borderRadius: "50px",
                            "&:disabled": {
                                color: "rgb(200,200,200)"
                            }
                        }}
                        size="small"
                        disabled={selectedKeyframeIds.length === 0}
                        onClick={() => dispatchCustomEvent('deleteSelectedKeyframes')}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                </ControlButtonGroup>
            </ControlsCard>
        </MainContainer>
    )
}
import { Button } from "@mui/material";
import { ControlButtonGroup, ControlsCard, ControlsTitle, MainContainer } from "./keyframe_components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
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
                            backgroundColor: 'rgb(100,100,100)',
                            padding: '5px',
                            fontSize: "0.8rem",
                            borderRadius: "50px"
                        }}
                        size="small"
                        onClick={() => dispatchCustomEvent('createKeyframeAtCurrTime')}
                    >
                        <FontAwesomeIcon icon={faPlus} />
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
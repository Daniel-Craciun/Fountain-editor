import { HeaderContainer, IconButton } from "./header_components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBackwardFast, faBackwardStep, faForwardFast, faForwardStep, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { dispatchCustomEvent } from "../../controller/events";
import { useEffect, useState } from "react";
import { createToast } from "../toast";

export default function Header() {
    const [isPlaying, setIsPlaying] = useState(false);

    function keyboardEvents(e: KeyboardEvent) {
		// ignore any inputs into a text field
		// @ts-ignore
		if (e.target?.type === "text") return;

		if (e.key === "k") {
			e.preventDefault();

			dispatchCustomEvent('saveCurrentKeyframe', e.ctrlKey || e.metaKey);
			createToast("Keyframe saved.", 'success', 1000);
		}
        else if (e.key === "a") {
            dispatchCustomEvent('selectAllNozzles');
        }
		else if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
			dispatchCustomEvent('copySelectedKeyframes');
			createToast("Keyframe(s) copied.", 'success', 1000);
		}
		else if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
			dispatchCustomEvent('pasteCopiedKeyframes');
		}
		else if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault();
			dispatchCustomEvent('deleteSelectedKeyframes');
		}
		else if (e.key === "ArrowLeft") {
			e.preventDefault();
			dispatchCustomEvent('fineBackwardShow');
		}
		else if (e.key === "ArrowRight") {
			e.preventDefault();
			dispatchCustomEvent('fineForwardShow');
		}
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            dispatchCustomEvent('selectPrevRow');
        }
        else if (e.key === "ArrowDown") {
            e.preventDefault();
            dispatchCustomEvent('selectNextRow');
        }
        else if (e.code === "Space") {
            e.preventDefault();
            setIsPlaying((prev) => {
                if (prev) {
                    dispatchCustomEvent("pauseShow");
                }
                else {
                    dispatchCustomEvent('playShow');
                }

                return !prev;
            });
        }
	}

	useEffect(() => {
		window.addEventListener('keydown', keyboardEvents);

		return () => { window.removeEventListener('keydown', keyboardEvents) }
	}, []);
    return (
        <HeaderContainer>
            <div>
                <IconButton onClick={() => dispatchCustomEvent('fastBackwardShow')}>
                    <FontAwesomeIcon icon={faBackwardFast} color="white" />
                </IconButton>

                <IconButton onClick={() => dispatchCustomEvent('stepBackwardShow')}>
                    <FontAwesomeIcon icon={faBackwardStep} color="white" />
                </IconButton>

                <IconButton 
                    onClick={() => {
                        if (isPlaying) {
                            dispatchCustomEvent("pauseShow");
                            setIsPlaying(false);
                        }
                        else {
                            dispatchCustomEvent('playShow');
                            setIsPlaying(true);
                        }
                    }}
                >
                    <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} color="white" />
                </IconButton>

                <IconButton onClick={() => dispatchCustomEvent('stepForwardShow')}>
                    <FontAwesomeIcon icon={faForwardStep} color="white" />
                </IconButton>

                <IconButton onClick={() => dispatchCustomEvent('fastForwardShow')}>
                    <FontAwesomeIcon icon={faForwardFast} color="white" />
                </IconButton>
            </div>
        </HeaderContainer>
    )
}
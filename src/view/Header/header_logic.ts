import { dispatchCustomEvent } from "../../controller/events";
import { createToast } from "../toast";

export function keyboardEvents(e: KeyboardEvent, setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>) {
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
    else if (e.key === "t") {
        e.preventDefault();
        dispatchCustomEvent('invertSelKeyframesTrans');
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

export function loadProjectFile() {
    const fileInput = document.createElement('input');
    fileInput.type = "file";
    fileInput.accept = ".yaml,.yml"

    fileInput.addEventListener('change', (e) => {
        // @ts-ignore
        const file = e.target!.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                dispatchCustomEvent('loadProject', e.target!.result as string);
            };
            reader.readAsText(file);
        }
    });

    fileInput.click();
    fileInput.remove();
}
import { HeaderContainer, IconButton, ProjectButtonContainer, StyledTextField } from "./header_components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBackwardFast, faBackwardStep, faForwardFast, faForwardStep, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { dispatchCustomEvent } from "../../controller/events";
import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { keyboardEvents, loadProjectFile } from "./header_logic";
import { createToast } from "../toast";

export default function Header() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [projectName, setProjectName] = useState("");

	useEffect(() => {
		window.addEventListener('keydown', (e) => keyboardEvents(e, setIsPlaying));

		return () => { window.removeEventListener('keydown', (e) => keyboardEvents(e, setIsPlaying)) }
	}, []);
    
    return (
        <HeaderContainer>
            <ProjectButtonContainer>
                <Button
                    sx={{
                        textTransform: "none",
                        color: "white",
                        backgroundColor: 'rgb(80,80,80)',
                        padding: '4px',
                        fontSize: "0.8rem",
                        borderRadius: "5px",
                        "&:hover": {
                            backgroundColor: 'rgb(100,100,100)'
                        }
                    }}
                    onClick={() => loadProjectFile()}
                >
                    Load
                </Button>
            </ProjectButtonContainer>


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


            <ProjectButtonContainer>
                <Button
                    sx={{
                        textTransform: "none",
                        color: "white",
                        backgroundColor: 'rgb(80,80,80)',
                        padding: '4px',
                        fontSize: "0.8rem",
                        borderRadius: "5px",
                        "&:hover": {
                            backgroundColor: 'rgb(100,100,100)'
                        }
                    }}
                    onClick={() => setOpenDialog(true)}
                >
                    Save
                </Button>
            </ProjectButtonContainer>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                slotProps={{
                    paper: {
                        sx: {
                            backgroundColor: "rgb(50,50,50)"
                        }
                    }
                }}
            >
                <DialogTitle sx={{ color: "white", padding: '12px 12px' }}>Export Project</DialogTitle>

                <DialogContent sx={{ padding: '10px 20px' }}>
                    <StyledTextField
                        size="small" 
                        margin="normal" 
                        variant="outlined" 
                        placeholder="Project name"
                        value={projectName}
                        onChange={(e) => {
                            setProjectName(e.target.value);
                        }}
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        sx={{
                            textTransform: "none",
                            color: "white",
                            padding: '4px',
                            fontSize: "1rem",
                            borderRadius: "5px",
                            "&:hover": {
                                backgroundColor: 'rgb(70,70,70)'
                            }
                        }}
                        onClick={() => {
                            dispatchCustomEvent('exportProject', { name: projectName, copyToClipboard: true });
                            setOpenDialog(false);
                            createToast('Copied project to clipboard!', 'success', 2000);
                        }}
                    >
                        Copy to clipboard
                    </Button>

                    <Button
                        sx={{
                            textTransform: "none",
                            color: "white",
                            padding: '4px',
                            fontSize: "1rem",
                            borderRadius: "5px",
                            "&:hover": {
                                backgroundColor: 'rgb(70,70,70)'
                            }
                        }}
                        onClick={() => {
                            dispatchCustomEvent('exportProject', { name: projectName, copyToClipboard: false });
                            setOpenDialog(false);
                        }}
                    >
                        Export
                    </Button>
                </DialogActions>
            </Dialog>
        </HeaderContainer>
    )
}
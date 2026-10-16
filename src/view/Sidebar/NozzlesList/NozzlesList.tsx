import { useSelector } from "react-redux"
import { getNozzles } from "../../../controller/store/appState"
import { NozzleMainContainer, StyledTextField, TextFieldList } from "./nozzle_components";
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteNozzle, updateNozzleParameter } from "./nozzles_list_logic";
import { useState } from "react";
import NewNozzleButton from "./NewNozzleButton";

export default function NozzlesList() {
    const nozzles = useSelector(getNozzles);
    const [_, reload] = useState(false);

    return (
        <NozzleMainContainer>
            {nozzles.map((nozzle, idx) => (
                <Accordion 
                    sx={{ 
                        backgroundColor: "rgb(60,60,60)", 
                        fontSize: "1rem", 
                        margin: "0",
                    }} 
                    key={nozzle.haName + idx}
                >
                    <AccordionSummary 
                        expandIcon={<FontAwesomeIcon icon={faAngleDown} color="white" />} 
                        sx={{ borderBottom: '1px solid grey', }}
                    >
                        <Typography component={"span"} color="white" fontSize="0.8rem" sx={{ margin: "0" }}>{nozzle.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TextFieldList>
                            <StyledTextField 
                                size="small" 
                                margin="normal" 
                                label="Name" 
                                variant="outlined" 
                                defaultValue={nozzle.name} 
                                onBlur={(e) => {
                                    updateNozzleParameter('name', e.target.value, idx);
                                }}
                            />

                            <StyledTextField 
                                size="small" 
                                margin="normal" 
                                label="Output ID" 
                                variant="outlined" 
                                defaultValue={nozzle.haName} 
                                onBlur={(e) => {
                                    updateNozzleParameter('haName', e.target.value, idx);
                                }}
                            />

                            <StyledTextField 
                                size="small" 
                                margin="normal" 
                                label="Calibration" 
                                variant="outlined" 
                                defaultValue={nozzle.calibration} 
                                type="number"

                                onBlur={(e) => {
                                    if (e.target.value.length === 0) {
                                        updateNozzleParameter('calibration', 0, idx);
                                    }
                                    else {
                                        updateNozzleParameter('calibration', parseInt(e.target.value), idx);
                                    }
                                }}
                            />
                            
                            <Button 
                                sx={{ 
                                    backgroundColor: 'red', 
                                    width: '20px', 
                                    padding: '5px', 
                                    borderRadius: '50px', 
                                    marginTop: '5px' 
                                }}

                                onDoubleClick={() => deleteNozzle(idx)}
                            >
                                <FontAwesomeIcon icon={faTrash} color="white" />
                            </Button>
                        </TextFieldList>
                    </AccordionDetails>
                </Accordion>
            ))}

            <br />
            
            <NewNozzleButton />
        </NozzleMainContainer>
    )
}
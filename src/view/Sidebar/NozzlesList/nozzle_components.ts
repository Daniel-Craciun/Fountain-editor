import { Button, TextField } from "@mui/material";
import styled from "styled-components";

export const NozzleMainContainer = styled.div`
    padding: 5px;
    overflow-y: auto;
    height: 90%;
`;

export const TextFieldList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const StyledTextField = styled(TextField)`
    & label {
        color: white !important;
    }

    & input {
        color: white !important;
        font-size: 0.8rem !important;
    }

    & .MuiOutlinedInput-root {
        & fieldset {
            border-color: grey
        }
            
        &:hover fieldset {
            border-color: white
        }

        &.Mui-focused fieldset {
            border-color: white
        }
    }
`;

export const NewNozzleContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

export const NewButton = styled(Button)`
    border: 2px dashed grey !important;
    border-radius: 10px !important;
    padding: 5px;
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: inherit;

    &:hover {
        cursor: pointer;
    }
`;
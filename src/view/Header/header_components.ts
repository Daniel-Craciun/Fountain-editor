import { TextField } from "@mui/material";
import styled from "styled-components";

export const HeaderContainer = styled.div`
    width: 85%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgb(48,48,48);
    border-bottom: 1px solid grey;
    height: 5%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const IconButton = styled.button`
    transition: 0.1s;
    border-radius: 3px;
    font-size: 1.5rem;
    padding: 5px;
    border: none;
    background-color: rgb(80,80,80);
    margin-left: 5px;
    margin-right: 5px;

    &:hover {
        cursor: pointer;
        background-color: rgb(100,100,100);
    }
`;

export const ProjectButtonContainer = styled.div`
    margin-left: 10px;
    margin-right: 10px;
    display: flex;
    align-items: center;
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
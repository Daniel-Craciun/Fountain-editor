import styled from "styled-components";

export const MainContainer = styled.div`
    display: flex;
    justify-content: center;
`;

export const ControlsCard = styled.div`
    background-color: rgb(60,60,60);
    border: 1px solid grey;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
    width: 90%;
    margin-top: 5px;
`;

export const ControlsTitle = styled.span`
    color: white;
    font-size: 1rem;
`;

export const ControlButtonGroup = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    justify-content: space-around;
    width: 100%;
`;
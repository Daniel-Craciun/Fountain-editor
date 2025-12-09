import styled from "styled-components";

export const ColorInput = styled.input`
    cursor: pointer;
    border: none;
    -webkit-appearance: none;
`;

export const NozzleName = styled.span`
    color: white;
    font-size: 0.9rem;
    text-align: center;
`;

export const NozzleCard = styled.div<{selected: boolean}>`
    height: 100%;
    width: 5%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    border-radius: 5px;
    margin-left: 5px;
    margin-right: 5px;
    transition: 0.1s;
    background-color: ${props => props.selected ? "rgb(50,50,50)" : "none"};
    
    &:hover {
        cursor: pointer;
        background-color: rgb(60,60,60);
    }
`;

export const NozzleRow = styled.div`
    display: flex;
    flex-direction: row;
    height: 70%;
    width: 100%;
    justify-content: center;
`;

export const NozzleViewContainer = styled.div`
    position: absolute;
    top: 5%;
    width: 85%;
    height: 70%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    overflow-x: auto;
`;
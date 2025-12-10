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

export const TrackNameContainer = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    padding: 10px;
`;

export const TrackName = styled.span<{ ispump: boolean }>`
    font-size: 1.3rem;
    color: ${props => props.ispump ? "cyan" : "yellow"};
`;

export const NozzlesSavedContainer = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    padding: 10px;
`;

export const NozzlesUnsavedName = styled.span`
    font-size: 1.3rem;
    color: rgba(241, 71, 71, 1);
`;
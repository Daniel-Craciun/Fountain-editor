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
    justify-content: center;
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
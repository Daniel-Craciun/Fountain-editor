import { Tab } from "@mui/material";
import styled from "styled-components";

export const SidebarContainer = styled.div`
    position: absolute;
    left: 85%;
    width: 15%;
    height: 75%;
    background-color: rgb(48,48,48);
    border-left: 1px solid grey;
    overflow-x: hidden;
    overflow-y: hidden;
`;

export const TabLabel = styled.span`
    color: white;
    text-transform: none;
`;

export const SidebarTab = styled(Tab)`
    background-color: rgb(60,60,60) !important;
    border-right: 1px solid grey !important;
    border-bottom: 1px solid grey !important;
`;
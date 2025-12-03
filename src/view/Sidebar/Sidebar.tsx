import { Tabs } from "@mui/material";
import { SidebarContainer, SidebarTab, TabLabel } from "./sidebar_components";
import { useState } from "react";
import NozzlesList from "./NozzlesList/NozzlesList";
import KeyframeControls from "./Frame/KeyframeControls/KeyframeControls";

export default function Sidebar() {
    const [tabValue, setTabValue] = useState(0);

    return (
        <SidebarContainer>
            <Tabs variant="fullWidth" value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                <SidebarTab 
                    label={<TabLabel>Nozzles</TabLabel>} 
                />
                <SidebarTab 
                    label={<TabLabel>Frame</TabLabel>} 
                />
            </Tabs>

            {tabValue === 0 &&
                <>
                    <NozzlesList />
                </>
            }

            {tabValue === 1 &&
                <>
                    <KeyframeControls />
                </>
            }   
        </SidebarContainer>
    )
}
import { useEffect, useState } from "react";
import { ColorInput, NozzleCard, NozzleName } from "./nozzle_components";
import { hexToRgb, Menu, MenuItem, Slider } from "@mui/material"
import { NozzleUnit } from "../../model/model";
import { rgbStringToRgbArray } from "../../controller/utils";
import StoreController from "../../controller/store/StoreController";
import { copyLightValue, copyPumpAndLight, copyPumpValue, selectNozzle } from "./nozzle_logic";
import { dispatchCustomEvent } from "../../controller/events";

interface IProps {
    nozzle: NozzleUnit;
    nozzleIndex: number;
    disablePump: boolean;
    disableLight: boolean;
    disablePaste: boolean;
    selected: boolean;
}

export default function NozzleUnitCard({ nozzle, disablePump, disableLight, disablePaste, nozzleIndex, selected }: IProps) {
    const [colorValue, setColorValue] = useState(nozzle.getHexColor());
    const [pumpHeight, setPumpHeight] = useState(nozzle.pumpHeight);
    const [brightness, setBrightness] = useState(nozzle.brightness);

    /* menu parameters */
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const menuOpen = Boolean(anchorEl);

    /* update local state values when we recieve events */
    function valueListener(e: any) {
        setPumpHeight(e.detail.pumpHeight);
        setColorValue(e.detail.hexColor);
        setBrightness(e.detail.brightness);
    }

    useEffect(() => {
        window.addEventListener(`nozzle-${nozzle.id}`, valueListener);

        return () => { window.removeEventListener(`nozzle-${nozzle.id}`, valueListener) };
    }, []);

    return (
        <>
            <NozzleCard
                onContextMenu={(e) => {
                    e.preventDefault();
                    setAnchorEl(e.currentTarget);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    selectNozzle(nozzle.id, !selected, e.ctrlKey);
                }}
                selected={selected}
            >
                <NozzleName>{nozzle.name}</NozzleName>


                <Slider
                    orientation="vertical"
                    valueLabelDisplay="auto"
                    value={disablePump ? brightness : pumpHeight}
                    onChange={(e) => {
                        // @ts-ignore
                        const newValue: number = e.target!.value;

                        if (disablePump) {
                            setBrightness(newValue);
                            StoreController.updateNozzleParameter('brightness', newValue, nozzleIndex);
                        }
                        else {
                            setPumpHeight(newValue);
                            StoreController.updateNozzleParameter('pumpHeight', newValue, nozzleIndex);
                        }
                    }}
                    size="medium"
                    step={5}
                    sx={{
                        height: "60%",
                        color: colorValue,
                        opacity: Math.max(brightness / 100, 0.1),
                        "&.Mui-disabled": {
                            color: colorValue,
                            opacity: Math.max(brightness / 100, 0.1)
                        }
                    }}
                    onKeyDownCapture={(e) => {
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }}
                    onClick={(e) => {
                        if (e.ctrlKey) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }}
                />


                <ColorInput 
                    type="color" 
                    value={colorValue} 
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setColorValue(newValue);

                        StoreController.updateNozzleParameter('rgb', rgbStringToRgbArray(hexToRgb(newValue)), nozzleIndex);
                    }} 
                    disabled={disableLight}
                />
                

                <NozzleName>{disablePump ? brightness : pumpHeight}%</NozzleName>
            </NozzleCard>


            <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <MenuItem 
                    dense 
                    disabled={disablePaste}
                    onClick={(e) => {
                        e.stopPropagation();
                        dispatchCustomEvent('pasteNozzleValues', nozzle.id);
                    }}
                >
                    Paste
                </MenuItem>

                <hr />

                <MenuItem 
                    dense
                    onClick={(e) => {
                        e.stopPropagation();
                        copyPumpValue(pumpHeight);
                    }}
                >
                    Copy pump
                </MenuItem>

                <MenuItem 
                    dense
                    onClick={(e) => {
                        e.stopPropagation();
                        copyLightValue(rgbStringToRgbArray(hexToRgb(colorValue)), brightness);
                    }}
                >
                    Copy light
                </MenuItem>

                <MenuItem 
                    dense
                    onClick={(e) => {
                        e.stopPropagation();
                        copyPumpAndLight(pumpHeight, rgbStringToRgbArray(hexToRgb(colorValue)), brightness);
                    }}
                >
                    Copy both
                </MenuItem>
            </Menu>
        </>
    )
}
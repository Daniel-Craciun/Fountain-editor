import { useEffect, useState } from "react";
import { ColorInput, NozzleCard, NozzleName } from "./nozzle_components";
import { hexToRgb, Slider } from "@mui/material"
import { NozzleUnit } from "../../model/model";
import { rgbStringToRgbArray } from "../../controller/utils";
import StoreController from "../../controller/store/StoreController";

interface IProps {
    nozzle: NozzleUnit;
    nozzleIndex: number;
}

export default function NozzleUnitCard({ nozzle, nozzleIndex }: IProps) {
    const [colorValue, setColorValue] = useState(nozzle.getHexColor());
    const [pumpHeight, setPumpHeight] = useState(nozzle.pumpHeight);

    function valueListener(e: any) {
        setPumpHeight(e.detail.pumpHeight);
        setColorValue(e.detail.hexColor);
    }

    useEffect(() => {
        window.addEventListener(`nozzle-${nozzle.id}`, valueListener);

        return () => { window.removeEventListener(`nozzle-${nozzle.id}`, valueListener) };
    }, []);

    return (
        <NozzleCard>
            <NozzleName>{nozzle.name}</NozzleName>

            <Slider
                orientation="vertical"
                valueLabelDisplay="auto"
                value={pumpHeight}
                onChange={(e) => {
                    // @ts-ignore
                    const newValue: number = e.target!.value;
                    setPumpHeight(newValue as number);

                    StoreController.updateNozzleParameter('pumpHeight', newValue, nozzleIndex);
                }}
                size="medium"
                step={5}
                sx={{
                    height: "60%",
                    color: colorValue
                }}
            />

            <ColorInput 
                type="color" 
                value={colorValue} 
                onChange={(e) => {
                    const newValue = e.target.value;
                    setColorValue(newValue);

                    StoreController.updateNozzleParameter('rgb', rgbStringToRgbArray(hexToRgb(newValue)), nozzleIndex);
                }} />

            <NozzleName>{pumpHeight}%</NozzleName>
        </NozzleCard>
    )
}
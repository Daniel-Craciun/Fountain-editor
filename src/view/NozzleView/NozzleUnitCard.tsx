import { useState } from "react";
import { ColorInput, NozzleCard, NozzleName } from "./nozzle_components";
import { Slider } from "@mui/material"
import { NozzleUnit } from "../../model/model";

interface IProps {
    nozzle: NozzleUnit;
}

export default function NozzleUnitCard({ nozzle }: IProps) {
    const [colorValue, setColorValue] = useState(nozzle.getHexColor());
    const [pumpHeight, setPumpHeight] = useState(nozzle.pumpHeight);

    return (
        <NozzleCard>
            <NozzleName>{nozzle.name}</NozzleName>

            <Slider
                orientation="vertical"
                valueLabelDisplay="auto"
                value={pumpHeight}
                onChange={(e) => {
                    // @ts-ignore
                    setPumpHeight(e.target!.value as number);
                }}
                size="medium"
                step={5}
                sx={{
                    height: "60%",
                    color: colorValue
                }}
            />

            <ColorInput type="color" value={colorValue} onChange={(e) => setColorValue(e.target.value)} />

            <NozzleName>{pumpHeight}%</NozzleName>
        </NozzleCard>
    )
}
import { rgbToHex } from "../controller/utils";

export class NozzleUnit {
    private static idCounter = 0;

    public haName: string;
    public name: string;
    public pumpHeight: number;
    public rgb: Array<number>;
    public brightness: number;
    public calibration: number;
    public id: number;
    
    constructor(haName: string = "", name: string = "") {
        this.haName = haName;
        this.name = name;
        this.pumpHeight = 0;
        this.rgb = [255, 255, 255];
        this.brightness = 100;
        this.calibration = 0;
        this.id = NozzleUnit.idCounter++;
    }

    getHexColor(): string {
        return rgbToHex(`rgb(${this.rgb.join(',')})`)
    }
}
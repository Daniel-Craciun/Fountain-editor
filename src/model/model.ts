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

    clone(): NozzleUnit {
        const nozzleUnit = new NozzleUnit();
        nozzleUnit.haName = this.haName;
        nozzleUnit.name = this.name;
        nozzleUnit.pumpHeight = this.pumpHeight;
        nozzleUnit.rgb = [...this.rgb];
        nozzleUnit.brightness = this.brightness;
        nozzleUnit.calibration = this.calibration;

        return nozzleUnit;
    }
}


export class Frame {
    private nozzles: Array<NozzleUnit>;

    constructor() {
        this.nozzles = [];
    }

    setNozzles(nozzles: Array<NozzleUnit>) {
        this.nozzles = nozzles;
    }

    getNozzles(): Array<NozzleUnit> {
        return this.nozzles;
    }

    cloneNozzles(): Array<NozzleUnit> {
        let clonedNozzles = [];

        for (let i = 0; i < this.nozzles.length; i++) {
            clonedNozzles.push(this.nozzles[i].clone());
        }

        return clonedNozzles;
    }

    updateNozzle(nozzle: NozzleUnit) {
        let newNozzles = [];

        for (let i = 0; i < this.nozzles.length; i++) {
            if (this.nozzles[i].id === nozzle.id) {
                newNozzles.push(nozzle);
            }
            else {
                newNozzles.push(this.nozzles[i]);
            }
        }
        
        this.setNozzles(newNozzles);
    }
}
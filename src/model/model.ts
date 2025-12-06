import { lerp, rgbToHex } from "../controller/utils";

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

    clone(id?: number): NozzleUnit {
        const nozzleUnit = new NozzleUnit();
        nozzleUnit.haName = this.haName;
        nozzleUnit.name = this.name;
        nozzleUnit.pumpHeight = this.pumpHeight;
        nozzleUnit.rgb = [...this.rgb];
        nozzleUnit.brightness = this.brightness;
        nozzleUnit.calibration = this.calibration;
        nozzleUnit.id = id ?? this.id;

        return nozzleUnit;
    }
    
    static computeInterpolation(nozzle1: NozzleUnit, nozzle2: NozzleUnit, t: number): NozzleUnit {
        const interpNozzle = nozzle1.clone();

        if (nozzle1.pumpHeight != nozzle2.pumpHeight) {
            interpNozzle.pumpHeight = Math.round(lerp(nozzle1.pumpHeight, nozzle2.pumpHeight, t));
        }

        const [r1, g1, b1] = nozzle1.rgb;
        const [r2, g2, b2] = nozzle2.rgb;

        if (r1 !== r2 || g1 !== g2 || b1 !== b2) {
            interpNozzle.rgb[0] = Math.round(lerp(r1, r2, t));
            interpNozzle.rgb[1] = Math.round(lerp(g1, g2, t));
            interpNozzle.rgb[2] = Math.round(lerp(b1, b2, t));
        }

        return interpNozzle;
    }
}


export class Frame {
    private nozzles: Array<NozzleUnit>;

    constructor() {
        this.nozzles = [];
    }

    setNozzles(nozzles: Array<NozzleUnit>) {
        this.nozzles = [...nozzles];
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

    clone(): Frame {
        const newFrame = new Frame();
        newFrame.setNozzles(this.cloneNozzles());
        return newFrame;
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

    static computeInterpolation(frame1: Frame, frame2: Frame, t: number): Frame {
        const interpFrame = new Frame();
        let interpNozzles = frame1.cloneNozzles();
        const frame2Nozzles = frame2.getNozzles();
        
        for (let i = 0; i < interpNozzles.length; i++) {
            interpNozzles[i] = NozzleUnit.computeInterpolation(interpNozzles[i], frame2Nozzles[i], t);
        }

        interpFrame.setNozzles(interpNozzles);
        return interpFrame;
    }
}
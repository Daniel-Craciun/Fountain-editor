import { Timeline, TimelineClickEvent, TimelineElement, TimelineKeyframeChangedEvent, TimelineSelectedEvent, TimelineTimeChangedEvent } from "animation-timeline-js"
import { listenToCustomEvent, TNozzleSelect, TProjectExport } from "../events";
import { Frame, NozzleUnit } from "../../model/model";
import { store } from "../store";
import { setAreNozzlesSaved, setNozzles, setSelectedKeyframeIds, setSelectedNozzleIds, setSelectedRowID } from "../store/appState";
import { v4 } from "uuid"
import { ExtTimelineKeyframe, ExtTimelineModel, ExtTimelineRow, TPrevNextKeyframes, YamlKeyframeObject, YamlTimelineKeyframe } from "./types";
import StoreController from "../store/StoreController";
import yaml from "js-yaml";
import { TimelineGroup } from "animation-timeline-js/lib/models/timelineGroup";


export default class TimelineController {
    private timeline: Timeline;
    private model: ExtTimelineModel;

    private timelineTime: number;
    private keyframes: Array<ExtTimelineKeyframe>;

    private copiedKeyframeIds: Array<string>;
    
    private selectedKeyframeIds: Array<string>;
    private selectedRowID: number;
    private rowCount: number;

    private showPlayer: NodeJS.Timeout | null;

    private activeRowFillColor: string = "rgba(48, 56, 66, 1)";
    private inactiveRowFillColor: string = "rgb(40,40,40)";

    private keyframeGroup: TimelineGroup;

    constructor(timeline: Timeline) {
        this.showPlayer = null;

        this.timelineTime = 0;
        this.keyframes = [];

        this.selectedKeyframeIds = [];
        this.selectedRowID = 0;
        this.rowCount = 2;
        
        this.copiedKeyframeIds = [];

        this.keyframeGroup = {
            style: {
                fillColor: "rgba(255, 255, 255, 0.2)"
            }
        }

        /* model setup */
        this.model = {
            rows: [
                {
                    style: {
                        fillColor: this.activeRowFillColor
                    },
                    id: 0,
                    keyframes: []
                },
                {
                    style: {
                        fillColor: this.inactiveRowFillColor
                    },
                    id: 1,
                    keyframes: []
                },
            ]
        };

        /* timeline setup */
        this.timeline = timeline;
        this.timeline.setOptions({ snapStep: 50 });
        this.timeline._formatUnitsText = (val) => (val/1000) + "s";
        this.timeline.setModel(this.model);
        this.timeline.setTime(this.timelineTime);

        /* event setup */
        this.initEvents();
    }

    /* events */
    private initEvents() {
        listenToCustomEvent("playShow",  () => this.playShow());
        listenToCustomEvent("pauseShow", () => this.pauseShow());

        listenToCustomEvent("fineForwardShow",  () => this.fineForwardShow());
        listenToCustomEvent("stepForwardShow",  () => this.stepForwardShow());
        listenToCustomEvent("fastForwardShow",  () => this.fastForwardShow());
        listenToCustomEvent("fineBackwardShow", () => this.fineBackwardShow());
        listenToCustomEvent("stepBackwardShow", () => this.stepBackwardShow());
        listenToCustomEvent("fastBackwardShow", () => this.fastBackwardShow());

        listenToCustomEvent("copySelectedKeyframes", () => this.copySelectedKeyframes());
        listenToCustomEvent("pasteCopiedKeyframes",  () => this.pasteCopiedKeyframes());

        listenToCustomEvent('deleteSelectedKeyframes', () => this.deleteSelectedKeyframes());
        listenToCustomEvent('saveCurrentKeyframe',     (saveAll) => this.saveCurrentKeyframe(saveAll));

        listenToCustomEvent('selectPrevRow', () => this.selectPrevRow());
        listenToCustomEvent('selectNextRow', () => this.selectNextRow());
        listenToCustomEvent('selectNozzle',      (e) => this.selectNozzle(e));
        listenToCustomEvent('pasteNozzleValues', (e) => this.pasteNozzleValues(e));
        listenToCustomEvent('selectAllNozzles',  () => this.selectAllNozzles());

        listenToCustomEvent('invertSelKeyframesTrans', () => this.invertKeyframeTransition());

        listenToCustomEvent('exportProject', (e) => this.exportYaml(e));
        listenToCustomEvent('loadProject', (e) => this.loadYaml(e));

        
        this.timeline.onContextMenu((e) => {
            e.args?.preventDefault();
            this.handleRightClick(e);
        });

        this.timeline.onSelected((e) => this.handleSelectedEvent(e));
        this.timeline.onTimeChanged((e) => this.handleTimeChange(e));
        this.timeline.onKeyframeChanged((e) => this.handleKeyframeChange(e));
    }

    /* set the selected key frames */
    private setSelectedKeyframeIds(frameIds: Array<string>) {
        this.selectedKeyframeIds = frameIds;
        store.dispatch(setSelectedKeyframeIds(frameIds));
    }

    /* sort the keyframe order */
    private sortKeyframes() {
        this.keyframes = this.keyframes.sort((a,b) => a.rowId! - b.rowId! || a.val - b.val);
    }

    private getKeyframesFromRow(rowID: number): Array<ExtTimelineKeyframe> {
        return this.keyframes.filter((kf) => kf.rowId === rowID);
    }

    /* get the prev and next keyframes at the current time */
    private getPrevAndNextFrames(time: number): TPrevNextKeyframes {
        let output: TPrevNextKeyframes = { prev: [], next: [] } 

        for (let i = 0; i < this.rowCount; i++) {
            const keyframes = this.getKeyframesFromRow(i);
            let foundKeyframes = false;

            for (let j = -1; j < keyframes.length; j++) {
                const prevTime = keyframes[j]?.val ?? 0;
                const nextTime = keyframes[j+1]?.val ?? prevTime;

                if (time >= prevTime && time <= nextTime) {
                    output.prev.push(keyframes[j] ?? keyframes[j+1]);
                    output.next.push(keyframes[j+1] ?? keyframes[j]);
                    
                    foundKeyframes = true;
                    break;
                }
            }

            if (!foundKeyframes) {
                if (keyframes.length > 0) {
                    const lastKeyframe = keyframes[keyframes.length-1];

                    output.prev.push(lastKeyframe);
                    output.next.push(lastKeyframe);
                }
                else {
                    output.prev.push(null);
                    output.next.push(null);
                }
            }
        }
        
        return output;
    }

    /* gets the current keyframe at the current time */
    private getKeyframeIndexAt(time: number, id: number = this.selectedRowID): number {
        return this.keyframes.findIndex((frame) => frame.val === time && frame.rowId ===  id) ?? -1;
    }

    /* apply row specific parameters to nozzles */
    private applyRowSpecificParameters(frame: Frame, rowID: number) {
        /* pump only channel */
        if (rowID === 0) {
            const nozzles = frame.getNozzles();

            for (let i = 0; i < nozzles.length; i++) {
                nozzles[i].lightDisabled = true;
            }
        }
        /* light only channel */
        else if (rowID === 1) {
            const nozzles = frame.getNozzles();

            for (let i = 0; i < nozzles.length; i++) {
                nozzles[i].pumpDisabled = true;
            }
        }
    }

    /* model functions */
    private setModel() {
        let rows: Array<ExtTimelineRow> = [];

        this.sortKeyframes();

        for (let i = 0; i < this.rowCount; i++) {
            rows.push({
                style: {
                    fillColor: this.selectedRowID === i ? this.activeRowFillColor : this.inactiveRowFillColor
                },
                id: i,
                keyframes: this.getKeyframesFromRow(i)
            });
        }

        this.model.rows = rows;
        this.timeline.setModel(this.model);
    }

    /* keyframe functions */
    private addKeyframe(rowId: number, time: number, frameValue: Frame) {
        this.timeline.deselectAll();

        const addedFrame = new Frame();
        addedFrame.setNozzles(frameValue.cloneNozzles());
        this.applyRowSpecificParameters(addedFrame, rowId);

        const frameId = v4();

        this.keyframes.push({
            frameId: frameId,
            val: time,
            frameValue: addedFrame,
            rowId: rowId,
            selected: true,
            transition: true,
            group: this.keyframeGroup,
            style: {
                fillColor: "white"
            }
        });

        this.setModel();
        this.setSelectedKeyframeIds([frameId]);
    }

    private getRowElement(elements: Array<TimelineElement>): TimelineElement | null {
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].type === "row") {
                return elements[i];
            }
        }

        return null;
    }

    private invertKeyframeTransition() {
        const keyframes = this.timeline.getSelectedKeyframes() as Array<ExtTimelineKeyframe>;
        
        for (let i = 0; i < keyframes.length; i++) {
            const kfIndex = this.keyframes.findIndex((kf) => kf.frameId === keyframes[i].frameId);

            if (kfIndex > -1) {
                const shouldTransition = !this.keyframes[kfIndex].transition;

                this.keyframes[kfIndex].transition = shouldTransition;

                if (shouldTransition) {
                    this.keyframes[kfIndex].style!.fillColor = "white";
                }
                else { 
                    this.keyframes[kfIndex].style!.fillColor = "rgb(79, 218, 79)";
                }
            }
        }

        this.setSelectedKeyframeIds([]);
        this.timeline.deselectAll();
        this.setModel();
        this.computeFrameInterpolation();
    }

    /* custom events */
    private playShow() {
        if (this.showPlayer != null) return;

        this.setSelectedRowID(0);

        const timeStep = this.timeline.getOptions().snapStep ?? 100;
        this.timeline.setOptions({ timelineDraggable: false });

        this.showPlayer = setInterval(() => {
            this.timelineTime += timeStep;
            this.timeline.setTime(this.timelineTime);
            this.alignTimelineInView(this.timelineTime);
        }, timeStep);
    }
    
    private pauseShow() {
        if (this.showPlayer) {
            clearInterval(this.showPlayer);
            this.showPlayer = null;
        }
        
        this.timeline.setOptions({ timelineDraggable: true });
    }
    
    private fineForwardShow() {
        this.timelineTime += this.timeline.getOptions().snapStep ?? 50;
        this.timeline.setTime(this.timelineTime);
        this.alignTimelineInView(this.timelineTime);
    }

    private stepForwardShow() {
        this.timelineTime += 500;
        this.timeline.setTime(this.timelineTime);
        this.alignTimelineInView(this.timelineTime);
    }

    private fastForwardShow() {
        const lastKeyframe = this.keyframes[this.keyframes.length-1];

        if (lastKeyframe) {
            this.timelineTime = lastKeyframe.val;
            this.timeline.setTime(this.timelineTime);
            this.alignTimelineInView(this.timelineTime);
        }
    }

    private fineBackwardShow() {
        this.timelineTime -= this.timeline.getOptions().snapStep ?? 50;
        this.timeline.setTime(this.timelineTime);
        this.alignTimelineInView(this.timelineTime);
    }

    private stepBackwardShow() {
        this.timelineTime -= 500;
        this.timeline.setTime(this.timelineTime);
        this.alignTimelineInView(this.timelineTime);
    }

    private fastBackwardShow() {
        this.timelineTime = 0;
        this.timeline.setTime(this.timelineTime);
        this.alignTimelineInView(this.timelineTime);
    }


    private copySelectedKeyframes() {
        this.copiedKeyframeIds = [...this.selectedKeyframeIds];
    }

    private pasteCopiedKeyframes() {
        let referenceVal = 0;

        for (let i = 0; i < this.copiedKeyframeIds.length; i++) {
            const kf = this.keyframes.find((k) => k.frameId === this.copiedKeyframeIds[i])!;

            if (i === 0) {
                referenceVal = this.timelineTime - kf.val;
            }

            const newKeyframe: ExtTimelineKeyframe = {
                ...kf,
                val: kf.val + referenceVal,
                frameValue: kf.frameValue?.clone(),
                frameId: v4(),
                selected: false,
            }

            this.keyframes.push(newKeyframe);
        }

        this.setModel();
    }


    private selectPrevRow() {
        this.selectedRowID -= 1;

        if (this.selectedRowID < 0) {
            this.selectedRowID = this.rowCount-1;
        }

        this.setSelectedRowID(this.selectedRowID);
    }

    private selectNextRow() {
        this.selectedRowID += 1;
        
        if (this.selectedRowID >= this.rowCount) {
            this.selectedRowID = 0;
        }

        this.setSelectedRowID(this.selectedRowID);
    }

    private setSelectedRowID(rowID: number) {
        this.selectedRowID = rowID;
        this.setModel();
        store.dispatch(setSelectedRowID(this.selectedRowID));
    }

    private selectNozzle(body: TNozzleSelect) {
        const { selectedNozzleIds } = store.getState().appState;

        /* clear all selected nozzles */
        if (body.nozzleID === -1) {
            store.dispatch(setSelectedNozzleIds([]));
            return;
        }

        let newIds = [...selectedNozzleIds];

        if (body.shouldSelect) {
            if (body.overrideSelected) {
                newIds = [body.nozzleID];
            }
            else {
                newIds.push(body.nozzleID);
            }
        }
        else {
            newIds = newIds.filter((id) => id !== body.nozzleID);
        }

        store.dispatch(setSelectedNozzleIds(newIds));
    }

    private pasteNozzleValues(nozzleID: number) {
        const selectedNozzleIds = [...store.getState().appState.selectedNozzleIds];

        if (!selectedNozzleIds.includes(nozzleID)) {
            selectedNozzleIds.push(nozzleID);
        }

        const nozzles = [...store.getState().appState.nozzles];
        const { nozzleCopyState } = store.getState().appState;

        for (let i = 0; i < nozzles.length; i++) {
            if (selectedNozzleIds.includes(nozzles[i].id)) {
                if (nozzleCopyState.pump) {
                    nozzles[i].pumpHeight = nozzleCopyState.pump;
                }

                if (nozzleCopyState.light) {
                    nozzles[i].rgb = nozzleCopyState.light;
                }

                if (nozzleCopyState.brightness) {
                    nozzles[i].brightness = nozzleCopyState.brightness;
                }
            }
        }

        store.dispatch(setNozzles(nozzles));
    }

    private selectAllNozzles() {
        const { nozzles } = store.getState().appState;
        const nozzleIds = nozzles.map((n) => n.id);
        store.dispatch(setSelectedNozzleIds(nozzleIds));
    }


    private deleteSelectedKeyframes() {
        let newKeyframes = [];

        for (let i = 0; i < this.keyframes.length; i++) {
            if (!this.selectedKeyframeIds.includes(this.keyframes[i].frameId!)) {
                newKeyframes.push(this.keyframes[i]);
            }
        }

        this.keyframes = newKeyframes;
        this.setModel();
        this.setSelectedKeyframeIds([]);
        this.computeFrameInterpolation();
    }

    private createKeyframeAt(time: number, rowID: number = this.selectedRowID) {
        const { nozzles } = store.getState().appState;

        const frame = new Frame();
        frame.setNozzles(nozzles);

        this.addKeyframe(rowID, time, frame);
    }

    private saveKeyframeAt(time: number, rowID: number) {
        const keyframeIndex = this.getKeyframeIndexAt(time, rowID);

        if (keyframeIndex > -1) {
            const { nozzles } = store.getState().appState;
            const copiedNozzles = nozzles.map((n) => n.clone());

            this.keyframes[keyframeIndex].frameValue?.setNozzles(copiedNozzles);
        }
        else {
            this.createKeyframeAt(time, rowID);
        }
    }

    private saveCurrentKeyframe(saveAllTracks: boolean) {
        if (saveAllTracks) {
            for (let i = 0; i < this.rowCount; i++) {
                this.saveKeyframeAt(this.timelineTime, i);
            }
        }
        else {
            this.saveKeyframeAt(this.timelineTime, this.selectedRowID);
        }

        store.dispatch(setAreNozzlesSaved(true));
    }

    /* timeline display */
    private alignTimelineInView(time: number) {
        const fromPx = this.timeline.scrollLeft;
        const toPx = this.timeline.scrollLeft + this.timeline.getClientWidth();

        let positionInPixels = this.timeline.valToPx(time);
        // Scroll to timeline position if timeline is out of the bounds:
        if (positionInPixels <= fromPx || positionInPixels >= toPx) {
            this.timeline.scrollLeft = positionInPixels;
        }
    }


    /* user events */
    private handleRightClick(e: TimelineClickEvent) {
        e.preventDefault();

        const rowElement = this.getRowElement(e.elements);

        if (rowElement) {
            const row = (rowElement.row! as ExtTimelineRow);
            const rowId = row.id;
            
            const { nozzles } = store.getState().appState;
            const frame = new Frame();
            frame.setNozzles(nozzles);

            this.addKeyframe(rowId ?? 0, rowElement.val, frame);
            this.setSelectedRowID(rowId ?? 0);
        }
    }

    private handleSelectedEvent(e: TimelineSelectedEvent) {
        let frameIds = e.selected.map((frame: ExtTimelineKeyframe) => frame.frameId!);

        if (e.selected.length < 1) {
            this.setSelectedKeyframeIds([]);
            return;
        };

        if (e.selected.length === 1) {
            const selectedKf = e.selected[0] as ExtTimelineKeyframe;
            this.timelineTime = selectedKf.val;
            this.timeline.setTime(this.timelineTime);

            this.timeline.select([selectedKf]);

            frameIds.push(selectedKf.frameId!);

            this.computeFrameInterpolation();
        }
        
        this.setSelectedKeyframeIds(frameIds);
    }

    private handleKeyframeChange(e: TimelineKeyframeChangedEvent) {
        this.sortKeyframes();
    }

    private computeInterpolationBetween(
        prevKeyframe: ExtTimelineKeyframe | null, 
        nextKeyframe: ExtTimelineKeyframe | null
    ): Frame | null {
        if (!prevKeyframe || !nextKeyframe) return null;

        if (nextKeyframe.transition) {
            const prevTime = prevKeyframe.val ?? 0;
            const nextTime = nextKeyframe.val ?? 0;

            /* compute the t value of how far along we are in the frame transitions */
            let t = (this.timelineTime - prevTime) / (nextTime - prevTime);

            if      (t > 1) t = 1;
            else if (t < 0) t = 0;

            const interpolatedFrame = Frame.computeInterpolation(prevKeyframe.frameValue!, nextKeyframe.frameValue!, t);
            return interpolatedFrame;
        }
        else {
            if (this.timelineTime === nextKeyframe.val) {
                return nextKeyframe.frameValue!.clone();
            }
            return prevKeyframe.frameValue!.clone();
        }
    }

    private computeFrameInterpolation() {
        if (this.keyframes.length === 0) return;

        const prevNextFrames = this.getPrevAndNextFrames(this.timelineTime);

        let interpolatedFrames: Array<Frame | null> = [];
        
        for (let i = 0; i < this.rowCount; i++) {
            const interpolatedFrame = this.computeInterpolationBetween(prevNextFrames.prev[i], prevNextFrames.next[i]);
            interpolatedFrames.push(interpolatedFrame);
        }
        
        const { nozzles } = store.getState().appState;

        const resultFrame = new Frame();
        resultFrame.setNozzles(nozzles);
        resultFrame.setNozzles(resultFrame.cloneNozzles());
        const resultNozzles = resultFrame.getNozzles();

        for (let i = 0; i < resultNozzles.length; i++) {
            for (let j = 0; j < interpolatedFrames.length; j++) {
                if (interpolatedFrames[j] === null) continue;

                const frameNozzles = interpolatedFrames[j]!.getNozzles();

                if (j === 0) {
                    resultNozzles[i].pumpHeight = frameNozzles[i].pumpHeight;
                }

                if (j === 1) {
                    resultNozzles[i].rgb = [...frameNozzles[i].rgb];
                    resultNozzles[i].brightness = frameNozzles[i].brightness;
                }
            }

            StoreController.updateNozzleParameter('pumpHeight', resultNozzles[i].pumpHeight, i);
            StoreController.updateNozzleParameter('rgb', resultNozzles[i].rgb, i);
            StoreController.updateNozzleParameter('brightness', resultNozzles[i].brightness, i);

            const event = new CustomEvent(
                `nozzle-${resultNozzles[i].id}`, 
                { 
                    detail: { 
                        pumpHeight: resultNozzles[i].pumpHeight, 
                        hexColor: resultNozzles[i].getHexColor(),
                        brightness: resultNozzles[i].brightness
                    }
                }
            );
            window.dispatchEvent(event);
        }
    }

    private handleTimeChange(e: TimelineTimeChangedEvent) {
        this.timelineTime = e.val;
        this.computeFrameInterpolation();
    }


    private keyframeToYamlObject(keyframe: ExtTimelineKeyframe): YamlKeyframeObject {
        const ymlObject: YamlKeyframeObject = {
            id: 0,
            transition: keyframe.transition!,
            values: {}
        };

        const nozzles = keyframe.frameValue!.getNozzles();

        for (let i = 0; i < nozzles.length; i++) {
            const nozzleName = nozzles[i].name;

            ymlObject.values[nozzleName] = {
                pump: undefined,
                light: undefined
            };

            if (keyframe.rowId === 0) {
                ymlObject.values[nozzleName].pump = nozzles[i].pumpHeight;
            }

            if (keyframe.rowId === 1) {
                ymlObject.values[nozzleName].light = [nozzles[i].brightness, ...nozzles[i].rgb];
            }
        }

        return ymlObject;
    }

    private buildFrameFromNozzleValues(nozzles: Array<NozzleUnit>, values: YamlKeyframeObject["values"]): Frame {
        const frame = new Frame();
        frame.setNozzles(nozzles);
        
        let clonedNozzles = frame.cloneNozzles();

        for (let i = 0; i < clonedNozzles.length; i++) {
            const nozzleName = clonedNozzles[i].name;
            const value = values[nozzleName];

            if (value?.pump !== undefined) {
                clonedNozzles[i].pumpHeight = value.pump;
            }

            if (value?.light !== undefined) {
                clonedNozzles[i].brightness = value.light[0];
                clonedNozzles[i].rgb = [value.light[1], value.light[2], value.light[3]];
            }
        }

        frame.setNozzles(clonedNozzles);
        return frame;
    }

    /* yaml loading / exporting */
    private exportYaml(projectExport: TProjectExport) {
        const { nozzles } = store.getState().appState;

        this.sortKeyframes();

        /* inital object */
        const yamlObject: any = {
            config: {
                pulse_rate: this.timeline.getOptions().snapStep ?? 50
            },
            keyframes: [],
            timeline: [],
        };

        /* put the nozzle configurations into the object */
        for (let i = 0; i < nozzles.length; i++) {
            yamlObject.config[nozzles[i].name] = {
                name: nozzles[i].haName,
                calibration: nozzles[i].calibration
            }
        }

        /* load the current keyframe data into the object */
        const keyframeSet = new Set<string>();
        const idToSetIndexMap = new Map<string, number>();

        /* create a unique set of keyframes */
        for (let i = 0, j = 0; i < this.keyframes.length; i++) {
            const ymlObject = this.keyframeToYamlObject(this.keyframes[i]);
            const hashedObject = JSON.stringify(ymlObject);

            if (keyframeSet.has(hashedObject)) {
                idToSetIndexMap.set(this.keyframes[i].frameId!, [...keyframeSet].indexOf(hashedObject));
                continue;
            }

            keyframeSet.add(hashedObject);
            idToSetIndexMap.set(this.keyframes[i].frameId!, j++);
        }

        /* add the associated ids to each keyframe */
        const uniqueKeyframes = [...keyframeSet];

        for (let i = 0; i < uniqueKeyframes.length; i++) {
            yamlObject.keyframes.push({
                keyframe: {
                    ...JSON.parse(uniqueKeyframes[i]),
                    id: i
                }
            });
        }

        /* generate the timeline referencing the keyframes */
        for (let i = 0; i < this.keyframes.length; i++) {
            yamlObject.timeline.push({
                keyframe: {
                    id: idToSetIndexMap.get(this.keyframes[i].frameId!),
                    time: this.keyframes[i].val,
                    track: this.keyframes[i].rowId!
                }
            })
        }
        
        /* convert the object into yaml */
        const yamlResult = yaml.dump(yamlObject);

        if (projectExport.copyToClipboard) {
            navigator.clipboard.writeText(yamlResult);
        }
        else {
            /* download the yaml result */
            const blob = new Blob([yamlResult], { type: "text/yaml" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = projectExport.name + ".yaml";
            a.click();

            URL.revokeObjectURL(url);
        }
    }

    private loadYaml(fileContents: string) {
        const object = yaml.load(fileContents) as any;

        this.keyframes = [];
        this.setSelectedKeyframeIds([]);
        this.timeline.setOptions({ snapStep: object.config.pulse_rate });

        /* load the nozzles from the config section */
        let loadedNozzles = [];

        for (const [key, value] of Object.entries(object.config)) {
            if (key === "pulse_rate") continue;

            const nozzleName = key as string;
            const nozzleValue = value as any;
            const nozzle = new NozzleUnit(nozzleValue.name, nozzleName);
            nozzle.calibration = nozzleValue.calibration;

            loadedNozzles.push(nozzle);
        }

        /* load the keyframes into a map */
        const keyframeMap = new Map<number, YamlKeyframeObject>();

        const { keyframes } = object;

        for (let i = 0; i < keyframes.length; i++) {
            const keyframe = keyframes[i].keyframe as YamlKeyframeObject;

            keyframeMap.set(keyframe.id, keyframe);
        }

        /* build the keyframes from the timeline object */
        const { timeline } = object;

        for (let i = 0; i < timeline.length; i++) {
            const keyframe = timeline[i].keyframe as YamlTimelineKeyframe;
            const referencedKeyframe = keyframeMap.get(keyframe.id)!;

            const frameValue = this.buildFrameFromNozzleValues(loadedNozzles, referencedKeyframe.values);

            this.keyframes.push({
                frameId: v4(),
                val: keyframe.time,
                frameValue: frameValue,
                rowId: keyframe.track,
                selected: false,
                transition: referencedKeyframe.transition,
                group: this.keyframeGroup,
                style: {
                    fillColor: referencedKeyframe.transition ? "white" : "rgb(79, 218, 79)"
                }
            });
        }

        store.dispatch(setNozzles(loadedNozzles));

        setTimeout(() => {
            this.timelineTime = 0;
            this.timeline.setTime(this.timelineTime);
            this.setModel();
            this.computeFrameInterpolation();
        }, 0);
    }
}
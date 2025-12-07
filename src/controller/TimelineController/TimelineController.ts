import { Timeline, TimelineClickEvent, TimelineElement, TimelineKeyframeChangedEvent, TimelineSelectedEvent, TimelineTimeChangedEvent } from "animation-timeline-js"
import { listenToCustomEvent } from "../events";
import { Frame } from "../../model/model";
import { store } from "../store";
import { setSelectedKeyframeIds, setSelectedRowID } from "../store/appState";
import { v4 } from "uuid"
import { ExtTimelineKeyframe, ExtTimelineModel, ExtTimelineRow, TPrevNextKeyframes } from "./types";
import StoreController from "../store/StoreController";


export default class TimelineController {
    private timeline: Timeline;
    private model: ExtTimelineModel;

    private timelineTime: number;
    private keyframes: Array<ExtTimelineKeyframe>;
    private prevKeyframes: Array<ExtTimelineKeyframe>;
    private nextKeyframes: Array<ExtTimelineKeyframe>;

    private copiedKeyframeIds: Array<string>;
    
    private selectedKeyframeIds: Array<string>;
    private selectedRowID: number;
    private rowCount: number;

    private showPlayer: NodeJS.Timeout | null;

    private activeRowFillColor: string = "rgb(60,60,60)";
    private inactiveRowFillColor: string = "rgb(40,40,40)";

    constructor(timeline: Timeline) {
        this.showPlayer = null;

        this.timelineTime = 0;
        this.keyframes = [];
        this.prevKeyframes = [];
        this.nextKeyframes = [];

        this.selectedKeyframeIds = [];
        this.selectedRowID = 0;
        this.rowCount = 2;
        
        this.copiedKeyframeIds = [];

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
        listenToCustomEvent("playShow", () => this.playShow());
        listenToCustomEvent("pauseShow", () => this.pauseShow());
        listenToCustomEvent("fineForwardShow", () => this.fineForwardShow());
        listenToCustomEvent("stepForwardShow", () => this.stepForwardShow());
        listenToCustomEvent("fastForwardShow", () => this.fastForwardShow());
        listenToCustomEvent("fineBackwardShow", () => this.fineBackwardShow());
        listenToCustomEvent("stepBackwardShow", () => this.stepBackwardShow());
        listenToCustomEvent("fastBackwardShow", () => this.fastBackwardShow());

        listenToCustomEvent("copySelectedKeyframes", () => this.copySelectedKeyframes());
        listenToCustomEvent("pasteCopiedKeyframes", () => this.pasteCopiedKeyframes());

        listenToCustomEvent('deleteSelectedKeyframes', () => this.deleteSelectedKeyframes());
        listenToCustomEvent('saveCurrentKeyframe', () => this.saveCurrentKeyframe());

        listenToCustomEvent('selectPrevRow', () => this.selectPrevRow());
        listenToCustomEvent('selectNextRow', () => this.selectNextRow());

        
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

    private getKeyframesFromTime(time: number): Array<ExtTimelineKeyframe> {
        return this.keyframes.filter((kf) => kf.val === time);
    }

    private selectKeyframesAtTime(time: number, rowsToSelect: Array<number>) {
        let keyframesToSelect = [];

        for (let i = 0; i < this.keyframes.length; i++) {
            if (this.keyframes[i].val === time && rowsToSelect.includes(this.keyframes[i].rowId!)) {
                keyframesToSelect.push(this.keyframes[i]);
                this.timeline.select(this.keyframes[i]);
            }
        }

        this.timeline.select(keyframesToSelect);
    }

    /* get the prev and next keyframes at the current time */
    private getPrevAndNextFrames(time: number): TPrevNextKeyframes {
        let output: TPrevNextKeyframes = { prev: [], next: [] } 

        for (let i = 0; i < this.rowCount; i++) {
            const keyframes = this.getKeyframesFromRow(i);
            let foundKeyframes = false;

            for (let j = -1; j < keyframes.length-1; j++) {
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
                output.prev.push(null);
                output.next.push(null);
            }
        }
        
        return output;
    }

    /* gets the current keyframe at the current time */
    private getKeyframeIndexAt(time: number): number {
        return this.keyframes.findIndex((frame) => frame.val === time && frame.rowId === this.selectedRowID) ?? -1;
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
            selected: true
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

    /* custom events */
    private playShow() {
        if (this.showPlayer != null) return;

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

    private createKeyframeAt(time: number) {
        const { nozzles } = store.getState().appState;

        const frame = new Frame();
        frame.setNozzles(nozzles);

        this.addKeyframe(this.selectedRowID, time, frame);
    }

    private saveCurrentKeyframe() {
        const keyframeIndex = this.getKeyframeIndexAt(this.timelineTime);

        if (keyframeIndex > -1) {
            const { nozzles } = store.getState().appState;
            const copiedNozzles = nozzles.map((n) => n.clone());

            this.keyframes[keyframeIndex].frameValue?.setNozzles(copiedNozzles);
        }
        else {
            this.createKeyframeAt(this.timelineTime);
        }
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

        const prevTime = prevKeyframe.val ?? 0;
        const nextTime = nextKeyframe.val ?? 0;

        /* compute the t value of how far along we are in the frame transitions */
        let t = (this.timelineTime - prevTime) / (nextTime - prevTime);

        if      (t > 1) t = 1;
        else if (t < 0) t = 0;

        const interpolatedFrame = Frame.computeInterpolation(prevKeyframe.frameValue!, nextKeyframe.frameValue!, t);
        return interpolatedFrame;
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
                }
            }

            StoreController.updateNozzleParameter('pumpHeight', resultNozzles[i].pumpHeight, i);
            StoreController.updateNozzleParameter('rgb', resultNozzles[i].rgb, i);

            const event = new CustomEvent(
                `nozzle-${resultNozzles[i].id}`, 
                { detail: { pumpHeight: resultNozzles[i].pumpHeight, hexColor: resultNozzles[i].getHexColor() }}
            );
            window.dispatchEvent(event);
        }
    }

    private handleTimeChange(e: TimelineTimeChangedEvent) {
        this.timelineTime = e.val;
        this.computeFrameInterpolation();
    }
}
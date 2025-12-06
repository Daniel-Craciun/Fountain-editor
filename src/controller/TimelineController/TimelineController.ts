import { Timeline, TimelineClickEvent, TimelineElement, TimelineKeyframeChangedEvent, TimelineSelectedEvent, TimelineTimeChangedEvent } from "animation-timeline-js"
import { listenToCustomEvent } from "../events";
import { Frame } from "../../model/model";
import { store } from "../store";
import { setSelectedKeyframeIds } from "../store/appState";
import { v4 } from "uuid"
import { ExtTimelineKeyframe, ExtTimelineModel, ExtTimelineRow } from "./types";
import StoreController from "../store/StoreController";


export default class TimelineController {
    private timeline: Timeline;
    private model: ExtTimelineModel<Frame>;

    private timelineTime: number;
    private keyframes: Array<ExtTimelineKeyframe<Frame>>;
    private prevKeyframes: Array<ExtTimelineKeyframe<Frame>>;
    private nextKeyframes: Array<ExtTimelineKeyframe<Frame>>;

    private copiedKeyframeIds: Array<string>;
    
    private selectedKeyframeIds: Array<string>;
    private selectedRowID: number;

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

    /* get the prev and next keyframes at the current time */
    private getPrevAndNextFrames(time: number) {
        for (let i = -1; i < this.keyframes.length-1; i++) {
            const prevTime = this.keyframes[i]?.val ?? 0;
            const nextTime = this.keyframes[i+1]?.val ?? prevTime;

            if (time >= prevTime && time <= nextTime) {
                this.prevKeyframes = [this.keyframes[i] ?? this.keyframes[i+1]];
                this.nextKeyframes = [this.keyframes[i+1] ?? this.keyframes[i]];

                return;
            }
        }

        this.prevKeyframes = [];
        this.nextKeyframes = [];
    }

    /* gets the current keyframe at the current time */
    private getKeyframeIndexAt(time: number): number {
        return this.keyframes.findIndex((frame) => frame.val === time) ?? -1;
    }

    /* model functions */
    private setModel() {
        let rows: Array<ExtTimelineRow<Frame>> = [];
        let currentRowId = -1;
        let rowIndex = -1;

        this.sortKeyframes();

        for (let i = 0; i < this.keyframes.length; i++) {
            if (currentRowId != this.keyframes[i].rowId!) {
                rowIndex++;

                currentRowId = this.keyframes[i].rowId!;

                rows.push({
                    style: {
                        fillColor: this.selectedRowID === currentRowId ? this.activeRowFillColor : this.inactiveRowFillColor
                    },
                    id: currentRowId,
                    keyframes: [this.keyframes[i]]
                });
            }
            else {
                rows[rowIndex].keyframes?.push(this.keyframes[i]);
            }
        }

        this.model.rows = rows;
        this.timeline.setModel(this.model);
    }

    private addKeyframe(rowId: number, time: number, frameValue: Frame) {
        this.timeline.deselectAll();

        const addedFrame = new Frame();
        addedFrame.setNozzles(frameValue.cloneNozzles());

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

    /* keyframe functions */
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

            const newKeyframe: ExtTimelineKeyframe<Frame> = {
                ...kf,
                val: kf.val + referenceVal,
                frameValue: kf.frameValue?.clone(),
                frameId: v4(),
                selected: false
            }

            this.keyframes.push(newKeyframe);
        }

        this.setModel();
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

        this.addKeyframe(0, time, frame);
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
            const row = (rowElement.row! as ExtTimelineRow<Frame>);
            const rowId = row.id;
            
            const { nozzles } = store.getState().appState;
            const frame = new Frame();
            frame.setNozzles(nozzles);

            this.addKeyframe(rowId ?? 0, rowElement.val, frame);
        }
    }

    private handleSelectedEvent(e: TimelineSelectedEvent) {
        const frameIds = e.selected.map((frame: ExtTimelineKeyframe<Frame>) => frame.frameId!);
        this.setSelectedKeyframeIds(frameIds);

        if (e.selected.length < 1) return;

        if (e.selected.length === 1) {
            this.timeline.setTime(e.selected[0].val);
            this.computeFrameInterpolation();
        }
    }

    private handleKeyframeChange(e: TimelineKeyframeChangedEvent) {
        this.sortKeyframes();
    }

    private computeFrameInterpolation() {
        if (this.keyframes.length === 0) return;

        this.getPrevAndNextFrames(this.timelineTime);
        const prevTime = this.prevKeyframes[0]?.val ?? 0;
        const nextTime = this.nextKeyframes[0]?.val ?? 0;

        /* compute the t value of how far along we are in the frame transitions */
        let t = (this.timelineTime - prevTime) / (nextTime - prevTime);

        if      (t > 1) t = 1;
        else if (t < 0) t = 0;

        /* interpolate the frames */
        if (this.prevKeyframes.length > 0 && this.nextKeyframes.length > 0) {
            const interpolatedFrame = Frame.computeInterpolation(this.prevKeyframes[0].frameValue!, this.nextKeyframes[0].frameValue!, t);
            const nozzles = interpolatedFrame.getNozzles();

            for (let i = 0; i < nozzles.length; i++) {
                const nozzle = nozzles[i];

                StoreController.updateNozzleParameter('pumpHeight', nozzle.pumpHeight, i);
                StoreController.updateNozzleParameter('rgb', nozzle.rgb, i);
    
                const event = new CustomEvent(`nozzle-${nozzle.id}`, { detail: { pumpHeight: nozzle.pumpHeight, hexColor: nozzle.getHexColor() }});
                window.dispatchEvent(event);
            }
        }
    }

    private handleTimeChange(e: TimelineTimeChangedEvent) {
        this.timelineTime = e.val;
        this.computeFrameInterpolation();
    }
}
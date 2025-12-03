import { Timeline, TimelineClickEvent, TimelineElement, TimelineSelectedEvent, TimelineTimeChangedEvent } from "animation-timeline-js"
import { listenToCustomEvent } from "../events";
import { Frame } from "../../model/model";
import { store } from "../store";
import { setNozzles, setSelectedKeyframeIds } from "../store/appState";
import { v4 } from "uuid"
import { ExtTimelineKeyframe, ExtTimelineModel, ExtTimelineRow, KeyframeLocation } from "./types";



export default class TimelineController {
    private timeline: Timeline;
    private model: ExtTimelineModel<Frame>;

    private timelineKeyframes: Array<ExtTimelineKeyframe<Frame>>;

    private showPlayer: NodeJS.Timeout | null;

    constructor(timeline: Timeline) {
        this.showPlayer = null;

        this.timelineKeyframes = [];

        /* model setup */
        this.model = {
            rows: [
                {
                    id: 0,
                    keyframes: []
                }
            ]
        };

        /* timeline setup */
        this.timeline = timeline;
        this.timeline.setOptions({ snapStep: 50 });
        this.timeline._formatUnitsText = (val) => (val/1000) + "s";
        this.timeline.setModel(this.model);
        this.timeline.setTime(0);

        /* event setup */
        this.initEvents();
    }

    /* events */
    private initEvents() {
        listenToCustomEvent("playShow", () => this.playShow());
        listenToCustomEvent("pauseShow", () => this.pauseShow());
        listenToCustomEvent('deleteSelectedKeyframes', () => this.deleteSelectedKeyframes());
        listenToCustomEvent('createKeyframeAtCurrTime', () => this.createKeyframeAtCurrTime());
        listenToCustomEvent('nozzleUpdated', (nozzleIdx: number) => this.nozzleUpdatedEvent(nozzleIdx));

        this.timeline.onContextMenu((e) => {
            e.args?.preventDefault();
            this.handleRightClick(e);
        });

        this.timeline.onSelected((e) => this.handleSelectedEvent(e));
        this.timeline.onTimeChanged((e) => this.handleTimeChange(e));
    }

    /* model functions */
    private addKeyframe(rowId: number, time: number, frameValue: Frame) {
        this.timeline.deselectAll();

        const addedFrame = new Frame();
        addedFrame.setNozzles(frameValue.cloneNozzles());

        for (let i = 0; i < this.model.rows.length; i++) {
            if (this.model.rows[i].id != rowId) continue;

            const frameId = v4();

            this.model.rows[i].keyframes?.push({
                frameId: frameId,
                val: time,
                selected: true,
                frameValue: addedFrame
            });

            this.model.rows[i].keyframes = this.model.rows[i].keyframes?.sort((a,b) => a.val - b.val);
            
            store.dispatch(setSelectedKeyframeIds([frameId]));
        }
        
        this.timeline.setModel(this.model);
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

    private getKeyframeElement(elements: Array<TimelineElement>): TimelineElement | null {
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].type === "keyframe") {
                return elements[i];
            }
        }

        return null;
    }

    private getKeyframeIndexFromId(id: string): KeyframeLocation {
        const { rows } = this.model;

        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < (rows[i].keyframes?.length ?? 0); j++) {
                if (rows[i].keyframes![j].frameId === id) {
                    return {
                        rowNumber: i,
                        frameNumber: i
                    }
                }
            }
        }

        return {
            rowNumber: -1,
            frameNumber: -1
        }
    }


    /* custom events */
    private playShow() {
        if (this.showPlayer != null) return;

        const timeStep = this.timeline.getOptions().snapStep ?? 100;
        let time = this.timeline.getTime();
        
        this.timeline.setOptions({ timelineDraggable: false });

        this.showPlayer = setInterval(() => {
            time += timeStep;
            this.timeline.setTime(time);
            this.alignTimelineInView(time);
        }, timeStep);
    }
    
    private pauseShow() {
        if (this.showPlayer) {
            clearInterval(this.showPlayer);
            this.showPlayer = null;
        }
        
        this.timeline.setOptions({ timelineDraggable: true });
    }

    private deleteSelectedKeyframes() {
        const { selectedKeyframeIds } = store.getState().appState;
        
        for (let i = 0; i < this.model.rows.length; i++) {
            const { keyframes } = this.model.rows[i];
            
            let newKeyframes: Array<ExtTimelineKeyframe<Frame>> = [];

            for (let j = 0; j < (keyframes?.length ?? 0); j++) {
                if (!selectedKeyframeIds.includes(keyframes![j].frameId!)) {
                    newKeyframes.push(keyframes![j]);
                }
            }

            this.model.rows[i].keyframes = newKeyframes;
        }

        this.timeline.setModel(this.model);

        store.dispatch(setSelectedKeyframeIds([]));
    }

    private createKeyframeAtCurrTime() {
        const { nozzles } = store.getState().appState;

        const copiedNozzles = nozzles.map((n) => n.clone());
        const frame = new Frame();
        frame.setNozzles(copiedNozzles);

        this.addKeyframe(0, this.timeline.getTime(), frame);
    }

    private nozzleUpdatedEvent(nozzleIdx: number) {
        const { selectedKeyframeIds } = store.getState().appState;

        if (selectedKeyframeIds.length === 1) {
            const { rowNumber, frameNumber } = this.getKeyframeIndexFromId(selectedKeyframeIds[0]);
            const nozzle = store.getState().appState.nozzles[nozzleIdx];

            this.model.rows[rowNumber].keyframes![frameNumber].frameValue?.updateNozzle(nozzle);
        }
    }

    /* timeline display */
    private alignTimelineInView(time: number) {
        const fromPx = this.timeline.scrollLeft;
        const toPx = this.timeline.scrollLeft + this.timeline.getClientWidth();

        let positionInPixels = this.timeline.valToPx(time) + this.timeline._leftMargin();
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
        store.dispatch(setSelectedKeyframeIds(frameIds));

        if (e.selected.length < 1) return;

        if (e.selected.length === 1) {
            this.timeline.setTime(e.selected[0].val);

            const nozzles = (e.selected[0] as ExtTimelineKeyframe<Frame>).frameValue!.getNozzles();
            store.dispatch(setNozzles([...nozzles]));
        }
    }

    private handleTimeChange(e: TimelineTimeChangedEvent) {
        console.log(e);
    }
}
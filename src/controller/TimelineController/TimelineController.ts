import { Timeline, TimelineKeyframe, TimelineModel, TimelineRow } from "animation-timeline-js"
import { listenToCustomEvent } from "../events";

interface ExtTimelineKeyframe<T> extends TimelineKeyframe {
    frameValue?: T;
}

interface ExtTimelineRow<T> extends TimelineRow {
    keyframes?: Array<ExtTimelineKeyframe<T>>;
    title?: string;
}

interface ExtTimelineModel<T> extends TimelineModel {
    rows: Array<ExtTimelineRow<T>>;
}

export default class TimelineController {
    private timeline: Timeline;

    private showPlayer: NodeJS.Timeout | null;

    constructor(timeline: Timeline) {
        this.showPlayer = null;

        /* timeline setup */
        this.timeline = timeline;
        this.timeline.setOptions({ snapStep: 50 });
        this.timeline._formatUnitsText = (val) => val + "ms";

        const model: ExtTimelineModel<number> = {
            rows: [{
                title: "Track 1",
                keyframes: [
                    {
                        val: 1000,
                        frameValue: 12
                    },
                    {
                        val: 0,
                        frameValue: 100
                    }
                ]
            }]
        }

        this.timeline.setModel(model);
        this.timeline.setTime(0);

        /* event setup */
        this.initEvents();
    }

    private initEvents() {
        listenToCustomEvent("playShow", () => this.playShow())
        listenToCustomEvent("pauseShow", () => this.pauseShow())
    }


    /* show events */
    private playShow() {
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
}
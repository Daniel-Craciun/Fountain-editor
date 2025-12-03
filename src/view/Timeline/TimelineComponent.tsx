import { useEffect, useRef } from "react";
import { Timeline } from "animation-timeline-js";
import TimelineController from "../../controller/TimelineController/TimelineController";
import { useDispatch, useSelector } from "react-redux";
import { setTimelineController } from "../../controller/store/appData";
import { getNozzles } from "../../controller/store/appState";


export default function TimelineComponent() {
    const timelineElRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        let timeline: Timeline | null = null;

        // On component init
        if (timelineElRef.current) {
            timeline = new Timeline({ id: timelineElRef.current });
            const timelineController = new TimelineController(timeline);
            dispatch(setTimelineController(timelineController));
        }

        // cleanup on component unmounted.
        return () => timeline?.dispose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timelineElRef.current]);

    return <div style={{ width: "100%" }} ref={timelineElRef} />;
}
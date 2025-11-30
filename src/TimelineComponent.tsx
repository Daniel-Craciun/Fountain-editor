import { useEffect, useRef, useState } from "react";
import { Timeline, TimelineModel } from "animation-timeline-js";
type Props = {
  time?: number;
  model: TimelineModel;
};


function generateHTMLOutlineListNodes(timeline: Timeline, rows: any) {
	const outlineContainer = document.getElementById('outline-container');
    var options = timeline.getOptions();
    var headerElement = document.getElementById('outline-header');
    if (!headerElement) {
        return;
    }
    headerElement.style.maxHeight = headerElement.style.minHeight = options.headerHeight + 'px';
    // headerElement.style.backgroundColor = options.headerFillColor;
    if (!outlineContainer) {
        console.log("Error: Cannot find html element to output outline/tree view")
        return;
    }
    outlineContainer.innerHTML = '';

    rows.forEach(function (row, index) {
        var div = document.createElement('div');
        div.classList.add('outline-node');
        const h = (row.style ? row.style.height : 0) || (options.rowsStyle ? options.rowsStyle.height : 0);
        div.style.maxHeight = div.style.minHeight = h + 'px';
        div.style.marginBottom = ((options.rowsStyle ? options.rowsStyle.marginBottom : 0) || 0) + 'px';
        div.innerText = row.title || 'Track ' + index;
        div.id = div.innerText;
        var alreadyAddedWithSuchNameElement = document.getElementById(div.innerText)
        // Combine outlines with the same name:
        if (alreadyAddedWithSuchNameElement) {
            var increaseSize = Number.parseInt(alreadyAddedWithSuchNameElement.style.maxHeight) + h;
            alreadyAddedWithSuchNameElement.style.maxHeight = alreadyAddedWithSuchNameElement.style.minHeight = increaseSize + 'px';

            return;
        }
        if (outlineContainer) {
            outlineContainer.appendChild(div);
        }

    });
}

function TimelineComponent(props: Props) {
  const { model, time } = props;
  const timelineElRef = useRef<HTMLDivElement>(null);
  const [timeline, setTimeline] = useState<Timeline>();

  useEffect(() => {
    let newTimeline: Timeline | null = null;
    // On component init
    if (timelineElRef.current) {
      newTimeline = new Timeline({ id: timelineElRef.current });
      newTimeline._formatUnitsText = (val) => { return (val) + ' ms'; };
      // Here you can subscribe on timeline component events
      setTimeline(newTimeline);

      newTimeline.setOptions({ snapStep: 20 })

       generateHTMLOutlineListNodes(newTimeline!, [{
                selected: false,
                draggable: false,

                keyframes: [
                    {
                        val: 40,
                        shape: 'rhomb',
                    },
                    {
                        shape: 'rhomb',
                        val: 3000,
                        selected: false,
                    },
                ],
            }]);
    }

    // cleanup on component unmounted.
    return () => newTimeline?.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timelineElRef.current]);

  // Example to subscribe and pass model or time update:
  useEffect(() => {
    timeline?.setModel(model);
  }, [model, timeline]);

  // Example to subscribe and pass model or time update:
  useEffect(() => {
    if (time || time === 0) {
      timeline?.setTime(time);
    }
  }, [time, timeline]);

  return <div style={{ width: "100%", minHeight: 300 }} ref={timelineElRef} />;
}
export default TimelineComponent;
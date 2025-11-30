import { Timeline, TimelineRow } from "animation-timeline-js"

export default class TimelineController {
    private timeline: Timeline;

    constructor(timeline: Timeline) {
        this.timeline = timeline;
        this.timeline.setOptions({ snapStep: 100 });
        this.timeline.setModel({ rows: [] });
        this.timeline.setTime(0);
    }

    public generateHTMLOutlineListNodes(rows: Array<TimelineRow>) {
        const outlineContainer = document.getElementById('outline-container');
        const options = this.timeline.getOptions();
        const headerElement = document.getElementById('outline-header');

        if (!headerElement) {
            return;
        }

        headerElement.style.maxHeight = headerElement.style.minHeight = options.headerHeight + 'px';
        
        if (!outlineContainer) {
            console.log("Error: Cannot find html element to output outline/tree view")
            return;
        }

        outlineContainer.innerHTML = '';

        rows.forEach(function (row, index) {
            const div = document.createElement('div');
            div.classList.add('outline-node');

            const h = (row.style ? row.style.height : 0) || (options.rowsStyle ? options.rowsStyle.height : 0);

            div.style.maxHeight = div.style.minHeight = h + 'px';
            div.style.marginBottom = ((options.rowsStyle ? options.rowsStyle.marginBottom : 0) || 0) + 'px';
            // @ts-ignore
            div.innerText = row.title || 'Track ' + index;
            div.id = div.innerText;

            const alreadyAddedWithSuchNameElement = document.getElementById(div.innerText)
            // Combine outlines with the same name:
            if (alreadyAddedWithSuchNameElement) {
                var increaseSize = Number.parseInt(alreadyAddedWithSuchNameElement.style.maxHeight) + h!;
                alreadyAddedWithSuchNameElement.style.maxHeight = alreadyAddedWithSuchNameElement.style.minHeight = increaseSize + 'px';

                return
            }

            if (outlineContainer) {
                outlineContainer.appendChild(div);
            }
        });
    }
}
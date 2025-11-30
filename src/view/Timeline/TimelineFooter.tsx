import TimelineComponent from "./TimelineComponent";

export default function TimelineFooter() {
    return (
        <div>
            <footer style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                <div className="outline">
                    <div className="outline-header" id="outline-header"></div>
                    <div className="outline-scroll-container" id="outline-scroll-container">
                        <div className="outline-items" id="outline-container"></div>
                    </div>
                </div>
                
                <TimelineComponent></TimelineComponent>
            </footer>
        </div>
    )
}
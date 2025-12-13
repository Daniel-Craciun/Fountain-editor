import Header from "./view/Header/Header";
import NozzleView from "./view/NozzleView/NozzleView";
import Sidebar from "./view/Sidebar/Sidebar";
import TimelineFooter from "./view/Timeline/TimelineFooter";
import { ToastContainer } from "react-toastify";

export default function App() {
	return (
		<>
			<Header />
			<NozzleView />
			<Sidebar />
			<TimelineFooter />
			<ToastContainer />
		</>
	)
}
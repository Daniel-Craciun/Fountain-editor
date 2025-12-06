import { dispatchCustomEvent } from "./controller/events";
import Header from "./view/Header/Header";
import NozzleView from "./view/NozzleView/NozzleView";
import Sidebar from "./view/Sidebar/Sidebar";
import TimelineFooter from "./view/Timeline/TimelineFooter";
import { ToastContainer } from "react-toastify";
import { createToast } from "./view/toast";
import { useEffect } from "react";

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
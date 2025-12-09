import Header from "./view/Header/Header";
import NozzleView from "./view/NozzleView/NozzleView";
import Sidebar from "./view/Sidebar/Sidebar";
import TimelineFooter from "./view/Timeline/TimelineFooter";
import { ToastContainer } from "react-toastify";
import yaml from 'js-yaml';

export default function App() {
	// const object = {
	// 	config: {
	// 		Y5: {
	// 			name: "fountain_nozzle_unit_<mac>",
	// 			calibration: 1
	// 		}
	// 	},
	// 	keyframes: [
	// 		{
	// 			keyframe: {
	// 				id: 0,
	// 				transition: false,
	// 				Y5: {
	// 					pump: 12,
	// 					light: [100, 255, 255, 255]
	// 				}
	// 			}
	// 		}
	// 	],
	// 	timeline: [
	// 		{
	// 			keyframe: {
	// 				id: 0,
	// 				time: 0
	// 			}
	// 		},
	// 		{
	// 			keyframe: {
	// 				id: 1,
	// 				time: 200
	// 			}
	// 		}
	// 	]
	// }

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
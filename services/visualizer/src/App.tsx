import { LegacyVisualizer } from "./components/LegacyVisualizer/LegacyVisualizer";
import { useParams } from "react-router-dom";

function App() {
	const { type } = useParams();
	switch (type) {
		case "visualization":
			return <LegacyVisualizer />;
	}
}

export default App;

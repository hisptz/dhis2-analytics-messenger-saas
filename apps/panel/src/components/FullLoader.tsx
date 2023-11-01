import { CircularProgress } from "@mui/material";

export function FullLoader() {
	return (
		<div className="h-full w-full m-auto">
			<CircularProgress />
		</div>
	);
}

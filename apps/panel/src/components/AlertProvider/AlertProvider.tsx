"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useAlertContext } from "../../Context/AlertStore";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
	function Alert(props, ref) {
		return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
	},
);

export default function CustomAlertStack() {
	const { alerts } = useAlertContext();
	return (
		<Stack spacing={2} sx={{ width: "100%" }}>
			{alerts.map((alert) => (
				<Snackbar
					key={alert.index}
					open={true}
					autoHideDuration={alert.duration ?? 6000}
					anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				>
					<Alert severity={alert.type}>{alert.message}</Alert>
				</Snackbar>
			))}
		</Stack>
	);
}

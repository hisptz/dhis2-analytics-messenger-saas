"use client";

import { SnackbarProvider } from "notistack";

export function CustomSnackbarProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SnackbarProvider
			maxSnack={4}
			anchorOrigin={{
				horizontal: "center",
				vertical: "bottom",
			}}
		>
			{children}
		</SnackbarProvider>
	);
}

"use client";

import {
	createContext,
	useContext,
	Dispatch,
	SetStateAction,
	useState,
} from "react";

export type Alert = {
	index: number;
	message: string;
	duration?: number;
	type: "success" | "error" | "info";
};

interface ContextProps {
	alerts: Alert[];
	setAlerts: Dispatch<SetStateAction<Alert[]>>;
}

const AlertContext = createContext<ContextProps>({
	alerts: [],
	setAlerts: () => {},
});

export function AlertContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [alerts, setAlerts] = useState<Alert[]>([]);
	return (
		<AlertContext.Provider value={{ alerts, setAlerts }}>
			{children}
		</AlertContext.Provider>
	);
}

export function useAlertContext() {
	const context = useContext(AlertContext);
	if (!context) {
		throw new Error(
			"useAlertContext must be used within a AlertContextProvider",
		);
	}

	return context;
}

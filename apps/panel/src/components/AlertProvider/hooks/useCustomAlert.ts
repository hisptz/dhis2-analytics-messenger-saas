"use client";

import { Alert, useAlertContext } from "../../../Context/AlertStore";

type UseCustomAlertResponse = {
	setAlert: (alerts: Alert) => void;
};

export const useCustomAlert = (): UseCustomAlertResponse => {
	const { alerts, setAlerts } = useAlertContext();

	const addAlert = (alert: Alert) => {
		const updatedAlertList = [...alerts, alert];
		setAlerts(updatedAlertList);
	};

	return {
		setAlert: addAlert,
	};
};

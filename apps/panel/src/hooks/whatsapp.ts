import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import Parse from "parse";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useWhatsappClientStatus(client: Parse.Object | null) {
	const [status, setStatus] = useState();
	const [error, setError] = useState();
	const [qrCode, setQrCode] = useState();
	const token = useMemo(() => client?.get("sessionId"), [client]);
	useEffect(() => {
		if (token) {
			const url = `${process.env.NEXT_PUBLIC_MESSAGING_URL}/clients/whatsapp/${token}/status`;
			const socket = io(url, {
				path: `${process.env.NEXT_PUBLIC_MESSAGING_MOUNT_PATH}`,
				query: {
					session: token,
					client: "whatsapp",
				},
			});
			socket.on("status", setStatus);
			socket.on("error", setError);
			return () => {
				socket.off("status", setStatus);
				socket.off("error", setError);
				socket.disconnect();
				socket.close();
			};
		}
	}, [token]);
	return {
		status,
		qrCode,
		error,
	};
}

export function useWhatsappClient(instance: Parse.Object) {
	const fetchClient = async () => {
		return (
			(await new Parse.Query("WhatsappClient")
				.equalTo("dhis2Instance", instance)
				.first()) ?? null
		);
	};

	const { data, isLoading, isError, error, refetch } = useSuspenseQuery({
		queryKey: ["whatsapp", instance.id],
		queryFn: fetchClient,
		retry: false,
	});

	return {
		data,
		isLoading,
		isError,
		error,
		refetch,
	};
}

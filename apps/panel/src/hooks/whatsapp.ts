import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

export function useWhatsappClientStatus(client: Parse.Object) {
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

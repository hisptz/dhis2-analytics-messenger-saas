import { Server } from "socket.io";
import { WhatsappClient } from "../clients/whatsapp/whatsapp";
import { SocketState } from "@wppconnect-team/wppconnect";

let io: Server;

export function initWebsocket(server: any) {
	io = new Server(server, {
		cors: {
			origin: "*",
		},
		path: `${process.env.MESSAGING_MOUNT_PATH ?? ""}/socket.io/`,
	});
}

export function registerWebhooks() {
	io.of(/\/clients\/whatsapp\/[a-zA-Z0-9_.-]*\/init$/).on(
		"connection",
		(socket) => {
			const params = socket.handshake.query;

			const session = params.session as string;
			const name = params.name as string;
			const whatsappClient = new WhatsappClient(session);
			whatsappClient.setup({
				name,
				qrCallback: (...args) => {
					socket.emit("qrCode", ...args);
				},
				statusCallback: (...args) => {
					socket.emit("status", ...args);
				},
				loadingCallback: (...args) => {
					socket.emit("loading", ...args);
				},
				onSuccess: () => {
					socket.emit("success");
				},
				onError: () => {
					socket.emit("error");
				},
			});
		},
	);

	io.of(/\/clients\/whatsapp\/[a-zA-Z0-9_.-]*\/status$/).on(
		"connection",
		async (socket) => {
			const params = socket.handshake.query;
			const session = params.session as string;
			const whatsappClient = WhatsappClient.get(session);

			if (!whatsappClient) {
				socket.emit(
					"error",
					"Could not get specified client for the specified session",
				);
			}
			socket.emit("status", await whatsappClient?.getStatus());
			const statusCallback = async (socketState: SocketState) => {
				socket.emit("status", socketState);
				if (socketState !== SocketState.CONNECTED) {
					socket.emit(
						"qrCode",
						await whatsappClient.client.getQrCode(),
					);
				}
			};
			const interfaceChangeCallback = (args: any) => {
				socket.emit("interfaceChange", args);
			};
			whatsappClient.setStateCallback(statusCallback);
			whatsappClient.setStateCallback(interfaceChangeCallback);
		},
	);
}

export { io };

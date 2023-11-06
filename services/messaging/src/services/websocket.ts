import { Server } from "socket.io";
import { WhatsappClient } from "../clients/whatsapp/whatsapp";

let io: Server;

export function initWebsocket(server: any) {
	io = new Server(server, {
		cors: {
			origin: "*",
		},
	});
}

export function registerWebhooks() {
	io.of(/^\/clients\/whatsapp\/[a-zA-Z0-9_.-]*\/init$/).on(
		"connection",
		(socket) => {
			const params = socket.handshake.query;

			const session = params.session as string;
			const name = params.name as string;
			const whatsappClient = new WhatsappClient(session);
			whatsappClient.setup({
				name,
				qrCallback: (...args) => {
					console.log(args);
					console.log(session);
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
}

export { io };

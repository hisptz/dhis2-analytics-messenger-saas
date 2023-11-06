import axios from "axios";

const messagingClient = axios.create({
	baseURL: `${process.env.MESSAGING_SERVER_URL ?? "http://localhost:3002"}`,
});

export { messagingClient };

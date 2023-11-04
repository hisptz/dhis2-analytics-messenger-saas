import { BaseClient } from "../base";
import {
	CatchQRCallback,
	create,
	Message,
	SocketState,
	Whatsapp,
} from "@wppconnect-team/wppconnect";
import { activeWhatsappClients, removeClient } from "../../globals/whatsapp";
import { find } from "lodash";
import { WhatsappContact, WhatsappMessage } from "schemas";
import { asyncify, mapSeries } from "async";

export class WhatsappClient extends BaseClient<Whatsapp> {
	session: string;

	constructor(session: string) {
		super();
		this.session = session;
	}

	static get(session: string) {
		return find(activeWhatsappClients, ["session", session]);
	}

	async init(): Promise<WhatsappClient> {
		const whatsapp = await create({
			session: this.session,
			waitForLogin: false,
			folderNameToken: "clients/whatsapp",
			debug: false,
			updatesLog: false,
		});
		if (whatsapp) {
			this.client = whatsapp;
			await this.client.start();
			activeWhatsappClients.push(this);
			return this;
		}
		throw Error(`Could not initialize WhatsApp session ${this.session}`);
	}

	async stop(): Promise<WhatsappClient> {
		const success = await this.client.close();
		if (success) {
			removeClient(this.session);
			return this;
		}
		throw Error(`Could not stop the client with session ${this.session}`);
	}

	async setup({
		name,
		qrCallback,
		loadingCallback,
		onSuccess,
		onError,
	}: {
		name: string;
		qrCallback: CatchQRCallback;
		loadingCallback: (percent: number, message: string) => void;
		onSuccess: () => void;
		onError: (e: any) => void;
	}): Promise<BaseClient<Whatsapp>> {
		try {
			this.client = await create({
				session: this.session,
				deviceName: `${name} WhatsApp Client`,
				catchQR: qrCallback,
				folderNameToken: "clients/whatsapp",
				onLoadingScreen: loadingCallback,
				logQR: false,
			});
		} catch (e: any) {
			onError(e);
		}
		await this.client.start();
		activeWhatsappClients.push(this);
		onSuccess();
		return Promise.resolve(this);
	}

	onMessage(): Promise<void> {
		return Promise.resolve();
	}

	async getStatus(): Promise<SocketState> {
		return await this.client.getConnectionState();
	}

	getChatId(contact: WhatsappContact): string {
		const { type, identifier } = contact;
		if (type === "individual") {
			return identifier.includes("@c.us")
				? identifier
				: `${contact.identifier}@c.us`;
		} else {
			return identifier.includes("@g.us")
				? identifier
				: `${contact.identifier}@g.us`;
		}
	}

	async sendMessage(messagePayload: WhatsappMessage): Promise<Message[]> {
		const { to, message } = messagePayload;

		const type = message.type;
		const chatIds = to.map(this.getChatId);

		switch (type) {
			case "text":
				return await mapSeries(
					chatIds,
					asyncify(async (to: string) =>
						this.client.sendText(to, message.text),
					),
				);
			case "image":
				return await mapSeries(
					chatIds,
					asyncify(async (to: string) =>
						this.client.sendImageFromBase64(
							to,
							message.image,
							"",
							message.text,
						),
					),
				);
			default:
				throw Error(`${type} messages are not supported yet.`);
		}
	}

	async start(): Promise<BaseClient<Whatsapp>> {
		await this.client.start();
		return this;
	}
}

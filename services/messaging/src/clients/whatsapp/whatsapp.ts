import { BaseClient } from "../base";
import path from "path";
import {
	CatchQRCallback,
	Chat,
	create,
	Message,
	SocketState,
	StatusFindCallback,
	Whatsapp,
} from "@wppconnect-team/wppconnect";
import { activeWhatsappClients, removeClient } from "../../globals/whatsapp";
import { find, head } from "lodash";
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
			puppeteerOptions: {
				userDataDir: path.join(
					__dirname,
					`../../../clients/whatsapp/${head(
						this.session.split("-"),
					)}`,
				),
			},
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
		statusCallback,
	}: {
		name: string;
		qrCallback: CatchQRCallback;
		statusCallback: StatusFindCallback;
		loadingCallback: (percent: number, message: string) => void;
		onSuccess: () => void;
		onError: (e: any) => void;
	}): Promise<BaseClient<Whatsapp>> {
		try {
			this.client = await create({
				session: this.session,
				deviceName: `${name} WhatsApp Client`,
				statusFind: statusCallback,
				catchQR: qrCallback,
				waitForLogin: true,
				debug: process.env.NODE_ENV === "development",
				autoClose: 60 * 2 * 1000,
				devtools: process.env.NODE_ENV === "development",
				folderNameToken: `clients/whatsapp/${head(
					this.session.split("-"),
				)}`,
				puppeteerOptions: {
					userDataDir: path.join(
						__dirname,
						`../../../clients/whatsapp/${head(
							this.session.split("-"),
						)}`,
					),
				},
				poweredBy: "DHIS2 Analytics Messenger",
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

	async getGroups(): Promise<Array<Chat>> {
		return await this.client.listChats({ onlyGroups: true });
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

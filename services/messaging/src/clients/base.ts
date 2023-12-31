export abstract class BaseClient<ClientType> {
	client?: ClientType;

	abstract init(
		initData: Record<string, any>,
	): Promise<BaseClient<ClientType>>;

	abstract start(): Promise<BaseClient<ClientType>>;

	abstract sendMessage(messagePayload: unknown): Promise<unknown>;

	abstract onMessage(): Promise<void>;
}

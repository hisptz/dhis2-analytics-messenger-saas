export type ParseField = {
	name: string;
	type: Parse.Schema.TYPE;
	options?: Parse.Schema.FieldOptions;
	targetClass?: string;
};

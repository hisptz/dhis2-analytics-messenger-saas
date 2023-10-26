import { ParseField } from "../types";

export class ParseSchema extends Parse.Schema {
	fields: ParseField[];

	constructor(className: string, fields: ParseField[]) {
		super(className);
		this.fields = fields;
		this.init();
	}

	init() {
		this.fields.forEach(({ name, type, options, targetClass }) => {
			if (type === "Pointer") {
				if (!targetClass) {
					throw Error(
						`Field ${name} is marked as a pointer but does not have a target class.`,
					);
				}
				this.addPointer(name, targetClass, options);
				return;
			}
			this.addField(name, type, options);
		});
	}
}

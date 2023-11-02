import { ParseField } from "../cloud/types";
import { fromPairs } from "lodash";

export function generateSchema(
	className: string,
	fields: ParseField[],
	options?: {
		protectedFields?: Parse.Schema.CLP["protectedFields"];
		overrideCLP?: true;
	},
) {
	const { protectedFields, overrideCLP } = options ?? {};
	return {
		className,
		fields: fromPairs(fields.map(({ name, ...rest }) => [name, rest])),
		classLevelPermissions: {
			...(overrideCLP
				? {}
				: {
						find: { requiresAuthentication: true },
						count: { requiresAuthentication: true },
						get: { requiresAuthentication: true },
						update: { requiresAuthentication: true },
						create: { requiresAuthentication: true },
						delete: { requiresAuthentication: true },
				  }),
			protectedFields: protectedFields ?? {},
		} as Parse.Schema.CLP,
	};
}

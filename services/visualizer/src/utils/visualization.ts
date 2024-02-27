import { ALL_DYNAMIC_DIMENSION_ITEMS } from "@dhis2/analytics";

export const removeItemAllFromAxisItems = (axis: Record<string, any>[]) =>
	(axis || []).map((ai) => ({
		...ai,
		items: ai?.items?.filter(
			(item: Record<string, any>) =>
				item.id !== ALL_DYNAMIC_DIMENSION_ITEMS,
		),
	}));

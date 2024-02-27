import { Axios } from "axios";
import {
	JsonMap,
	Query,
	QueryExecuteOptions,
	ResolvedResourceQuery,
} from "./types";
import {
	reduceResponses,
	resolveDynamicQuery,
	validateResourceQueries,
} from "./utils";

export class CustomDataEngine {
	client: Axios;

	constructor(client: Axios) {
		this.client = client;
	}

	async query(
		query: Query,
		{ variables, signal, onComplete, onError }: QueryExecuteOptions,
	): Promise<JsonMap> {
		const names = Object.keys(query);
		const queries = names
			.map((name) => query[name])
			.map((query) => {
				if (variables) {
					return resolveDynamicQuery(query, variables);
				} else {
					return query as ResolvedResourceQuery;
				}
			});

		validateResourceQueries(queries, names);

		const requests = queries.map((query) => {
			const { resource, id, data, params } = query;
			const url = id ? `${resource}/${id}` : resource;
			const options = {
				params,
				data,
				signal,
			};
			return this.client.get(url, options);
		});

		try {
			const responses = await Promise.all(requests);
			const reducedResponses = reduceResponses(
				responses.map((res) => res.data),
				names,
			);
			console.log(reducedResponses);
			if (onComplete) {
				onComplete(reducedResponses);
			}
			return reducedResponses;
		} catch (error) {
			onError && onError(error);
			throw error;
		}
	}
}

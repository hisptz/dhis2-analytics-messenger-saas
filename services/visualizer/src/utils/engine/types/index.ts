import { FetchError } from "@dhis2/app-runtime";

export declare type JsonValue =
	| boolean
	| number
	| string
	| null
	| JsonArray
	| JsonMap;

export interface JsonMap {
	[key: string]: JsonValue;
}

export type JsonArray = Array<JsonValue>;

export declare type QueryVariables = Record<string, any>;
export declare type PossiblyDynamic<Type, InputType> =
	| Type
	| ((input: InputType) => Type);
declare type QueryParameterSingularValue = string | number | boolean;

interface QueryParameterAliasedValue {
	[name: string]: QueryParameterSingularValue;
}

declare type QueryParameterSingularOrAliasedValue =
	| QueryParameterSingularValue
	| QueryParameterAliasedValue;
declare type QueryParameterMultipleValue =
	QueryParameterSingularOrAliasedValue[];
export declare type QueryParameterValue =
	| QueryParameterSingularValue
	| QueryParameterAliasedValue
	| QueryParameterMultipleValue
	| undefined;

export interface QueryParameters {
	pageSize?: number;

	[key: string]: QueryParameterValue;
}

export interface ResourceQuery {
	resource: string;
	id?: PossiblyDynamic<string, QueryVariables>;
	data?: PossiblyDynamic<any, QueryVariables>;
	params?: PossiblyDynamic<QueryParameters, QueryVariables>;
}

export interface ResolvedResourceQuery extends ResourceQuery {
	id?: string;
	data?: any;
	params?: QueryParameters;
}

export declare type Query = Record<string, ResourceQuery>;
export declare type QueryResult = JsonMap;

export interface QueryOptions<TQueryResult = QueryResult> {
	variables?: QueryVariables;
	onComplete?: (data: TQueryResult) => void;
	onError?: (error: FetchError) => void;
	lazy?: boolean;
}

export declare type FetchType =
	| "create"
	| "read"
	| "update"
	| "json-patch"
	| "replace"
	| "delete";
export interface QueryExecuteOptions {
	variables?: QueryVariables;
	signal?: AbortSignal;
	onComplete?: (data: any) => void;
	onError?: (error: FetchError) => void;
}

export class InvalidQueryError extends Error {
	public type = "invalid-query";
	public details: string[];
	public constructor(errors: string[]) {
		super(`Invalid query\n${errors.map((e) => " - " + e).join("\n")}`);
		this.details = errors;
	}
}

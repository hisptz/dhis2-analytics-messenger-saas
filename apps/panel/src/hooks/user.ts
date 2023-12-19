"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ParseClient } from "@/utils/parse/client";

export function useUserIsAdmin() {
	//Check if user is admin
	async function getUserIsAdmin() {
		const role = await new ParseClient.Query(ParseClient.Role)
			.equalTo("name", "admin")
			.first();
		if (!role) {
			return false;
		}
		const user = ParseClient.User.current();
		const userInRole = await role.getUsers().query().get(user!.id);
		return !!userInRole;
	}

	const { data, isLoading } = useSuspenseQuery({
		queryKey: ["role"],
		queryFn: getUserIsAdmin,
	});

	return {
		data,
		isLoading,
	};
}

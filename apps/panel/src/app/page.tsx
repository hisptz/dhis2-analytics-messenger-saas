"use client";

import { ParseClient } from "@/utils/parse/client";
import { useRouter } from "next/navigation";
import { useEffectOnce } from "usehooks-ts";
import { FullLoader } from "@/components/FullLoader";
import { useUserIsAdmin } from "@/app/hooks/user";

export default function Router() {
	const { replace } = useRouter();
	const user = ParseClient.User.current();
	const { data: isUserAdmin } = useUserIsAdmin();

	useEffectOnce(() => {
		if (user) {
			if (isUserAdmin) {
				replace("/users");
				return;
			}
			replace("/management");
		} else {
			replace("/login");
		}
	});

	return <FullLoader />;
}

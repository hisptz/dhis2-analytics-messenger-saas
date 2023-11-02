"use client";

import { ParseClient } from "@/utils/parse/client";
import { useRouter } from "next/navigation";
import { useEffectOnce } from "usehooks-ts";
import { FullLoader } from "@/components/FullLoader";

export default function Router() {
	const { replace } = useRouter();
	const user = ParseClient.User.current();

	useEffectOnce(() => {
		if (user) {
			replace("/management");
		} else {
			replace("/login");
		}
	});

	return <FullLoader />;
}

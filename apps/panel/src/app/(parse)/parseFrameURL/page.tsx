"use client";
import { useSearchParams } from "next/navigation";

export default function VerifyEmailSuccess() {
	const params = useSearchParams();

	const token = params.get("token");
	const apps = params.get("apps");
	const username = params.get("username");
	const link = params.get("link");

	return (
		<div>
			<h1>Parse frame url</h1>
		</div>
	);
}

"use server";

import { redirect } from "next/navigation";

const serverUrl = process.env.NEXT_PARSE_BASE_URL ?? "http://localhost:4000";

export async function submitResetPasswordRequest(
	data: Record<string, any>,
	{ appId: id }: { appId: string },
) {
	const formData = new URLSearchParams(data);

	const url = `${serverUrl}/apps/${id}/request_password_reset`;
	console.log({ url });
	const response = await fetch(url, {
		method: "POST",
		body: formData,
		headers: {
			"content-type": "application/x-www-form-urlencoded",
		},
		redirect: "follow",
	});
	redirect(response.url);
}

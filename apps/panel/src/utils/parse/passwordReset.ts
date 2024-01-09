"use server";

import { ParseServer } from "@/utils/parse/server";
import { redirect } from "next/navigation";

export async function submitResetPasswordRequest(
	data: Record<string, any>,
	{ appId: id }: { appId: string },
) {
	const formData = new URLSearchParams(data);

	const url = `${ParseServer.serverURL}/apps/${id}/request_password_reset`;
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

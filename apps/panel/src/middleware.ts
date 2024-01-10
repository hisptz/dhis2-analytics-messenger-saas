import { NextRequest, NextResponse } from "next/server";

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|login|signup|verifyEmail|waitingApproval|choosePassword|invalidVerificationLink|invalidLink|passwordResetSuccess|linkSendSuccess).*)",
	],
};

export async function middleware(request: NextRequest) {
	const baseURL = `${process.env.NEXT_PARSE_BASE_URL}`;
	const sessionToken = request.cookies.get("sessionToken");
	if (!sessionToken) {
		//Not logged in
		return NextResponse.redirect(new URL("login", request.url));
	}

	const token = sessionToken.value;
	const url = `${baseURL}/users/me`;
	const appId = process.env.NEXT_PUBLIC_PARSE_APP_ID ?? "DAM-AUTH";
	const headers = {
		"X-Parse-Application-Id": appId,
		"X-Parse-Session-Token": token,
	};

	const response = await fetch(url, { headers });
	if (response.status === 401) {
		request.cookies.delete("sessionToken");
		return NextResponse.redirect(new URL("login", request.url));
	}
	const data = await response.json();
	if (data.code === 209) {
		request.cookies.delete("sessionToken");
		return NextResponse.redirect(new URL("login", request.url));
	}

	if (data.username !== "admin" && !data.approved) {
		return NextResponse.redirect(new URL("waitingApproval", request.url));
		//Not approved
	}

	return NextResponse.next();
}

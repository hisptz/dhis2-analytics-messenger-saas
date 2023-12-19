import { NextRequest, NextResponse } from "next/server";
import { ParseServer } from "@/utils/parse/server";

export async function GET(request: NextRequest) {
	const sessionToken = request.cookies.get("sessionToken");

	if (!sessionToken) {
		return NextResponse.redirect(new URL("login", request.url));
	}
	try {
		const token = sessionToken.value;
		const user = await ParseServer.User.become(token);
		if (user) {
			const adminRole = await new ParseServer.Query(ParseServer.Role)
				.equalTo("name", "admin")
				.first();

			if (!adminRole) {
				return NextResponse.redirect(new URL("login", request.url));
			}

			const userInAdmin = await adminRole!
				.getUsers()
				.query()
				.get(user.id);

			if (!userInAdmin) {
				return NextResponse.redirect(
					new URL("management", request.url),
				);
			}

			return NextResponse.redirect(new URL("users", request.url));
		}
	} catch (e) {
		return NextResponse.redirect(new URL("login", request.url));
	}
}

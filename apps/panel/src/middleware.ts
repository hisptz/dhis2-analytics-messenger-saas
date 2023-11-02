// export function middleware(req: NextRequest) {
// 		//Check auth
// 		if (some(["dashboard"], (route) => {
// 				return req.nextUrl.pathname.includes(route)
// 		})) {
// 				const baseUrl = req.nextUrl.basePath;
// 				const token = cookies().get("_user")?.value;
//
// 				if (!token) {
// 						return NextResponse.redirect(new URL(`${baseUrl}/auth/login`, req.url))
// 				}
//
// 				const currentUser = ParseServer.User.become(token);
// 				if (currentUser == null) {
//
// 						return NextResponse.redirect(new URL(`${baseUrl}/auth/login`, req.url))
// 				} else {
// 						return NextResponse.next()
// 				}
// 		}
// 		return NextResponse.next()
// }

export function middleware() {

}

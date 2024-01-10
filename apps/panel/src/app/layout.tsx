import "./globals.css";
import type { Metadata } from "next";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ThemeRegistry from "@/utils/ThemeRegistry";
import { ParseInitializer } from "@/components/Parse";
import { initializeParse } from "@parse/react-ssr";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";

export const metadata: Metadata = {
	title: "DHIS2 Analytics Messenger Panel",
	description: "DHIS2 Analytics Messenger Panel",
};

const serverUrl =
	process.env.NEXT_PUBLIC_PARSE_BASE_URL ?? "http://localhost:4000";
const appId = process.env.NEXT_PUBLIC_PARSE_APP_ID ?? "DAM-AUTH";

initializeParse(serverUrl, appId, "");

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<ParseInitializer />
				<ThemeRegistry options={{ key: "mui-theme" }}>
					<ReactQueryProvider>{children}</ReactQueryProvider>
				</ThemeRegistry>
			</body>
		</html>
	);
}

import "./globals.css";
import type { Metadata } from "next";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ThemeRegistry from "@/utils/ThemeRegistry";
import { ParseInitializer } from "@/components/Parse";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";

export const metadata: Metadata = {
	title: "DHIS2 Analytics Messenger Panel",
	description: "DHIS2 Analytics Messenger Panel",
};
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

import './globals.css'
import type {Metadata} from 'next'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ThemeRegistry from "@/utils/ThemeRegistry";
import {initializeParse} from "@parse/react-ssr";

export const metadata: Metadata = {
		title: 'DHIS2 Analytics Messenger Panel',
		description: 'DHIS2 Analytics Messenger Panel',
}

initializeParse(
		process.env.NEXT_PARSE_BASE_URL ?? "",
		process.env.NEXT_PARSE_APP_ID ?? "",
		""
)

export default function RootLayout({
																			 children,
																	 }: {
		children: React.ReactNode
}) {
		return (
				<html lang="en">
				<body>
				<ThemeRegistry options={{key: "mui-theme"}}>
						{children}
				</ThemeRegistry>
				</body>
				</html>
		)
}

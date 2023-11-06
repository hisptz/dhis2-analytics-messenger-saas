import puppeteer from "puppeteer";
import { config } from "dotenv";

config();

const visualizerURL = process.env.VISUALIZER_URL ?? "http://localhost:5173";

export async function getVisualization({
	id,
	dhis2PAT,
	dhis2URL,
}: {
	id: string;
	dhis2URL: string;
	dhis2PAT: string;
}) {
	const browser = await puppeteer.launch({
		headless: "new",
		args: [
			"--no-sandbox",
			"--disable-web-security",
			"--disable-setuid-sandbox",
		],
		defaultViewport: {
			width: 1920,
			height: 1080,
		},
	});
	const page = await browser.newPage();
	const params = new URLSearchParams({
		dhis2PAT,
		dhis2URL,
		height: "1080",
		width: "1920",
	});
	try {
		await page.goto(`${visualizerURL}/${id}?${params.toString()}`);
		await Promise.race([
			page.waitForSelector(".highcharts-container", {
				visible: true,
				timeout: 20000,
			}),
			page.waitForSelector("#error-container", {
				visible: true,
				timeout: 20000,
			}),
			page.waitForSelector(".tablescrollbox", {
				visible: true,
				timeout: 20000,
			}),
		]);
		const imageBuffer = (await page?.screenshot()) as Buffer;
		await browser.close();
		if (imageBuffer) {
			return `data:image/png;base64,${imageBuffer.toString("base64")}`;
		}
	} catch (e) {
		const imageBuffer = (await page?.screenshot()) as Buffer;
		await browser.close();
		if (imageBuffer) {
			return `data:image/png;base64,${imageBuffer.toString("base64")}`;
		}
	}
}

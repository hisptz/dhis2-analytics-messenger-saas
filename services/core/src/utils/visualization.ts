import puppeteer from "puppeteer";
import { config } from "dotenv";
import logger from "../services/logging";

config();

const visualizerURL = process.env.VISUALIZER_URL ?? "http://localhost:5173";

export async function getVisualization({
	id,
	type = "visualization",
	dhis2PAT,
	dhis2URL,
}: {
	id: string;
	type?: "visualization" | "map";
	dhis2URL: string;
	dhis2PAT: string;
}) {
	logger.info(`Launching browser...`);
	const browser = await puppeteer.launch({
		headless: "new",
		args: [
			"--no-sandbox",
			"--disable-web-security",
			"--disable-setuid-sandbox",
		],
	});
	logger.info(`Opening visualization service at: ${visualizerURL}`);
	const page = await browser.newPage();
	const params = new URLSearchParams({
		dhis2PAT,
		dhis2URL,
	});
	try {
		await page.goto(`${visualizerURL}/${type}/${id}?${params.toString()}`);
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

			page.waitForSelector('[data-test="visualization-container"]', {
				visible: true,
				timeout: 20000,
			}),
		]);
		await new Promise((r) => setTimeout(r, 2000)); //Due to highchart animation
		const imageBuffer = (await page?.screenshot({
			type: "jpeg",
			quality: 100,
			fullPage: true,
			captureBeyondViewport: false,
			fromSurface: true,
		})) as Buffer;
		await browser.close();
		if (imageBuffer) {
			return `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
		}
	} catch (e) {
		const imageBuffer = (await page?.screenshot()) as Buffer;
		await browser.close();
		if (imageBuffer) {
			return `data:image/png;base64,${imageBuffer.toString("base64")}`;
		}
	}
}

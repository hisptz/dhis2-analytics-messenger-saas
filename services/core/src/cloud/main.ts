import { range } from "lodash";
import "./init";
import "./token";
import "./whatsapp";
import "./messaging";

Parse.Cloud.job("sayHi", () => {
	range(1, 2);
	console.log("Hello!");
	return;
});

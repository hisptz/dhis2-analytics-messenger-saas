import { range } from "lodash";
import "./init";
import "./token";
import "./whatsapp";
import "./messaging";
import "./push";

Parse.Cloud.job("sayHi", () => {
	range(1, 2);
	console.log("Hello!");
	return;
});

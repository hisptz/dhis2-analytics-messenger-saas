import { range } from "lodash";
import "./init";
import "./token";

Parse.Cloud.job("sayHi", () => {
	range(1, 2);
	console.log("Hello!");
	return;
});
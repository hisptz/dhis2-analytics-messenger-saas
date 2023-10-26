import { range } from "lodash";
import "./init";

Parse.Cloud.job("sayHi", () => {
	range(1, 2);
	console.log("Hello!");
	return;
});

console.log("Are these changes detectable?");

import {range} from "lodash";

Parse.Cloud.define("Hello Auth", (req) => {
		range(1, 2);
		return "Hello!"
})

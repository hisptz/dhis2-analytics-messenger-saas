import { ParseField } from "../cloud/types";
import { generateSchema } from "./base";

//Action
const actionFields: ParseField[] = [];
const actionSchema = generateSchema("Action", actionFields);

export * from "./visualization";
export * from "./pushAnalytics";
export * from "./gateway";
export * from "./navigation";
export * from "./table";

// Base models
export interface BaseModel {
    index?: number;
    id: string;
    name: string;
}

export interface IdentifiableModel extends BaseModel {
  created: string;
  lastUpdated: string;
  createdBy: string;
  action?: any;
}

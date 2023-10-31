import {IdentifiableModel, Visualization} from ".";

export interface PushAnalytics extends IdentifiableModel {
    gateway: string;
    visualizations: Array<Visualization>;
    contacts: Array<Contact>;
    logs?: Array<string>;
    description?: string;
}

export interface Contact {
    id?: string;
    number: string;
    type: "group" | "individual"
}

import {z} from "zod";


export const gatewaySchema = z.object({
    id: z.string({description: "Unique identifier"}),
    name: z.string({description: "Name of the gateway"}),
    url: z.string({description: "URL of the gateway"}),
    apiKey: z.string({description: "API key for the gateway"}),
});


export type Gateway = z.infer<typeof gatewaySchema>

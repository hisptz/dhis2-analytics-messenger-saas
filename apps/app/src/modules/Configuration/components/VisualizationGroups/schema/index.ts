import i18n from "@dhis2/d2-i18n";
import {z} from "zod";

export const visualizationGroupSchema = z.object({
    id: z.string(),
    name: z.string(),
    visualizations: z.array(z.object({
        id: z.string(),
        name: z.string()
    })).refine((value) => value.length > 0, i18n.t("At least one visualization is required")),
});


export type VisualizationGroup = z.infer<typeof visualizationGroupSchema>;

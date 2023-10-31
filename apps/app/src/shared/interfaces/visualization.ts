import { IdentifiableModel, BaseModel } from ".";

export interface VisualizationGroup extends IdentifiableModel {
  visualizations: Array<Visualization>;
}

export type Visualization = BaseModel;

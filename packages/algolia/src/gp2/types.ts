import { gp2 as gp2Model } from '@asap-hub/model';

export const OUTPUT_ENTITY_TYPE = 'output';
export const PROJECT_ENTITY_TYPE = 'project';

export type Payload =
  | {
      data: gp2Model.OutputResponse;
      type: typeof OUTPUT_ENTITY_TYPE;
    }
  | {
      data: gp2Model.ProjectResponse;
      type: typeof PROJECT_ENTITY_TYPE;
    };

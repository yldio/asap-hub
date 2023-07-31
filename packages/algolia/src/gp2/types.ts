import { gp2 as gp2Model } from '@asap-hub/model';

export const OUTPUT_ENTITY_TYPE = 'output';

export type Payload = {
  data: gp2Model.OutputResponse;
  type: typeof OUTPUT_ENTITY_TYPE;
};

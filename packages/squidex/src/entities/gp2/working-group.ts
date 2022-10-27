import { gp2 } from '@asap-hub/model';
import { Entity, Rest, RestPayload } from '../common';

export interface WorkingGroup {
  resources: gp2.Resource[];
}

export interface RestWorkingGroup extends Entity, Rest<WorkingGroup> {}

export interface InputWorkingGroup extends Entity, RestPayload<WorkingGroup> {}

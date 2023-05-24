import { gp2 } from '@asap-hub/model';
import { Entity, Rest, RestPayload } from '../common';

export type RestWorkingGroupsMembersRole =
  | 'Co_lead'
  | 'Lead'
  | 'Working_group_member';

export interface WorkingGroup {
  resources?: gp2.Resource[];
  members?: {
    user: string[];
    role: RestWorkingGroupsMembersRole;
  }[];
}

export interface RestWorkingGroup extends Entity, Rest<WorkingGroup> {}

export interface InputWorkingGroup extends Entity, RestPayload<WorkingGroup> {}

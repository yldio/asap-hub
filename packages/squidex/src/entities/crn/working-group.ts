import { DeliverableStatus } from '@asap-hub/model';
import { Rest, RestPayload, Entity } from '../common';

interface WorkingGroup {
  title: string;
  complete: boolean;
  description: string;
  shortText: string;
  calendars: string[];
  leaders: {
    user: string[];
    role: string;
    workstreamRole: string;
  }[];
  members: string[];
  deliverables: {
    description: string;
    status: DeliverableStatus;
  }[];
  readonly lastModifiedDate: string;
}

export interface RestWorkingGroup extends Entity, Rest<WorkingGroup> {}
export interface InputWorkingGroup extends Entity, RestPayload<WorkingGroup> {}

import {
  WorkingGroupRole,
  DeliverableStatus,
  WorkingGroupLeader,
} from '@asap-hub/model';
import { Rest, Entity } from '../common';

interface WorkingGroupUserConnection<T = string> {
  role: WorkingGroupRole;
  user: Array<T | undefined>;
}

interface WorkingGroup<TUserConnection = string, TCalendar = string> {
  title: string;
  description: string;
  externalLink?: string;
  leaders: WorkingGroupUserConnection<TUserConnection>[];
  members: WorkingGroupUserConnection<TUserConnection>[];
  pointOfContact?: WorkingGroupLeader;
  complete: boolean;
  shortText: string;
  calendars: TCalendar[];
  deliverables: {
    description: string;
    status: DeliverableStatus;
  }[];
  readonly lastModifiedDate: string;
}

export interface RestWorkingGroup extends Entity, Rest<WorkingGroup> {}

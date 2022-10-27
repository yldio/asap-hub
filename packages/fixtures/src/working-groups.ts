import { WorkingGroupResponse } from '@asap-hub/model';

export const createWorkingGroupResponse = (): WorkingGroupResponse => ({
  id: 'uuid-working-groups-1',
  title: 'Title',
  externalLink: 'https://hub.asap.science',
  externalLinkText: 'Working group 1',
  description: 'Description',
  lastUpdated: '2020-10-15T17:55:21Z',
});

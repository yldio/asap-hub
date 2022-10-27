import { WorkingGroupDataObject } from '@asap-hub/model';
import { WorkingGroupResponse } from '@asap-hub/model/src/working-group';
import { WorkingGroupSquidexGraphql } from '../../src/entities';

export const getWorkingGroupSquidexGraphql =
  (): WorkingGroupSquidexGraphql => ({
    id: 'uuid-working-groups-1',
    created: '2020-09-24T11:06:27.164Z',
    lastModified: '2020-10-15T17:55:21Z',
    version: 42,
    flatData: {
      title: 'Title',
      externalLink: 'https://hub.asap.science',
      externalLinkText: 'Working group 1',
      description: 'Description',
    },
  });

export const getWorkingGroupDataObject = (): WorkingGroupDataObject => ({
  id: 'uuid-working-groups-1',
  title: 'Title',
  externalLink: 'https://hub.asap.science',
  externalLinkText: 'Working group 1',
  description: 'Description',
  lastUpdated: '2020-10-15T17:55:21Z',
});

export const getWorkingGroupResponse = (): WorkingGroupResponse =>
  getWorkingGroupDataObject();

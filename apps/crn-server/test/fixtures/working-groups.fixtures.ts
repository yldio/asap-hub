import { WorkingGroupDataObject, WorkingGroupResponse } from '@asap-hub/model';

export const getWorkingGroupDataObject = (): WorkingGroupDataObject => ({
  id: '123',
  title: 'Working Group Title',
  description: 'Working Group Description',
  deliverables: [],
  lastModifiedDate: '2021-01-01T00:00:00.000Z',
});

export const getWorkingGroupResponse = (): WorkingGroupResponse =>
  getWorkingGroupDataObject();

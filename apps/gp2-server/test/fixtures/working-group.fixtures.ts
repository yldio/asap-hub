import type { gp2 } from '@asap-hub/model';

export const getWorkingGroupDataObject = (): gp2.WorkingGroupDataObject => ({
  id: 'working-group-id-1',
  title: 'Working Group',
  shortDescription: 'Short description',
  leadingMembers: 'Leading members',
  members: [],
});

export const getListWorkingGroupDataObject =
  (): gp2.ListWorkingGroupResponse => ({
    total: 1,
    items: [getWorkingGroupDataObject()],
  });

export const getWorkingGroupResponse = (): gp2.WorkingGroupResponse =>
  getWorkingGroupDataObject();

export const getListWorkingGroupResponse =
  (): gp2.ListWorkingGroupResponse => ({
    total: 1,
    items: [getWorkingGroupResponse()],
  });

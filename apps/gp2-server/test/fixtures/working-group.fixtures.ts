import type { gp2 } from '@asap-hub/model';

export const getWorkingGroupResponse = (): gp2.WorkingGroupResponse => ({
  id: 'working-group-id-1',
  title: 'Working Group',
  shortDescription: 'Short description',
  leadingMembers: 'Leading members',
  members: [],
});

export const getListWorkingGroupResponse =
  (): gp2.ListWorkingGroupResponse => ({
    total: 1,
    items: [getWorkingGroupResponse()],
  });

import { gp2 } from '@asap-hub/model';

export const getWorkingGroupFixture = (
  overrides: Partial<gp2.WorkingGroupResponse> = {},
) => ({
  id: '42',
  title: 'Working Group Title',
  members: [],
  shortDescription: 'This is a short description',
  leadingMembers: 'This is a list of leading members',
  ...overrides,
});

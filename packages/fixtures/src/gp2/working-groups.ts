import { gp2 } from '@asap-hub/model';

const mockedWorkingGroup = {
  id: '42',
  title: 'Working Group Title',
  members: [],
  shortDescription: 'This is a short description',
  description: 'This is a long description',
  leadingMembers: 'This is a list of leading members',
};

export const createWorkingGroupResponse = (
  overrides: Partial<gp2.WorkingGroupResponse> = {},
): gp2.WorkingGroupResponse => ({
  ...mockedWorkingGroup,
  ...overrides,
});

export const createWorkingGroupsResponse = (
  items = [createWorkingGroupResponse()],
): gp2.ListWorkingGroupResponse => ({
  items,
  total: items.length,
});

export const createWorkingGroupNetworkResponse =
  (): gp2.ListWorkingGroupNetworkResponse => ({
    total: 1,
    items: [
      { role: 'complexDisease', workingGroups: [createWorkingGroupResponse()] },
    ],
  });

import { gp2 } from '@asap-hub/model';

export const workingGroupResources: gp2.Resource[] = [
  {
    type: 'Note',
    title: 'This is a resource title',
    description: 'This is a resource description',
  },
];
const mockedWorkingGroup: gp2.WorkingGroupResponse = {
  id: '42',
  title: 'Working Group Title',
  members: [
    {
      userId: '11',
      firstName: 'Tony',
      lastName: 'Stark',
      displayName: 'Tony Stark',
      role: 'Lead',
    },
  ],
  shortDescription: 'This is a short description',
  description: 'This is a long description',
  leadingMembers: 'This is a list of leading members',
  resources: workingGroupResources,
  milestones: [
    {
      title: 'milestone I',
      status: 'Active',
    },
  ],
  tags: [],
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

export const createListWorkingGroupResponse = (
  items = 10,
  total = 10,
): gp2.ListWorkingGroupResponse => ({
  total,
  items: Array.from({ length: items }, (_, idx) => ({
    ...createWorkingGroupResponse({ title: `Working Group ${idx}` }),
  })),
});

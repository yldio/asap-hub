import { gp2 } from '@asap-hub/model';

export const projectResources: gp2.Resource[] = [
  {
    type: 'Note',
    title: 'This is a resource title',
    description: 'This is a resource description',
  },
];

const mockedProject: gp2.ProjectResponse = {
  id: '42',
  title: 'Project Title',
  members: [
    {
      userId: '11',
      firstName: 'Tony',
      lastName: 'Stark',
      role: 'Project manager',
    },
  ],
  startDate: '2021-12-28',
  status: 'Active',
  tags: [
    { id: '1', name: 'RNA' },
    { id: '2', name: 'Aging' },
    { id: '3', name: 'Diversity' },
    { id: '4', name: 'Data Science' },
  ],
  milestones: [
    {
      title: 'milestone I',
      status: 'Active',
    },
  ],
  resources: projectResources,
  traineeProject: false,
  _tags: [],
};

export const createProjectResponse = (
  overrides: Partial<gp2.ProjectResponse> = {},
): gp2.ProjectResponse => ({
  ...mockedProject,
  ...overrides,
});

export const createProjectsResponse = (
  items = [createProjectResponse()],
): gp2.ListProjectResponse => ({
  items,
  total: items.length,
});

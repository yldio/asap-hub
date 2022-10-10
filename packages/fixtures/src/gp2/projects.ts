import { gp2 } from '@asap-hub/model';

const mockedProject: gp2.ProjectResponse = {
  id: '42',
  title: 'Project Title',
  members: [
    {
      userId: '11',
      firstName: 'Tony',
      lastName: 'Stark',
    },
  ],
  startDate: '2021-12-28',
  status: 'Active',
  keywords: ['R'],
  milestones: [
    {
      title: 'milestone I',
      status: 'Active',
    },
  ],
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

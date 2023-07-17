import type { gp2 as gp2Contentful } from '@asap-hub/contentful';
import type { gp2 as gp2Model } from '@asap-hub/model';

export const getProjectDataObject = (): gp2Model.ProjectDataObject => ({
  id: '7',
  title: 'a project title',
  startDate: '2020-07-06',
  endDate: '2021-12-28',
  status: 'Completed',
  projectProposalUrl: 'http://a-proposal',
  members: [
    {
      id: '32',
      userId: '11',
      firstName: 'Tony',
      lastName: 'Stark',
      role: 'Project manager',
    },
  ],
  keywords: ['RNA'],
  description: 'test description',
  leadEmail: 'peter@parker.com',
  pmEmail: 'tony@stark.com',
  milestones: [
    {
      title: 'A project milestone',
      status: 'Active',
    },
  ],
  resources: [
    {
      id: '27',
      type: 'Note',
      description: 'Project resource description',
      title: 'Project resource title',
    },
  ],
  traineeProject: false,
  opportunitiesLink: 'http://opportunities',
  calendar: { id: '42', name: 'project calendar' },
});
export const getProjectUpdateDataObject =
  (): gp2Model.ProjectUpdateDataObject => ({
    resources: [
      {
        type: 'Note',
        description: 'Project resource description',
        title: 'Project resource title',
      },
    ],
    members: [
      {
        userId: '11',
        role: 'Project manager',
      },
    ],
  });

export const getListProjectDataObject = (): gp2Model.ListProjectResponse => ({
  total: 1,
  items: [getProjectDataObject()],
});

export const getProjectResponse = (): gp2Model.ProjectResponse =>
  getProjectDataObject();

export const getListProjectsResponse = (): gp2Model.ListProjectResponse => ({
  total: 1,
  items: [getProjectResponse()],
});

export const getContentfulGraphqlProjectMembers = () => ({
  total: 1,
  items: [
    {
      sys: {
        id: '32',
      },
      role: 'Project manager',
      user: {
        sys: {
          id: '11',
        },
        firstName: 'Tony',
        lastName: 'Stark',
        onboarded: true,
      },
    },
  ],
});
export const getContentfulGraphqlProjectMilestones = () => ({
  total: 1,
  items: [
    {
      sys: {
        id: '23',
      },
      status: 'Active',
      title: 'A project milestone',
    },
  ],
});

export const getContentfulGraphqlProjectResources = () => ({
  total: 1,
  items: [
    {
      sys: {
        id: '27',
      },
      type: 'Note',
      title: 'Project resource title',
      description: 'Project resource description',
      externalLink: 'http://example/link',
    },
  ],
});
export const getContentfulGraphqlProject = (
  props = {},
): NonNullable<
  NonNullable<gp2Contentful.FetchProjectByIdQuery['projects']>
> => ({
  sys: {
    id: '7',
  },
  title: 'a project title',
  startDate: '2020-07-06',
  endDate: '2021-12-28',
  status: 'Completed',
  projectProposal: 'http://a-proposal',
  keywords: ['RNA'],
  description: 'test description',
  leadEmail: 'peter@parker.com',
  pmEmail: 'tony@stark.com',
  traineeProject: false,
  opportunitiesLink: 'http://opportunities',
  membersCollection: { ...getContentfulGraphqlProjectMembers() },
  milestonesCollection: { ...getContentfulGraphqlProjectMilestones() },
  resourcesCollection: { ...getContentfulGraphqlProjectResources() },
  calendar: {
    sys: {
      id: '42',
    },
    name: 'project calendar',
  },
  ...props,
});

export const getContentfulGraphqlProjectsResponse =
  (): gp2Contentful.FetchProjectsQuery => ({
    projectsCollection: {
      total: 1,
      items: [getContentfulGraphqlProject()],
    },
  });

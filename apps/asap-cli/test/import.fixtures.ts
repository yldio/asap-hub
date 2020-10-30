import { RestTeam } from '@asap-hub/squidex';

export const fetchTeamsResponse: { total: number; items: RestTeam[] } = {
  total: 1,
  items: [
    {
      id: 'team-uuid-1',
      lastModified: '2020-09-25T11:06:27.164Z',
      created: '2020-09-24T11:06:27.164Z',
      data: {
        displayName: { iv: 'team' },
        applicationNumber: { iv: 'app' },
        projectTitle: { iv: 'title' },
        skills: { iv: [] },
      },
    },
  ],
};

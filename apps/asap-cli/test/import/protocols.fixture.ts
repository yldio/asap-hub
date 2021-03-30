import { RestResearchOutput, RestUser, RestTeam } from '@asap-hub/squidex';

export const createProtocolsRequest: RestResearchOutput['data'] = {
  type: { iv: 'Protocol' },
  title: { iv: 'title 1' },
  publishDate: { iv: '2020-11-27T10:26:00.000Z' },
  text: {
    iv: 'From Team team and authors: author 1, author 2.',
  },
  link: {
    iv: 'https://www.protocols.io/view/link1',
  },
  tags: {
    iv: ['a', 'b', 'c d', 'e'],
  },
};

export const fetchProtocolsResponse: RestResearchOutput = {
  id: 'uuid',
  lastModified: '2020-09-25T11:06:27.164Z',
  created: '2020-09-24T11:06:27.164Z',
  data: createProtocolsRequest,
};

export const fetchUserResponse: RestUser = {
  id: 'user-uuid-1',
  lastModified: '2020-09-25T11:06:27.164Z',
  created: '2020-09-24T11:06:27.164Z',
  data: {
    avatar: { iv: [] },
    lastModifiedDate: { iv: '2020-09-25T11:06:27.164Z' },
    email: { iv: 'testUser@asap.science' },
    firstName: { iv: 'First' },
    lastName: { iv: 'Last' },
    jobTitle: { iv: 'Title' },
    institution: { iv: 'Institution' },
    connections: { iv: [] },
    biography: { iv: 'Biography' },
    location: { iv: 'Lisbon, Portugal' },
    teams: { iv: [{ id: ['team-uuid-1'], role: 'Lead PI (Core Leadership)' }] },
    questions: { iv: [] },
    skills: { iv: [] },
    role: { iv: 'Grantee' },
  },
};

export const fetchTeamResponse: RestTeam = {
  id: 'team-uuid-1',
  lastModified: '2020-09-25T11:06:27.164Z',
  created: '2020-09-24T11:06:27.164Z',
  data: {
    applicationNumber: { iv: 'app-number' },
    displayName: { iv: 'team' },
    projectTitle: { iv: 'title' },
    skills: { iv: [] },
    outputs: { iv: ['ro-uuid-1'] },
  },
};

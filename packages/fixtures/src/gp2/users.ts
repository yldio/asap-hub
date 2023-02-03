import { gp2 } from '@asap-hub/model';

const mockedUser: gp2.UserResponse = {
  id: 'user-id-1',
  createdDate: '2020-09-23T20:45:22.000Z',
  displayName: 'Tony Stark',
  email: 'T@ark.io',
  secondaryEmail: 'tony.stark@avengers.com',
  firstName: 'Tony',
  lastName: 'Stark',
  region: 'Europe',
  degrees: ['PhD'],
  role: 'Trainee',
  biography:
    'Tony Stark is the wealthy son of industrialist and weapons manufacturer Howard Stark and his wife, Maria.',
  country: 'Spain',
  positions: [
    {
      role: 'CEO',
      department: 'Research',
      institution: 'Stark Industries',
    },
  ],
  onboarded: true,
  projects: [
    {
      id: 'project-id',
      title: 'a project title',
      status: 'Active',
      members: [{ userId: 'user-id-1', role: 'Project lead' }],
    },
  ],
  questions: ['a first question?', 'a second question?'],
  workingGroups: [
    {
      id: 'working-group-id',
      title: 'a working group title',
      members: [{ userId: 'user-id-1', role: 'Co-lead' }],
    },
  ],
  contributingCohorts: [
    {
      contributingCohortId: 'cohort-id-11',
      role: 'Investigator',
      name: 'S4',
      studyUrl: 'http://example.com',
    },
  ],
  fundingStreams: undefined,
  keywords: ['Bash'],
  telephone: {
    countryCode: '+1',
    number: '0123456789',
  },
  social: {
    googleScholar: 'https://scholar.google.com',
    orcid: 'https://orcid.org',
    researchGate: 'https://researchid.com/rid/',
    researcherId: 'https://researchid.com/rid/',
    blog: 'https://www.blogger.com',
    twitter: 'https://twitter.com',
    linkedIn: 'https://www.linkedin.com',
    github: 'https://github.com/',
  },
};

export const createUserResponse = (
  overrides: Partial<gp2.UserResponse> = {},
): gp2.UserResponse => ({
  ...mockedUser,
  ...overrides,
});

export const createUsersResponse = (items = 1): gp2.ListUserResponse => ({
  items: Array.from({ length: items }, (_, id) =>
    createUserResponse({ id: String(id) }),
  ),
  total: items,
});

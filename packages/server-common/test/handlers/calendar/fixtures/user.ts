import { ListUserResponse, UserResponse } from '@asap-hub/model';

export const getUserResponse = (
  overrides: Partial<UserResponse> = {},
): UserResponse => ({
  alumniLocation: 'some alumni location',
  alumniSinceDate: '2020-09-23T20:45:22.000Z',
  id: 'user-id-1',
  biography: 'some bio',
  onboarded: true,
  dismissedGettingStarted: false,
  createdDate: '2020-09-23T20:45:22.000Z',
  questions: ['Question 1', 'Question 2'],
  expertiseAndResourceTags: [
    'expertise 1',
    'expertise 2',
    'expertise 3',
    'expertise 4',
    'expertise 5',
  ],
  displayName: 'Tom Hardy',
  institution: 'some institution',
  jobTitle: 'some job title',
  reachOut: 'some reach out',
  responsibilities: 'some responsibilities',
  researchInterests: 'some research interests',
  email: 'H@rdy.io',
  contactEmail: 'T@rdy.io',
  firstName: 'Tom',
  lastName: 'Hardy',
  country: 'United Kingdom',
  city: 'London',
  lastModifiedDate: '2021-09-23T20:45:22.000Z',
  workingGroups: [],
  interestGroups: [],
  expertiseAndResourceDescription: 'some expertise and resource description',
  orcidWorks: [
    {
      doi: 'test-doi',
      id: '123-456-789',
      lastModifiedDate: '2020-10-26T15:33:18Z',
      publicationDate: {},
      type: 'ANNOTATION',
      title: 'orcid work title',
    },
  ],
  orcid: '123-456-789',
  orcidLastModifiedDate: '2020-09-23T20:45:22.000Z',
  orcidLastSyncDate: '2020-09-23T20:45:22.000Z',
  degree: 'MPH',
  social: {
    orcid: '123-456-789',
  },
  teams: [
    {
      id: 'team-id-0',
      teamInactiveSince: '',
      role: 'Lead PI (Core Leadership)',
      displayName: 'Team A',
      proposal: 'proposalId1',
      inactiveSinceDate: undefined,
    },
  ],
  role: 'Grantee',
  labs: [
    { id: 'cd7be4902', name: 'Brighton' },
    { id: 'cd7be4903', name: 'Liverpool' },
  ],
  ...overrides,
});

export const getListUserResponse = (): ListUserResponse => ({
  total: 1,
  items: [getUserResponse()],
});

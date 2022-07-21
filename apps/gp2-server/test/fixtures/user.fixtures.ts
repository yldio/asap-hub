import { UserResponse } from '@asap-hub/model';
import { UserEvent } from '@asap-hub/server-common';
import { User, WebhookPayload } from '@asap-hub/squidex';

export const getUserResponse = (): UserResponse => ({
  id: 'user-id-1',
  biography: 'some bio',
  onboarded: true,
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
  lastModifiedDate: '2020-09-23T20:45:22.000Z',
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
  degree: 'MPH',
  social: {
    orcid: '123-456-789',
  },
  teams: [
    {
      id: 'team-id-1',
      role: 'Lead PI (Core Leadership)',
      displayName: 'Team A',
      proposal: 'proposalId1',
    },
  ],
  role: 'Grantee',
  labs: [
    { id: 'cd7be4902', name: 'Brighton' },
    { id: 'cd7be4903', name: 'Liverpool' },
  ],
});

export const getUserWebhookPayload = (
  id: string,
  type: UserEvent,
): WebhookPayload<User> => ({
  type,
  timestamp: '2021-02-15T13:11:25Z',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id,
    created: '2020-07-31T15:52:33Z',
    lastModified: '2020-07-31T15:52:33Z',
    version: 42,
    data: {
      onboarded: { iv: true },
      jobTitle: { iv: 'some job title' },
      avatar: { iv: ['https://www.example.com/avatar.jpg'] },
      connections: { iv: [] },
      email: { iv: 'test@test.com' },
      firstName: { iv: 'Tom' },
      lastName: { iv: 'Hardy' },
      questions: { iv: [] },
      role: { iv: 'Grantee' },
      teams: { iv: [] },
      labs: { iv: [] },
    },
  },
});

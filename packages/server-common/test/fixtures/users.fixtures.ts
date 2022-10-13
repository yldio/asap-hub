import { RestUser, User, WebhookPayload } from '@asap-hub/squidex';
import { UserEvent } from '../../src/handlers/event-bus';

export const patchResponse = (): RestUser => ({
  id: 'userId',
  data: {
    onboarded: { iv: true },
    reachOut: { iv: 'some reach out' },
    responsibilities: { iv: 'some responsibilities' },
    expertiseAndResourceDescription: { iv: 'some expertiseAndResourceTags' },
    role: { iv: 'Grantee' },
    lastModifiedDate: { iv: '2020-09-25T09:42:51.132Z' },
    email: { iv: 'tony@stark.com' },
    firstName: { iv: 'Tony' },
    lastName: { iv: 'Stark' },
    jobTitle: { iv: 'CEO' },
    orcid: { iv: '363-98-9330' },
    institution: { iv: 'Stark Enterprises' },
    country: { iv: 'United Kingdom' },
    city: { iv: 'Brighton' },
    avatar: { iv: ['squidex-asset-id'] },
    expertiseAndResourceTags: { iv: [] },
    orcidWorks: { iv: [] },
    teams: {
      iv: [
        {
          id: ['team-id-1'],
          role: 'Lead PI (Core Leadership)',
        },
        {
          id: ['team-id-3'],
          role: 'Collaborating PI',
        },
      ],
    },
    connections: { iv: [] },
    questions: { iv: [] },
    labs: { iv: [] },
  },
  created: '2020-09-25T09:42:51Z',
  lastModified: '2020-09-25T09:42:51Z',
  version: 42,
});
export const restUserMock = patchResponse;

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
      firstName: { iv: 'Tony' },
      lastName: { iv: 'Stark' },
      onboarded: { iv: true },
      avatar: { iv: [] },
      connections: { iv: [] },
      email: {
        iv: 'tony@stark.com',
      },
      questions: { iv: [] },
      role: { iv: 'Grantee' },
      teams: { iv: [] },
      labs: { iv: [] },
    },
  },
});

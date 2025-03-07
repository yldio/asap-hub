import { gp2 as gp2Model } from '@asap-hub/model';
import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import {
  OrcidWork,
  UserDataObject,
  UserResponse,
  WebhookDetail,
} from '@asap-hub/model';
import { ORCIDWorksResponse } from '../../src/utils/fetch-orcid';

export const getUserDataObject = (): UserDataObject => ({
  id: 'userId',
  firstName: 'Tony',
  lastName: 'Stark',
  email: 'tony@.stark.com',
  connections: [],
  createdDate: '2020-09-25T09:42:51.000Z',
  tags: [],
  labs: [],
  lastModifiedDate: '2020-09-25T09:42:51.132Z',
  questions: [],
  role: 'Grantee',
  teams: [
    {
      displayName: 'Unknown',
      id: 'team-id-1',
      role: 'Lead PI (Core Leadership)',
      inactiveSinceDate: '',
    },
    {
      displayName: 'Unknown',
      id: 'team-id-3',
      role: 'Collaborating PI',
      inactiveSinceDate: '2022-09-25T09:42:51.000Z',
    },
  ],
  workingGroups: [],
  interestGroups: [],
});

export const getOrcidWorksResponse = (): ORCIDWorksResponse => ({
  'last-modified-date': { value: 1594690575911 },
  group: [
    {
      'last-modified-date': { value: 1593270649404 },
      'external-ids': {
        'external-id': [
          {
            'external-id-type': 'doi',
            'external-id-value': '10.1101/2020.06.24.169219',
            'external-id-url': null,
            'external-id-relationship': 'SELF',
          },
          {
            'external-id-type': 'doi',
            'external-id-value': '10.1101/2020.06.24.169219',
            'external-id-url': {
              value: 'https://doi.org/10.1101/2020.06.24.169219',
            },
            'external-id-relationship': 'SELF',
          },
        ],
      },
      'work-summary': [
        {
          'put-code': 76241838,
          'created-date': { value: 1593086686737 },
          'last-modified-date': { value: 1593270649404 },
          source: {
            'source-orcid': null,
            'source-client-id': {
              uri: 'https://orcid.org/client/0000-0001-9884-1913',
              path: '0000-0001-9884-1913',
              host: 'orcid.org',
            },
            'source-name': { value: 'Crossref' },
          },
          title: {
            title: {
              value:
                'JIP3 links lysosome transport to regulation of multiple components of the axonal cytoskeleton',
            },
            subtitle: null,
            'translated-title': null,
          },
          'external-ids': {
            'external-id': [
              {
                'external-id-type': 'doi',
                'external-id-value': '10.1101/2020.06.24.169219',
                'external-id-url': {
                  value: 'https://doi.org/10.1101/2020.06.24.169219',
                },
                'external-id-relationship': 'SELF',
              },
            ],
          },
          type: 'OTHER',
          'publication-date': {
            year: { value: '2020' },
            month: { value: '06' },
            day: { value: '24' },
            'media-type': null,
          },
          visibility: 'PUBLIC',
          path: '/0000-0001-9045-0723/work/76241838',
          'display-index': '0',
        },
      ],
    },
  ],
  path: '/0000-0001-9045-0723/works',
});

export const orcidWorksDeserialisedExpectation: OrcidWork[] = [
  {
    doi: 'https://doi.org/10.1101/2020.06.24.169219',
    id: '76241838',
    title:
      'JIP3 links lysosome transport to regulation of multiple components of the axonal cytoskeleton',
    type: 'OTHER',
    publicationDate: { year: '2020', month: '06', day: '24' },
    lastModifiedDate: '1593270649404',
  },
];

export const getUserContentfulWebhookDetail = (
  id: string,
): WebhookDetail<ContentfulWebhookPayload<'users'>> => ({
  resourceId: id,
  metadata: {
    tags: [],
  },
  sys: {
    type: 'Entry',
    id: 'fc496d00-053f-44fd-9bac-68dd9d959848',
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '5v6w5j61tndm',
      },
    },
    environment: {
      sys: {
        id: 'Development',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    contentType: {
      sys: {
        type: 'Link',
        linkType: 'ContentType',
        id: 'users',
      },
    },
    createdBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '2SHvngTJ24kxZGAPDJ8J1y',
      },
    },
    updatedBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '2SHvngTJ24kxZGAPDJ8J1y',
      },
    },
    revision: 14,
    createdAt: '2023-05-17T13:39:03.250Z',
    updatedAt: '2023-05-18T16:17:36.425Z',
  },
  fields: {},
});

export const getUserResponse = (): UserResponse => ({
  membershipStatus: ['CRN Member'],
  alumniLocation: 'some alumni location',
  alumniSinceDate: '2020-09-23T20:45:22.000Z',
  id: 'user-id-1',
  biography: 'some bio',
  onboarded: true,
  dismissedGettingStarted: false,
  createdDate: '2020-09-23T20:45:22.000Z',
  questions: ['Question 1', 'Question 2'],
  tags: [
    { id: '1', name: 'expertise 1' },
    { id: '2', name: 'expertise 2' },
    { id: '3', name: 'expertise 3' },
    { id: '4', name: 'expertise 4' },
    { id: '5', name: 'expertise 5' },
  ],
  displayName: 'Tom (Iron Man) Hardy',
  fullDisplayName: 'Tom (Iron Man) E. Hardy',
  institution: 'some institution',
  jobTitle: 'some job title',
  reachOut: 'some reach out',
  responsibilities: 'some responsibilities',
  researchInterests: 'some research interests',
  email: 'H@rdy.io',
  contactEmail: 'T@rdy.io',
  firstName: 'Tom',
  middleName: 'Edward',
  lastName: 'Hardy',
  nickname: 'Iron Man',
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
});

export const getGP2UserResponse = (
  overrides: Partial<gp2Model.UserResponse> = {},
): gp2Model.UserResponse => ({
  id: 'user-id-1',
  activeCampaignId: '1',
  avatarUrl: 'https://example.com',
  createdDate: '2020-09-23T20:45:22.000Z',
  activatedDate: '2020-09-24T20:45:22.000Z',
  email: 'T@ark.io',
  firstName: 'Tony',
  middleName: 'Edward',
  lastName: 'Stark',
  nickname: 'Iron Man',
  displayName: 'Tony (Iron Man) Stark',
  fullDisplayName: 'Tony (Iron Man) E. Stark',
  region: 'Europe',
  degrees: ['MPH'],
  role: 'Trainee',
  city: 'Madrid',
  country: 'Spain',
  stateOrProvince: 'Madrid',
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
      id: 'test-project-id',
      members: [
        { role: 'Project co-lead', userId: 'user-id-0' },
        { role: 'Investigator', userId: 'user-id-1' },
      ],

      status: 'Active',
      title: 'Test Project',
    },
  ],
  projectIds: ['test-project-id'],
  workingGroups: [
    {
      id: 'test-working-group-id',
      members: [
        { userId: 'user-id-2', role: 'Lead' },
        { userId: 'user-id-3', role: 'Working group member' },
      ],
      title: 'Steering Committee',
    },
  ],
  workingGroupIds: ['test-working-group-id'],
  fundingStreams: 'A funding stream',
  contributingCohorts: [
    {
      contributingCohortId: 'cohort-id',
      name: 'CALYPSO',
      role: 'Investigator',
      studyUrl: 'http://example.com/study',
    },
  ],
  questions: [
    'What color was Iron Mans original armour?',
    'Who is the Stark family butler?',
  ],
  alternativeEmail: 'tony@stark.com',
  telephone: { countryCode: '+1', number: '212-970-4133' },
  biography: 'a biography of Tony Stark',
  tags: [
    { id: 'tag-1', name: 'BLAAC-PD' },
    { id: 'tag-2', name: 'Cohort' },
  ],
  tagIds: ['tag-1', 'tag-2'],
  social: {
    googleScholar: 'https://scholar.google.com',
    orcid: 'https://orcid.org/1234-5678-9123-4567',
    blog: 'https://www.blogger.com',
    twitter: 'https://twitter.com',
    linkedIn: 'https://www.linkedin.com',
    github: 'https://github.com',
    researchGate: 'https://researchid.com/rid/',
    researcherId: 'https://researcherid.com/rid/',
  },
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
  orcid: '1234-5678-9123-4567',
  orcidLastModifiedDate: '2020-09-23T20:45:22.000Z',
  orcidLastSyncDate: '2020-09-23T20:45:22.000Z',
  ...overrides,
});

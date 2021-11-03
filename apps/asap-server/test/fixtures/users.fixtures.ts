import { ListUserResponse, UserPatchRequest } from '@asap-hub/model';
import { UserResponse } from '@asap-hub/model';
import { RestUser, WebhookPayload, User } from '@asap-hub/squidex';
import { FetchUserQuery, FetchUsersQuery } from '../../src/gql/graphql';

export const getGraphqlResponseFetchUsers = (): {
  data: FetchUsersQuery;
} => ({
  data: {
    queryUsersContentsWithTotal: {
      total: 2,
      items: [
        getGraphQLUser(),
        {
          id: 'user-id-2',
          created: '2020-09-23T20:45:22Z',
          lastModified: '2020-10-26T15:33:18Z',
          flatData: {
            biography: 'some biography',
            institution: 'some institution',
            jobTitle: 'some job title',
            onboarded: true,
            orcidLastModifiedDate: null,
            orcidLastSyncDate: null,
            orcidWorks: [
              {
                doi: 'test-doi',
                id: '987-654-321',
                lastModifiedDate: '2020-10-26T15:33:18Z',
                publicationDate: {},
                type: 'BOOK',
                title: 'orcid work title 2',
              },
            ],
            reachOut: 'some reach out',
            responsibilities: 'some responsibilities',
            city: 'some city',
            country: 'some country',
            contactEmail: 'some@contact.email',
            degree: 'some degree',
            orcid: 'orcid',
            avatar: null,
            email: 'iwillbeback@arnold.com',
            firstName: 'Arnold',
            lastModifiedDate: null,
            lastName: 'Schwatzneger',
            questions: [],
            skills: [],
            skillsDescription: 'Amazing person',
            social: [
              {
                github: 'awesome',
                googleScholar: null,
                linkedIn: null,
                researcherId: null,
                researchGate: null,
                twitter: null,
                website1: null,
                website2: null,
              },
            ],
            teams: [
              {
                role: 'Project Manager',
                approach: 'cover',
                responsibilities: 'increase coverage',
                id: [
                  {
                    id: 'team-id-2',
                    flatData: {
                      displayName: 'Team B',
                      proposal: [{ id: 'proposalId' }],
                    },
                  },
                ],
              },
            ],
            role: 'Grantee',
            labs: [],
          },
        },
      ],
    },
  },
});

export const getGraphQLUser = (): NonNullable<
  FetchUserQuery['findUsersContent']
> => ({
  id: 'user-id-1',
  lastModified: '2020-10-26T15:33:18Z',
  created: '2020-09-23T20:45:22Z',
  flatData: {
    biography: 'some bio',
    institution: 'some institution',
    jobTitle: 'some job title',
    onboarded: true,
    orcidLastModifiedDate: null,
    orcidLastSyncDate: null,
    reachOut: 'some reach out',
    responsibilities: 'some responsibilities',
    avatar: [],
    email: 'H@rdy.io',
    contactEmail: 'T@rdy.io',
    firstName: 'Tom',
    lastName: 'Hardy',
    country: 'United Kingdom',
    city: 'London',
    lastModifiedDate: '',
    questions: [{ question: 'Question 1' }, { question: 'Question 2' }],
    skills: ['skill 1', 'skill 2', 'skill 3', 'skill 4', 'skill 5'],
    skillsDescription: null,
    orcid: '123-456-789',
    orcidWorks: [
      {
        id: '123-456-789',
        doi: 'test-doi',
        type: 'ANNOTATION',
        lastModifiedDate: '2020-10-26T15:33:18Z',
        publicationDate: {},
        title: 'orcid work title',
      },
    ],
    social: null,
    degree: 'MPH',
    teams: [
      {
        role: 'Lead PI (Core Leadership)',
        approach: 'some team approach',
        responsibilities: 'some team responsibilities',
        id: [
          {
            id: 'team-id-1',
            flatData: {
              displayName: 'Team A',
              proposal: [{ id: 'proposalId1' }],
            },
          },
        ],
      },
    ],
    role: 'Grantee',
    labs: [
      { id: 'cd7be4902', flatData: { name: 'Brighton' } },
      { id: 'cd7be4903', flatData: { name: 'Liverpool' } },
    ],
  },
});

export const getGraphqlResponseFetchUser = (): { data: FetchUserQuery } => ({
  data: {
    findUsersContent: getGraphQLUser(),
  },
});

export const patchResponse: RestUser = {
  id: 'userId',
  data: {
    onboarded: { iv: true },
    reachOut: { iv: 'some reach out' },
    responsibilities: { iv: 'some responsibilities' },
    skillsDescription: { iv: 'some skills' },
    role: { iv: 'Grantee' },
    lastModifiedDate: { iv: '2020-09-25T09:42:51.132Z' },
    email: { iv: 'cristiano@ronaldo.com' },
    firstName: { iv: 'Cristiano' },
    lastName: { iv: 'Ronaldo' },
    jobTitle: { iv: 'Junior' },
    orcid: { iv: '363-98-9330' },
    institution: { iv: 'Dollar General Corporation' },
    country: { iv: 'United Kingdom' },
    city: { iv: 'Brighton' },
    avatar: { iv: ['squidex-asset-id'] },
    skills: { iv: [] },
    orcidWorks: { iv: [] },
    teams: {
      iv: [
        {
          id: ['team-id-1'],
          role: 'Lead PI (Core Leadership)',
          approach: 'Exact',
          responsibilities: 'Make sure coverage is high',
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
};
export const fetchUserResponse = patchResponse;

export const updateAvatarBody: { avatar: string } = {
  avatar:
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBkRXhpZgAATU0AKgAAAAgABAEGAAMAAAABAAIAAAESAAMAAAABAAEAAAEoAAMAAAABAAIAAIdpAAQAAAABAAAAPgAAAAAAAqACAAQAAAABAAAAAaADAAQAAAABAAAAAQAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4gI0SUNDX1BST0ZJTEUAAQEAAAIkYXBwbAQAAABtbnRyUkdCIFhZWiAH4QAHAAcADQAWACBhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGzKGpWCJX8QTTiZE9XR6hWCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApkZXNjAAAA/AAAAGVjcHJ0AAABZAAAACN3dHB0AAABiAAAABRyWFlaAAABnAAAABRnWFlaAAABsAAAABRiWFlaAAABxAAAABRyVFJDAAAB2AAAACBjaGFkAAAB+AAAACxiVFJDAAAB2AAAACBnVFJDAAAB2AAAACBkZXNjAAAAAAAAAAtEaXNwbGF5IFAzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHRleHQAAAAAQ29weXJpZ2h0IEFwcGxlIEluYy4sIDIwMTcAAFhZWiAAAAAAAADzUQABAAAAARbMWFlaIAAAAAAAAIPfAAA9v////7tYWVogAAAAAAAASr8AALE3AAAKuVhZWiAAAAAAAAAoOAAAEQsAAMi5cGFyYQAAAAAAAwAAAAJmZgAA8qcAAA1ZAAAT0AAACltzZjMyAAAAAAABDEIAAAXe///zJgAAB5MAAP2Q///7ov///aMAAAPcAADAbv/AABEIAAEAAQMBEQACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/3QAEAAH/2gAMAwEAAhEDEQA/AMev53P7QP/Z',
};

export const getUserResponse = (): UserResponse => ({
  id: 'user-id-1',
  biography: 'some bio',
  onboarded: true,
  createdDate: '2020-09-23T20:45:22.000Z',
  questions: ['Question 1', 'Question 2'],
  skills: ['skill 1', 'skill 2', 'skill 3', 'skill 4', 'skill 5'],
  displayName: 'Tom Hardy',
  institution: 'some institution',
  jobTitle: 'some job title',
  reachOut: 'some reach out',
  responsibilities: 'some responsibilities',
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
      approach: 'some team approach',
      responsibilities: 'some team responsibilities',
    },
  ],
  role: 'Grantee',
  labs: [
    { id: 'cd7be4902', name: 'Brighton' },
    { id: 'cd7be4903', name: 'Liverpool' },
  ],
});

export const fetchExpectation: ListUserResponse = {
  total: 2,
  items: [
    getUserResponse(),
    {
      id: 'user-id-2',
      biography: 'some biography',
      city: 'some city',
      contactEmail: 'some@contact.email',
      country: 'some country',
      institution: 'some institution',
      jobTitle: 'some job title',
      orcid: 'orcid',
      reachOut: 'some reach out',
      responsibilities: 'some responsibilities',
      onboarded: true,
      createdDate: '2020-09-23T20:45:22.000Z',
      questions: [],
      skills: [],
      skillsDescription: 'Amazing person',
      displayName: 'Arnold Schwatzneger',
      email: 'iwillbeback@arnold.com',
      firstName: 'Arnold',
      lastName: 'Schwatzneger',
      lastModifiedDate: '2020-09-23T20:45:22.000Z',
      orcidWorks: [
        {
          doi: 'test-doi',
          id: '987-654-321',
          lastModifiedDate: '2020-10-26T15:33:18Z',
          publicationDate: {},
          type: 'BOOK',
          title: 'orcid work title 2',
        },
      ],
      social: {
        github: 'awesome',
        orcid: 'orcid',
      },
      teams: [
        {
          id: 'team-id-2',
          role: 'Project Manager',
          displayName: 'Team B',
          approach: 'cover',
          responsibilities: 'increase coverage',
          proposal: 'proposalId',
        },
      ],
      role: 'Grantee',
      labs: [],
    },
  ],
};

export const restUserMock = patchResponse;

export const userPatchRequest: UserPatchRequest = {
  social: { github: 'johnytiago' },
  jobTitle: 'CEO',
  questions: ['To be or not to be?'],
  onboarded: true,
  country: 'United Kingdom',
  city: 'Manchester',
};

export const updateUserEvent: WebhookPayload<User> = {
  type: 'UsersUpdated',
  timestamp: '2021-02-15T13:11:25Z',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id: 'userId',
    created: '2020-07-31T14:11:58Z',
    lastModified: '2020-07-31T15:49:41Z',
    data: {
      role: {
        iv: 'Grantee',
      },
      lastModifiedDate: {
        iv: '2020-08-26T16:36:47.984Z',
      },
      firstName: { iv: 'Bill' },
      lastName: { iv: 'Grades' },
      connections: {
        iv: [
          {
            code: 'c6fdb21b-32f3-4549-ac17-d0c83dc5335b',
          },
        ],
      },
      email: {
        iv: 'ti@sief.tg',
      },
      orcid: {
        iv: 'notChanged',
      },
      avatar: { iv: [] },
      skills: { iv: [] },
      questions: { iv: [] },
      teams: { iv: [] },
      onboarded: {
        iv: true,
      },
      labs: { iv: [] },
    },
    dataOld: {
      firstName: { iv: 'Bill' },
      lastName: { iv: 'Grades' },
      role: {
        iv: 'Grantee',
      },
      lastModifiedDate: {
        iv: '2020-08-26T16:36:47.984Z',
      },
      connections: {
        iv: [
          {
            code: 'c6fdb21b-32f3-4549-ac17-d0c83dc5335b',
          },
        ],
      },
      email: {
        iv: 'ti@sief.tg',
      },
      orcid: {
        iv: 'notChanged',
      },
      avatar: { iv: [] },
      skills: { iv: [] },
      questions: { iv: [] },
      teams: { iv: [] },
      onboarded: {
        iv: true,
      },
      labs: { iv: [] },
    },
  },
};

export const userPublishedEvent: WebhookPayload<User> = {
  type: 'UsersPublished',
  timestamp: '2021-02-15T13:11:25Z',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Published',
    id: 'userId',
    created: '2020-07-31T15:52:33Z',
    lastModified: '2020-07-31T15:52:33Z',
    data: {
      firstName: { iv: 'Gil' },
      lastName: { iv: 'Eanes' },
      role: {
        iv: 'Grantee',
      },
      avatar: { iv: [] },
      skills: { iv: [] },
      questions: { iv: [] },
      teams: { iv: [] },
      lastModifiedDate: {
        iv: '2020-08-26T16:36:47.984Z',
      },
      connections: {
        iv: [
          {
            code: 'c6fdb21b-32f3-4549-ac17-d0c83dc5335b',
          },
        ],
      },
      orcid: {
        iv: '0000-0002-9079-593X',
      },
      email: {
        iv: 'webhokk@ola.io',
      },
      onboarded: {
        iv: true,
      },
      labs: { iv: [] },
    },
  },
};

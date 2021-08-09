import { ListUserResponse, UserPatchRequest } from '@asap-hub/model';
import { UserResponse } from '@asap-hub/model';
import { RestUser, config, GraphqlUser } from '@asap-hub/squidex';
import {
  ResponseFetchUsers,
  ResponseFetchUser,
} from '../../src/controllers/users';

export const graphQlResponseFetchUsers: { data: ResponseFetchUsers } = {
  data: {
    queryUsersContentsWithTotal: {
      total: 2,
      items: [
        {
          id: 'userId1',
          lastModified: '2020-10-26T15:33:18Z',
          created: '2020-09-23T20:45:22Z',
          data: null,
          flatData: {
            avatar: [],
            email: 'H@rdy.io',
            contactEmail: 'T@rdy.io',
            firstName: 'Tom',
            lastName: 'Hardy',
            country: 'United Kingdom',
            city: 'London',
            lastModifiedDate: '',
            questions: null,
            skills: ['React'],
            skillsDescription: null,
            orcid: '123-456-789',
            social: null,
            degree: 'MPH',
            teams: [
              {
                role: 'Lead PI (Core Leadership)',
                approach: null,
                responsibilities: null,
                id: [
                  {
                    id: 'userId3',
                    created: '2020-09-23T20:45:22Z',
                    lastModified: '2020-10-26T15:33:18Z',
                    data: null,
                    flatData: {
                      applicationNumber: 'applicationNumber',
                      projectTitle: 'Awesome project',
                      displayName: 'Jackson, M',
                      proposal: [{ id: 'proposalId' }],
                      skills: [],
                      outputs: [],
                    },
                  },
                ],
              },
            ],
            role: 'Grantee',
            connections: [],
            labs: [
              { id: 'cd7be4902', flatData: { name: 'Brighton' } },
              { id: 'cd7be4903', flatData: { name: 'Liverpool' } },
            ],
          },
        },
        {
          id: 'userId2',
          created: '2020-09-23T20:45:22Z',
          lastModified: '2020-10-26T15:33:18Z',
          data: null,
          flatData: {
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
                    id: 'userId3',
                    created: '2020-09-23T20:45:22Z',
                    lastModified: '2020-10-26T15:33:18Z',
                    flatData: {
                      applicationNumber: 'applicationNumber',
                      projectTitle: 'Awesome project',
                      displayName: 'Jackson, M',
                      skills: [],
                      outputs: [],
                    },
                    data: null,
                  },
                ],
              },
            ],
            connections: [],
            role: 'Grantee',
            labs: [],
          },
        },
      ],
    },
  },
};

export const getGraphQlResponseFetchUser = (): { data: ResponseFetchUser } => ({
  data: {
    findUsersContent: {
      id: 'userId',
      created: '2020-09-25T09:42:51Z',
      lastModified: '2020-09-25T09:42:51Z',
      data: null,
      flatData: {
        onboarded: true,
        degree: 'MPH',
        email: 'cristiano@ronaldo.com',
        contactEmail: 'cristiano@ronaldo.com',
        firstName: 'Cristiano',
        lastName: 'Ronaldo',
        lastModifiedDate: '2020-09-25T09:42:51.132Z',
        jobTitle: 'Junior',
        orcid: '363-98-9330',
        institution: 'Dollar General Corporation',
        country: 'United Kingdom',
        city: 'Brighton',
        avatar: [{ id: 'squidex-asset-id' }],
        questions: [{ question: 'Question 1' }, { question: 'Question 2' }],
        skills: ['skill 1', 'skill 2', 'skill 3', 'skill 4', 'skill 5'],
        teams: [
          {
            role: 'Lead PI (Core Leadership)',
            approach: 'Exact',
            responsibilities: 'Make sure coverage is high',
            id: [
              {
                id: 'team-id-1',
                created: '2020-09-23T20:45:22Z',
                lastModified: '2020-10-26T15:33:18Z',
                data: null,
                flatData: {
                  applicationNumber: 'applicationNumber',
                  projectTitle: 'Awesome project',
                  displayName: 'Jackson, M',
                  proposal: [{ id: 'proposal-id-1' }],
                  skills: [],
                  outputs: [],
                },
              },
            ],
          },
          {
            role: 'Collaborating PI',
            approach: null,
            responsibilities: null,
            id: [
              {
                id: 'team-id-3',
                created: '2020-09-23T20:45:22Z',
                lastModified: '2020-10-26T15:33:18Z',
                data: null,
                flatData: {
                  applicationNumber: 'applicationNumber',
                  projectTitle: 'Another Awesome project',
                  displayName: 'Tarantino, M',
                  proposal: [{ id: 'proposal-id-2' }],
                  skills: [],
                  outputs: [],
                },
              },
            ],
          },
        ],
        role: 'Grantee',
        connections: [],
        labs: [
          { id: 'cd7be4904', flatData: { name: 'Manchester' } },
          { id: 'cd7be4905', flatData: { name: 'Glasgow' } },
        ],
      },
    },
  },
});

export const buildUserGraphqlResponse = (
  flatdata: Partial<GraphqlUser['flatData']> = {},
): { data: ResponseFetchUser } => ({
  data: {
    findUsersContent: {
      id: 'userId',
      created: '2020-09-25T09:42:51Z',
      lastModified: '2020-09-25T09:42:51Z',
      data: null,
      flatData: {
        onboarded: true,
        degree: 'MPH',
        email: 'cristiano@ronaldo.com',
        contactEmail: 'cristiano@ronaldo.com',
        firstName: 'Cristiano',
        lastName: 'Ronaldo',
        lastModifiedDate: '2020-09-25T09:42:51.132Z',
        jobTitle: 'Junior',
        orcid: '363-98-9330',
        institution: 'Dollar General Corporation',
        country: 'United Kingdom',
        city: 'Brighton',
        avatar: [{ id: 'squidex-asset-id' }],
        questions: [{ question: 'Question 1' }, { question: 'Question 2' }],
        skills: ['skill 1', 'skill 2', 'skill 3', 'skill 4', 'skill 5'],
        social: [
          {
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
            role: 'Lead PI (Core Leadership)',
            approach: 'Exact',
            responsibilities: 'Make sure coverage is high',
            id: [
              {
                id: 'team-id-1',
                created: '2020-09-23T20:45:22Z',
                lastModified: '2020-10-26T15:33:18Z',
                data: null,
                flatData: {
                  applicationNumber: 'applicationNumber',
                  projectTitle: 'Awesome project',
                  displayName: 'Jackson, M',
                  proposal: [{ id: 'proposal-id-1' }],
                  skills: [],
                  outputs: [],
                },
              },
            ],
          },
          {
            role: 'Collaborating PI',
            approach: null,
            responsibilities: null,
            id: [
              {
                id: 'team-id-3',
                created: '2020-09-23T20:45:22Z',
                lastModified: '2020-10-26T15:33:18Z',
                data: null,
                flatData: {
                  applicationNumber: 'applicationNumber',
                  projectTitle: 'Another Awesome project',
                  displayName: 'Tarantino, M',
                  proposal: [{ id: 'proposal-id-2' }],
                  skills: [],
                  outputs: [],
                },
              },
            ],
          },
        ],
        role: 'Grantee',
        connections: [],
        labs: [
          { id: 'cd7be4904', flatData: { name: 'Manchester' } },
          { id: 'cd7be4905', flatData: { name: 'Glasgow' } },
        ],
        ...flatdata,
      },
    },
  },
});

export const patchResponse: RestUser = {
  id: 'userId',
  data: {
    onboarded: { iv: true },
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

export const userResponse: UserResponse = {
  id: 'userId',
  onboarded: true,
  displayName: 'Cristiano Ronaldo',
  createdDate: '2020-09-25T09:42:51.000Z',
  lastModifiedDate: '2020-09-25T09:42:51.132Z',
  email: 'cristiano@ronaldo.com',
  contactEmail: 'cristiano@ronaldo.com',
  firstName: 'Cristiano',
  lastName: 'Ronaldo',
  jobTitle: 'Junior',
  institution: 'Dollar General Corporation',
  degree: 'MPH',
  country: 'United Kingdom',
  city: 'Brighton',
  teams: [
    {
      id: 'team-id-1',
      displayName: 'Jackson, M',
      role: 'Lead PI (Core Leadership)',
      proposal: 'proposal-id-1',
      approach: 'Exact',
      responsibilities: 'Make sure coverage is high',
    },
    {
      id: 'team-id-3',
      displayName: 'Tarantino, M',
      proposal: 'proposal-id-2',
      role: 'Collaborating PI',
    },
  ],
  orcid: '363-98-9330',
  orcidWorks: [],
  social: {
    orcid: '363-98-9330',
  },
  skills: ['skill 1', 'skill 2', 'skill 3', 'skill 4', 'skill 5'],
  questions: ['Question 1', 'Question 2'],
  avatarUrl: `${config.baseUrl}/api/assets/${config.appName}/squidex-asset-id`,
  role: 'Grantee',
  labs: [
    { id: 'cd7be4904', name: 'Manchester' },
    { id: 'cd7be4905', name: 'Glasgow' },
  ],
};

export const fetchExpectation: ListUserResponse = {
  total: 2,
  items: [
    {
      id: 'userId1',
      onboarded: true,
      createdDate: '2020-09-23T20:45:22.000Z',
      questions: [],
      skills: ['React'],
      displayName: 'Tom Hardy',
      email: 'H@rdy.io',
      contactEmail: 'T@rdy.io',
      firstName: 'Tom',
      lastName: 'Hardy',
      country: 'United Kingdom',
      city: 'London',
      lastModifiedDate: '2020-09-23T20:45:22.000Z',
      orcidWorks: [],
      orcid: '123-456-789',
      degree: 'MPH',
      social: {
        orcid: '123-456-789',
      },
      teams: [
        {
          id: 'userId3',
          role: 'Lead PI (Core Leadership)',
          displayName: 'Jackson, M',
          proposal: 'proposalId',
        },
      ],
      role: 'Grantee',
      labs: [
        { id: 'cd7be4902', name: 'Brighton' },
        { id: 'cd7be4903', name: 'Liverpool' },
      ],
    },
    {
      id: 'userId2',
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
      orcidWorks: [],
      social: {
        github: 'awesome',
      },
      teams: [
        {
          id: 'userId3',
          role: 'Project Manager',
          displayName: 'Jackson, M',
          approach: 'cover',
          responsibilities: 'increase coverage',
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

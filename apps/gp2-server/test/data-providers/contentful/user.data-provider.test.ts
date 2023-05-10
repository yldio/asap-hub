import {
  addLocaleToFields,
  Entry,
  Environment,
  getGP2ContentfulGraphqlClientMockServer,
  gp2 as gp2Contentful,
  patchAndPublish,
} from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import nock from 'nock';
import { appName, baseUrl } from '../../../src/config';
import { UserContentfulDataProvider } from '../../../src/data-providers/contentful/users.data-provider';
import { UserDataProvider } from '../../../src/data-providers/types';
import { getEntry } from '../../fixtures/contentful.fixtures';
import {
  fetchUserResponse,
  getContentfulGraphql,
  getContentfulGraphqlUser,
  getContentfulUsersByProjectId,
  getContentfulUsersByWorkingGroupId,
  getContentfulUsersGraphqlResponse,
  getUserCreateDataObject,
  getUserDataObject,
} from '../../fixtures/user.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';

jest.mock('@asap-hub/contentful', () => ({
  ...jest.requireActual('@asap-hub/contentful'),
  patchAndPublish: jest.fn().mockResolvedValue(undefined),
}));
describe('User data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const userDataProvider: UserDataProvider = new UserContentfulDataProvider(
    contentfulGraphqlClientMock,
    contentfulRestClientMock,
  );

  beforeEach(jest.resetAllMocks);

  describe('FetchById', () => {
    test('Should fetch the users from contentful graphql', async () => {
      const contentfulGraphqlClientMockServer =
        getGP2ContentfulGraphqlClientMockServer(getContentfulGraphql());
      const userDataProviderWithMockServer: UserDataProvider =
        new UserContentfulDataProvider(
          contentfulGraphqlClientMockServer,
          contentfulRestClientMock,
        );
      const result = await userDataProviderWithMockServer.fetchById('user-id');

      expect(result).toMatchObject(getUserDataObject());
    });
    test('Should return the user when it finds it', async () => {
      const mockResponse = getContentfulGraphqlUser();
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: mockResponse,
      });

      const result = await userDataProvider.fetchById('user-id');
      expect(result).toEqual(getUserDataObject());
    });
    test('Should throw when the user has role undefined', async () => {
      const mockResponse = getContentfulGraphqlUser({
        role: null,
      });
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: mockResponse,
      });

      expect(() =>
        userDataProvider.fetchById('user-id'),
      ).rejects.toThrowErrorMatchingInlineSnapshot('"Role not defined: null"');
    });

    test('Should throw when the user has region undefined', async () => {
      const mockResponse = getContentfulGraphqlUser({
        region: null,
      });
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: mockResponse,
      });

      expect(() =>
        userDataProvider.fetchById('user-id'),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        '"Region not defined: null"',
      );
    });

    test.each(gp2Model.userDegrees)(
      'Should correctly map MD, PhD Correctly - %s',
      async (degree) => {
        const expected = degree;
        const degreeUser = getContentfulGraphqlUser();
        degreeUser.degrees = [degree];
        const mockResponse = getContentfulGraphqlUser(degreeUser);
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        const result = await userDataProvider.fetchById('user-id');
        expect(result?.degrees).toEqual([expected]);
      },
    );
    test('degrees default to empty array', async () => {
      const mockResponse = getContentfulGraphqlUser({
        degrees: null,
      });
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: mockResponse,
      });
      const result = await userDataProvider.fetchById('user-id');
      expect(result!.degrees).toEqual([]);
    });

    test('connections default to empty array', async () => {
      const mockResponse = getContentfulGraphqlUser({
        connections: null,
      });
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: mockResponse,
      });
      const result = await userDataProvider.fetchById('user-id');
      expect(result!.connections).toEqual([]);
    });

    test.each`
      region                      | expected
      ${'Africa'}                 | ${'Africa'}
      ${'Asia'}                   | ${'Asia'}
      ${'Australia/Australiasia'} | ${'Australia/Australiasia'}
      ${'Europe'}                 | ${'Europe'}
      ${'North America'}          | ${'North America'}
      ${'South America'}          | ${'South America'}
      ${'Latin America'}          | ${'Latin America'}
    `(
      'Should correctly map regions $region => $expected',
      async ({ region, expected }) => {
        const mockResponse = getContentfulGraphqlUser({ region });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        const result = await userDataProvider.fetchById('user-id');
        expect(result?.region).toEqual(expected);
      },
    );

    test.each`
      role                           | expected
      ${'Working Group Participant'} | ${'Working Group Participant'}
      ${'Network Investigator'}      | ${'Network Investigator'}
      ${'Network Collaborator'}      | ${'Network Collaborator'}
      ${'Administrator'}             | ${'Administrator'}
      ${'Trainee'}                   | ${'Trainee'}
    `(
      'Should correctly map role $role => $expected',
      async ({ role, expected }) => {
        const mockResponse = getContentfulGraphqlUser({ role });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        const result = await userDataProvider.fetchById('user-id');
        expect(result?.role).toEqual(expected);
      },
    );

    test.each(gp2Model.keywords)('keywords are added - %s', async (keyword) => {
      const keywords = [keyword];
      const mockResponse = getContentfulGraphqlUser({ keywords });
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: mockResponse,
      });
      const result = await userDataProvider.fetchById('user-id');
      expect(result?.keywords).toEqual(keywords);
    });

    test('keywords are valid', async () => {
      const keywords = ['invalid-keyword'];
      const mockResponse = getContentfulGraphqlUser({ keywords });
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: mockResponse,
      });
      expect(() => userDataProvider.fetchById('user-id')).rejects.toThrow();
    });

    test('questions are added', async () => {
      const questions = ['a valid question'];
      const mockResponse = getContentfulGraphqlUser({ questions });
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: mockResponse,
      });
      const result = await userDataProvider.fetchById('user-id');
      expect(result?.questions).toEqual(questions);
    });
    test('avatar is added', async () => {
      const avatar = {
        url: 'avatar-id',
      };
      const mockResponse = getContentfulGraphqlUser({ avatar });
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: mockResponse,
      });
      const result = await userDataProvider.fetchById('user-id');
      expect(result?.avatarUrl).toEqual(expect.stringContaining('avatar-id'));
    });

    test('questions default to empty array', async () => {
      const questions = null;
      const mockResponse = getContentfulGraphqlUser({ questions });
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: mockResponse,
      });
      const result = await userDataProvider.fetchById('user-id');
      expect(result?.questions).toEqual([]);
    });

    describe('positions', () => {
      const position = {
        role: 'CEO',
        department: 'Research',
        institution: 'Stark Industries',
      };
      test.each(['role', 'department', 'institution'])(
        'Should throw when the position has %s not defined',
        async (item) => {
          const positions = [
            {
              ...position,
              [item]: null,
            },
          ];
          const mockResponse = getContentfulGraphqlUser({ positions });
          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            users: mockResponse,
          });

          expect(() =>
            userDataProvider.fetchById('user-id'),
          ).rejects.toThrowError('Position not defined');
        },
      );
      test('Should return empty array if positions has not been defined', async () => {
        const positions = null;
        const mockResponse = getContentfulGraphqlUser({ positions });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        const result = await userDataProvider.fetchById('user-id');
        expect(result?.positions).toEqual([]);
      });
    });
    describe('contributing cohorts', () => {
      test('Should throw when the cohort id is null ', async () => {
        const contributingCohort = {
          sys: { id: null },
          name: 'GeneFinder',
        };
        const contributingCohortsCollection = {
          items: [
            {
              contributingCohort,
              role: 'Investigator',
              studyLink: 'http://example.com/test',
            },
          ],
        };
        const mockResponse = getContentfulGraphqlUser({
          contributingCohortsCollection,
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        expect(() =>
          userDataProvider.fetchById('user-id'),
        ).rejects.toThrowError('Invalid Contributing Cohort');
      });

      test('Should throw when the cohort role is null ', async () => {
        const contributingCohort = {
          sys: { id: '42' },
          name: 'GeneFinder',
        };
        const contributingCohortsCollection = {
          items: [
            {
              contributingCohort,
              role: null,
              studyLink: 'http://example.com/test',
            },
          ],
        };
        const mockResponse = getContentfulGraphqlUser({
          contributingCohortsCollection,
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        expect(() =>
          userDataProvider.fetchById('user-id'),
        ).rejects.toThrowError('Invalid Contributing Cohort');
      });

      test('Should throw when the cohort name is null ', async () => {
        const contributingCohort = {
          sys: { id: '42' },
          name: null,
        };
        const contributingCohortsCollection = {
          items: [
            {
              contributingCohort,
              role: 'Investigator',
              studyLink: 'http://example.com/test',
            },
          ],
        };
        const mockResponse = getContentfulGraphqlUser({
          contributingCohortsCollection,
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        expect(() =>
          userDataProvider.fetchById('user-id'),
        ).rejects.toThrowError('Invalid Contributing Cohort');
      });
      test('Should return empty array if cohorts have not been defined', async () => {
        const mockResponse = getContentfulGraphqlUser({
          contributingCohortsCollection: null,
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        const result = await userDataProvider.fetchById('user-id');
        expect(result?.contributingCohorts).toEqual([]);
      });
      test.each`
        role                   | expectedRole
        ${'Investigator'}      | ${'Investigator'}
        ${'Co-Investigator'}   | ${'Co-Investigator'}
        ${'Lead Investigator'} | ${'Lead Investigator'}
      `(
        'should parse the role $role => $expectedRole',
        async ({ role, expectedRole }) => {
          const contributingCohort = {
            sys: { id: '42' },
            name: 'GeneFinder',
          };
          const contributingCohortsCollection = {
            items: [
              {
                contributingCohort,
                role,
                studyLink: 'http://example.com/test',
              },
            ],
          };
          const mockResponse = getContentfulGraphqlUser({
            contributingCohortsCollection,
          });
          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            users: mockResponse,
          });
          const result = await userDataProvider.fetchById('user-id');
          expect(result?.contributingCohorts[0]?.role).toEqual(expectedRole);
        },
      );
    });
    describe('projects', () => {
      test('Should return empty array if no projects collection', async () => {
        const mockResponse = getContentfulGraphqlUser({ linkedFrom: {} });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        const result = await userDataProvider.fetchById('user-id');
        expect(result?.projects).toEqual([]);
      });
      test('Should return empty array if project collection items has not been defined', async () => {
        const mockResponse = getContentfulGraphqlUser({
          linkedFrom: {
            projectMembershipCollection: {},
          },
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        const result = await userDataProvider.fetchById('user-id');
        expect(result?.projects).toEqual([]);
      });
      test('Should return empty array if no project collection items', async () => {
        const mockResponse = getContentfulGraphqlUser({
          linkedFrom: {
            projectMembershipCollection: { items: [] },
          },
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        const result = await userDataProvider.fetchById('user-id');
        expect(result?.projects).toEqual([]);
      });
      test('Should return empty array if no linked project', async () => {
        const mockResponse = getContentfulGraphqlUser({
          linkedFrom: {
            projectMembershipCollection: {
              items: [
                {
                  user: {
                    sys: {
                      id: '42',
                    },
                  },
                  role: 'Project lead',
                  linkedFrom: {
                    projectsCollection: {
                      items: [],
                    },
                  },
                },
              ],
            },
          },
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        const result = await userDataProvider.fetchById('user-id');
        expect(result?.projects).toEqual([]);
      });
      const getProjectGraphQL = ({
        status = 'Active',
        role = 'Investigator',
        user = {
          sys: {
            id: '42',
          },
        },
      }: {
        status?: string | null;
        role?: string | null;
        user?: { sys: { id: string } } | null;
      } = {}) => ({
        user: {
          sys: {
            id: '42',
          },
        },
        role: 'Project lead',
        linkedFrom: {
          projectsCollection: {
            items: [
              {
                sys: {
                  id: '19jFNrTz1LeqV8T4zLzVnF',
                },
                title: 'Test Project',
                status,
                membersCollection: {
                  items: [
                    {
                      user,
                      role,
                    },
                  ],
                },
              },
            ],
          },
        },
      });
      test('Should throw when the status is not defined', async () => {
        const mockResponse = getContentfulGraphqlUser({
          linkedFrom: {
            projectMembershipCollection: {
              items: [getProjectGraphQL({ status: null })],
            },
          },
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        expect(() =>
          userDataProvider.fetchById('user-id'),
        ).rejects.toThrowError('Status not defined');
      });
      test('Should throw when a members role is not defined', async () => {
        const mockResponse = getContentfulGraphqlUser({
          linkedFrom: {
            projectMembershipCollection: {
              items: [getProjectGraphQL({ role: null })],
            },
          },
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        expect(() =>
          userDataProvider.fetchById('user-id'),
        ).rejects.toThrowError('Invalid project members');
      });
      test('Should throw when a members user is not defined', async () => {
        const mockResponse = getContentfulGraphqlUser({
          linkedFrom: {
            projectMembershipCollection: {
              items: [getProjectGraphQL({ user: null })],
            },
          },
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        expect(() =>
          userDataProvider.fetchById('user-id'),
        ).rejects.toThrowError('Invalid project members');
      });
      test.each`
        role                 | expectedRole
        ${'Project manager'} | ${'Project manager'}
        ${'Project lead'}    | ${'Project lead'}
        ${'Project co-lead'} | ${'Project co-lead'}
        ${'Contributor'}     | ${'Contributor'}
        ${'Investigator'}    | ${'Investigator'}
      `(
        'should parse the role $role => $expectedRole',
        async ({ role, expectedRole }) => {
          const mockResponse = getContentfulGraphqlUser({
            linkedFrom: {
              projectMembershipCollection: {
                items: [getProjectGraphQL({ role })],
              },
            },
          });
          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            users: mockResponse,
          });
          const result = await userDataProvider.fetchById('user-id');
          expect(result?.projects[0]?.members[0]!.role).toEqual(expectedRole);
        },
      );
      test('check multiple members', async () => {
        const mockResponse = getContentfulGraphqlUser({
          linkedFrom: {
            projectMembershipCollection: {
              items: [
                {
                  linkedFrom: {
                    projectsCollection: {
                      items: [
                        {
                          sys: {
                            id: '11',
                          },
                          title: 'Test Project',
                          status: 'Active',
                          membersCollection: {
                            items: [
                              {
                                role: 'Contributor',
                                user: {
                                  sys: {
                                    id: '23',
                                  },
                                },
                              },
                              {
                                role: 'Project lead',
                                user: {
                                  sys: {
                                    id: '27',
                                  },
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });
        const result = await userDataProvider.fetchById('user-id');
        expect(result?.projects[0]?.members).toHaveLength(2);
        expect(result?.projects[0]?.members).toEqual([
          { role: 'Contributor', userId: '23' },
          { role: 'Project lead', userId: '27' },
        ]);
      });
      test('members empty', async () => {
        const mockResponse = getContentfulGraphqlUser({
          linkedFrom: {
            projectMembershipCollection: {
              items: [
                {
                  linkedFrom: {
                    projectsCollection: {
                      items: [
                        {
                          sys: {
                            id: '11',
                          },
                          title: 'Test Project',
                          status: 'Active',
                          membersCollection: {
                            items: [],
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        const result = await userDataProvider.fetchById('user-id');
        expect(result?.projects[0]?.members).toHaveLength(0);
      });
    });
    describe('working groups', () => {
      const getWorkingGroupGraphQL = ({
        role = 'Co-lead',
        user = {
          sys: {
            id: '42',
          },
        },
      }: {
        role?: string | null;
        user?: { sys: { id: string } } | null;
      } = {}) => ({
        user,
        role,
        linkedFrom: {
          workingGroupsCollection: {
            items: [
              {
                sys: {
                  id: '7',
                },
                title: 'Test working group',
                membersCollection: {
                  items: [
                    {
                      user,
                      role,
                    },
                  ],
                },
              },
            ],
          },
        },
      });
      test('Should return empty array if working group has not been defined', async () => {
        const mockResponse = getContentfulGraphqlUser({
          linkedFrom: { workingGroupMembershipCollection: null },
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        const result = await userDataProvider.fetchById('user-id');
        expect(result?.workingGroups).toEqual([]);
      });
      test('Should throw when a members role is not defined', async () => {
        const mockResponse = getContentfulGraphqlUser({
          linkedFrom: {
            workingGroupMembershipCollection: {
              items: [getWorkingGroupGraphQL({ role: null })],
            },
          },
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        expect(() =>
          userDataProvider.fetchById('user-id'),
        ).rejects.toThrowError('Invalid working group members');
      });
      test('Should throw when a members user is not defined', async () => {
        const mockResponse = getContentfulGraphqlUser({
          linkedFrom: {
            workingGroupMembershipCollection: {
              items: [getWorkingGroupGraphQL({ user: null })],
            },
          },
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        expect(() =>
          userDataProvider.fetchById('user-id'),
        ).rejects.toThrowError('Invalid working group members');
      });
      test.each`
        role                      | expectedRole
        ${'Lead'}                 | ${'Lead'}
        ${'Co-lead'}              | ${'Co-lead'}
        ${'Working group member'} | ${'Working group member'}
      `(
        'should parse the role $role => $expectedRole',
        async ({ role, expectedRole }) => {
          const mockResponse = getContentfulGraphqlUser({
            linkedFrom: {
              workingGroupMembershipCollection: {
                items: [getWorkingGroupGraphQL({ role })],
              },
            },
          });
          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            users: mockResponse,
          });
          const result = await userDataProvider.fetchById('user-id');
          expect(result?.workingGroups[0]?.members[0]!.role).toEqual(
            expectedRole,
          );
        },
      );
      test('check multiple members', async () => {
        const mockResponse = getContentfulGraphqlUser({
          linkedFrom: {
            workingGroupMembershipCollection: {
              items: [
                {
                  user: {
                    sys: {
                      id: '42',
                    },
                  },
                  role: 'Co-lead',
                  linkedFrom: {
                    workingGroupsCollection: {
                      items: [
                        {
                          sys: {
                            id: '7',
                          },
                          title: 'Test working group',
                          membersCollection: {
                            items: [
                              {
                                role: 'Co-lead',
                                user: {
                                  sys: {
                                    id: '23',
                                  },
                                },
                              },
                              {
                                role: 'Lead',
                                user: {
                                  sys: {
                                    id: '27',
                                  },
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });
        const result = await userDataProvider.fetchById('user-id');
        expect(result?.workingGroups[0]?.members).toHaveLength(2);
        expect(result?.workingGroups[0]?.members).toEqual([
          { role: 'Co-lead', userId: '23' },
          { role: 'Lead', userId: '27' },
        ]);
      });
      test('members undefined', async () => {
        const mockResponse = getContentfulGraphqlUser({
          linkedFrom: {
            workingGroupMembershipCollection: {
              items: [
                {
                  user: {
                    sys: {
                      id: '42',
                    },
                  },
                  role: 'Co-lead',
                  linkedFrom: {
                    workingGroupsCollection: {
                      items: [
                        {
                          sys: {
                            id: '7',
                          },
                          title: 'Test working group',
                          membersCollection: {
                            items: [],
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        const result = await userDataProvider.fetchById('user-id');
        expect(result?.workingGroups[0]?.members).toHaveLength(0);
      });
    });
    describe('telephone', () => {
      test('Should return undefined telephone if both the number and country code have not been defined', async () => {
        const mockResponse = getContentfulGraphqlUser({
          telephoneNumber: null,
          telephoneCountryCode: null,
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        const result = await userDataProvider.fetchById('user-id');
        expect(result?.telephone).toBeUndefined();
      });
      test('Should return undefined telephone number if the number has not been defined', async () => {
        const mockResponse = getContentfulGraphqlUser({
          telephoneNumber: null,
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        const result = await userDataProvider.fetchById('user-id');
        expect(result?.telephone?.number).toBeUndefined();
        expect(result?.telephone?.countryCode).toEqual('+1');
      });
      test('Should return undefined telephone country code if the country code has not been defined', async () => {
        const mockResponse = getContentfulGraphqlUser({
          telephoneCountryCode: null,
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        const result = await userDataProvider.fetchById('user-id');
        expect(result?.telephone?.countryCode).toBeUndefined();
        expect(result?.telephone?.number).toEqual('212-970-4133');
      });
    });

    describe('social', () => {
      test('should return social props undefined if they have not been defined', async () => {
        const mockResponse = getContentfulGraphqlUser({
          googleScholar: null,
          orcid: null,
          blog: null,
          twitter: null,
          linkedIn: null,
          github: null,
          researcherId: null,
          researchGate: null,
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        const result = await userDataProvider.fetchById('user-id');
        expect(result?.social).toEqual({});
      });
    });
  });

  describe('Fetch', () => {
    beforeEach(jest.resetAllMocks);
    test('Should fetch the users from contentful graphql', async () => {
      const contentfulGraphqlClientMockServer =
        getGP2ContentfulGraphqlClientMockServer(getContentfulGraphql());
      const userDataProviderWithMockServer: UserDataProvider =
        new UserContentfulDataProvider(
          contentfulGraphqlClientMockServer,
          contentfulRestClientMock,
        );
      const result = await userDataProviderWithMockServer.fetch({});

      expect(result).toMatchObject({ total: 1, items: [getUserDataObject()] });
    });
    test('Should return an empty result', async () => {
      const mockResponse = getContentfulUsersGraphqlResponse();
      mockResponse.usersCollection!.items = [];
      mockResponse.usersCollection!.total = 0;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await userDataProvider.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });
    test('Should return an empty result when the client returns a response with query property set to null', async () => {
      const mockResponse = getContentfulUsersGraphqlResponse();
      mockResponse.usersCollection = null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await userDataProvider.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should query with onboarded filter', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getContentfulUsersGraphqlResponse(),
      );
      const fetchOptions: gp2Model.FetchUsersOptions = {
        take: 12,
        skip: 2,
        filter: {
          onlyOnboarded: true,
        },
      };
      const users = await userDataProvider.fetch(fetchOptions);

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        gp2Contentful.FETCH_USERS,
        expect.objectContaining({
          limit: 12,
          skip: 2,
          where: expect.objectContaining({
            onboarded: true,
            role_not: 'Hidden',
          }),
        }),
      );
      expect(users).toMatchObject({ total: 1, items: [getUserDataObject()] });
    });

    test('Should return all users when the onlyOnboard flag is false', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getContentfulUsersGraphqlResponse(),
      );
      const fetchOptions: gp2Model.FetchUsersOptions = {
        take: 12,
        skip: 2,
        filter: {
          onlyOnboarded: false,
        },
      };
      const users = await userDataProvider.fetch(fetchOptions);

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        gp2Contentful.FETCH_USERS,
        expect.objectContaining({
          limit: 12,
          skip: 2,
          where: expect.objectContaining({
            role_not: 'Hidden',
          }),
        }),
      );
      expect(users).toMatchObject({ total: 1, items: [getUserDataObject()] });
    });

    test.each`
      name          | value                 | fieldName
      ${'regions'}  | ${['Africa', 'Asia']} | ${'regions'}
      ${'keywords'} | ${['Bash', 'R']}      | ${'keywords'}
    `('Should query with $name filters', async ({ name, value, fieldName }) => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getContentfulUsersGraphqlResponse(),
      );
      const fetchOptions: gp2Model.FetchUsersOptions = {
        take: 12,
        skip: 2,
        filter: {
          [name]: value,
        },
      };
      await userDataProvider.fetch(fetchOptions);

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        gp2Contentful.FETCH_USERS,
        expect.objectContaining({
          limit: 12,
          skip: 2,
          where: expect.objectContaining({
            role_not: 'Hidden',
            [`${fieldName}_in`]: value,
          }),
        }),
      );
    });

    describe('projects filter', () => {
      test('it should be able to filter by project', async () => {
        const projectId = '140f5e15-922d-4cbf-9d39-35dd39225b03';
        const userId = '11';
        const projectMembers = getContentfulUsersByProjectId(userId);

        contentfulGraphqlClientMock.request
          .mockResolvedValueOnce(projectMembers)
          .mockResolvedValueOnce(getContentfulUsersGraphqlResponse());
        const fetchOptions: gp2Model.FetchUsersOptions = {
          take: 12,
          skip: 2,
          filter: {
            projects: [projectId],
          },
        };
        await userDataProvider.fetch(fetchOptions);

        expect(contentfulGraphqlClientMock.request).toBeCalledTimes(2);
        expect(contentfulGraphqlClientMock.request).toHaveBeenNthCalledWith(
          1,
          gp2Contentful.FETCH_USERS_BY_PROJECT_ID,
          expect.objectContaining({
            id: [projectId],
          }),
        );
        expect(contentfulGraphqlClientMock.request).toHaveBeenNthCalledWith(
          2,
          gp2Contentful.FETCH_USERS,
          expect.objectContaining({
            limit: 12,
            skip: 2,
            where: expect.objectContaining({
              role_not: 'Hidden',
              sys: { id_in: ['11'] },
            }),
          }),
        );
      });
      test('it should be able to filter by projects', async () => {
        const project1Id = '140f5e15-922d-4cbf-9d39-35dd39225b03';
        const project2Id = '140f5e15-922d-4cbf-9d39-35dd39225b04';
        const user1Id = '11';
        const user2Id = '7';
        const project1Members =
          getContentfulUsersByProjectId(user1Id).projectsCollection.items;
        const project2Members =
          getContentfulUsersByProjectId(user2Id).projectsCollection.items;

        const projectMembersResponse = {
          projectsCollection: {
            total: 2,
            items: [project1Members, project2Members].flat(),
          },
        };
        contentfulGraphqlClientMock.request
          .mockResolvedValueOnce(projectMembersResponse)
          .mockResolvedValueOnce(getContentfulUsersGraphqlResponse());
        const fetchOptions: gp2Model.FetchUsersOptions = {
          take: 12,
          skip: 2,
          filter: {
            projects: [project1Id, project2Id],
          },
        };
        await userDataProvider.fetch(fetchOptions);

        expect(contentfulGraphqlClientMock.request).toBeCalledTimes(2);
        expect(contentfulGraphqlClientMock.request).toHaveBeenNthCalledWith(
          1,
          gp2Contentful.FETCH_USERS_BY_PROJECT_ID,
          expect.objectContaining({
            id: [project1Id, project2Id],
          }),
        );
        expect(contentfulGraphqlClientMock.request).toHaveBeenNthCalledWith(
          2,
          gp2Contentful.FETCH_USERS,
          expect.objectContaining({
            limit: 12,
            skip: 2,
            where: expect.objectContaining({
              role_not: 'Hidden',
              sys: { id_in: [user1Id, user2Id] },
            }),
          }),
        );
      });
      test('it should be able to filter by projects and multiple users', async () => {
        const project1Id = '140f5e15-922d-4cbf-9d39-35dd39225b03';
        const project2Id = '140f5e15-922d-4cbf-9d39-35dd39225b04';
        const user1Id = '11';
        const user2Id = '7';
        const user3Id = '23';
        const project1Members =
          getContentfulUsersByProjectId(user1Id).projectsCollection.items;
        const project2Members = getContentfulUsersByProjectId(user2Id, user3Id)
          .projectsCollection.items;

        const projectMembersResponse = {
          projectsCollection: {
            total: 2,
            items: [project1Members, project2Members].flat(),
          },
        };
        contentfulGraphqlClientMock.request
          .mockResolvedValueOnce(projectMembersResponse)
          .mockResolvedValueOnce(getContentfulUsersGraphqlResponse());
        const fetchOptions: gp2Model.FetchUsersOptions = {
          take: 12,
          skip: 2,
          filter: {
            projects: [project1Id, project2Id],
          },
        };
        await userDataProvider.fetch(fetchOptions);

        expect(contentfulGraphqlClientMock.request).toBeCalledTimes(2);
        expect(contentfulGraphqlClientMock.request).toHaveBeenNthCalledWith(
          1,
          gp2Contentful.FETCH_USERS_BY_PROJECT_ID,
          expect.objectContaining({
            id: [project1Id, project2Id],
          }),
        );
        expect(contentfulGraphqlClientMock.request).toHaveBeenNthCalledWith(
          2,
          gp2Contentful.FETCH_USERS,
          expect.objectContaining({
            limit: 12,
            skip: 2,
            where: expect.objectContaining({
              role_not: 'Hidden',
              sys: { id_in: [user1Id, user2Id, user3Id] },
            }),
          }),
        );
      });
      test('it should be able to filter out duplicate user Ids', async () => {
        const project1Id = '140f5e15-922d-4cbf-9d39-35dd39225b03';
        const project2Id = '140f5e15-922d-4cbf-9d39-35dd39225b04';
        const user1Id = '11';
        const user2Id = '11';
        const project1Members =
          getContentfulUsersByProjectId(user1Id).projectsCollection.items;
        const project2Members =
          getContentfulUsersByProjectId(user2Id).projectsCollection.items;

        const projectMembersResponse = {
          projectsCollection: {
            total: 2,
            items: [project1Members, project2Members].flat(),
          },
        };
        contentfulGraphqlClientMock.request
          .mockResolvedValueOnce(projectMembersResponse)
          .mockResolvedValueOnce(getContentfulUsersGraphqlResponse());
        const fetchOptions: gp2Model.FetchUsersOptions = {
          take: 12,
          skip: 2,
          filter: {
            projects: [project1Id, project2Id],
          },
        };
        await userDataProvider.fetch(fetchOptions);

        expect(contentfulGraphqlClientMock.request).toBeCalledTimes(2);
        expect(contentfulGraphqlClientMock.request).toHaveBeenNthCalledWith(
          1,
          gp2Contentful.FETCH_USERS_BY_PROJECT_ID,
          expect.objectContaining({
            id: [project1Id, project2Id],
          }),
        );
        expect(contentfulGraphqlClientMock.request).toHaveBeenNthCalledWith(
          2,
          gp2Contentful.FETCH_USERS,
          expect.objectContaining({
            limit: 12,
            skip: 2,
            where: expect.objectContaining({
              role_not: 'Hidden',
              sys: { id_in: [user1Id] },
            }),
          }),
        );
      });
    });

    describe('working groups filter', () => {
      test('it should be able to filter by working group', async () => {
        const workingGroupId = '3ec68d44-82c1-4855-b6a0-ba44b9e313ba';
        const userId = '11';
        const workingGroupMembersResponse =
          getContentfulUsersByWorkingGroupId(userId);

        contentfulGraphqlClientMock.request
          .mockResolvedValueOnce(workingGroupMembersResponse)
          .mockResolvedValueOnce(getContentfulUsersGraphqlResponse());
        const fetchOptions: gp2Model.FetchUsersOptions = {
          take: 12,
          skip: 2,
          filter: {
            workingGroups: [workingGroupId],
          },
        };
        await userDataProvider.fetch(fetchOptions);

        expect(contentfulGraphqlClientMock.request).toBeCalledTimes(2);
        expect(contentfulGraphqlClientMock.request).toHaveBeenNthCalledWith(
          1,
          gp2Contentful.FETCH_USERS_BY_WORKING_GROUP_ID,
          expect.objectContaining({
            id: [workingGroupId],
          }),
        );
        expect(contentfulGraphqlClientMock.request).toHaveBeenNthCalledWith(
          2,
          gp2Contentful.FETCH_USERS,
          expect.objectContaining({
            limit: 12,
            skip: 2,
            where: expect.objectContaining({
              role_not: 'Hidden',
              sys: { id_in: [userId] },
            }),
          }),
        );
      });
      test('it should be able to filter by workingGroups', async () => {
        const workingGroup1Id = '3ec68d44-82c1-4855-b6a0-ba44b9e313ba';
        const workingGroup2Id = '3ec68d44-82c1-4855-b6a0-ba44b9e313bb';
        const user1Id = '11';
        const user2Id = '7';
        const workingGroup1Members =
          getContentfulUsersByProjectId(user1Id).projectsCollection.items;
        const workingGroup2Members =
          getContentfulUsersByProjectId(user2Id).projectsCollection.items;

        const workingGroupMembersResponse = {
          workingGroupsCollection: {
            total: 2,
            items: [workingGroup1Members, workingGroup2Members].flat(),
          },
        };

        contentfulGraphqlClientMock.request
          .mockResolvedValueOnce(workingGroupMembersResponse)
          .mockResolvedValueOnce(getContentfulUsersGraphqlResponse());
        const fetchOptions: gp2Model.FetchUsersOptions = {
          take: 12,
          skip: 2,
          filter: {
            workingGroups: [workingGroup1Id, workingGroup2Id],
          },
        };
        await userDataProvider.fetch(fetchOptions);

        expect(contentfulGraphqlClientMock.request).toBeCalledTimes(2);
        expect(contentfulGraphqlClientMock.request).toHaveBeenNthCalledWith(
          1,
          gp2Contentful.FETCH_USERS_BY_WORKING_GROUP_ID,
          expect.objectContaining({
            id: [workingGroup1Id, workingGroup2Id],
          }),
        );
        expect(contentfulGraphqlClientMock.request).toHaveBeenNthCalledWith(
          2,
          gp2Contentful.FETCH_USERS,
          expect.objectContaining({
            limit: 12,
            skip: 2,
            where: expect.objectContaining({
              role_not: 'Hidden',
              sys: { id_in: [user1Id, user2Id] },
            }),
          }),
        );
      });
      test('it should be able to filter by workingGroups and multiple users', async () => {
        const workingGroup1Id = '3ec68d44-82c1-4855-b6a0-ba44b9e313ba';
        const workingGroup2Id = '3ec68d44-82c1-4855-b6a0-ba44b9e313bb';
        const user1Id = '11';
        const user2Id = '7';
        const user3Id = '23';
        const workingGroup1Members =
          getContentfulUsersByProjectId(user1Id).projectsCollection.items;
        const workingGroup2Members = getContentfulUsersByProjectId(
          user2Id,
          user3Id,
        ).projectsCollection.items;
        const workingGroupMembersResponse = {
          workingGroupsCollection: {
            total: 2,
            items: [workingGroup1Members, workingGroup2Members].flat(),
          },
        };

        contentfulGraphqlClientMock.request
          .mockResolvedValueOnce(workingGroupMembersResponse)
          .mockResolvedValueOnce(getContentfulUsersGraphqlResponse());
        const fetchOptions: gp2Model.FetchUsersOptions = {
          take: 12,
          skip: 2,
          filter: {
            workingGroups: [workingGroup1Id, workingGroup2Id],
          },
        };
        await userDataProvider.fetch(fetchOptions);

        expect(contentfulGraphqlClientMock.request).toBeCalledTimes(2);
        expect(contentfulGraphqlClientMock.request).toHaveBeenNthCalledWith(
          1,
          gp2Contentful.FETCH_USERS_BY_WORKING_GROUP_ID,
          expect.objectContaining({
            id: [workingGroup1Id, workingGroup2Id],
          }),
        );
        expect(contentfulGraphqlClientMock.request).toHaveBeenNthCalledWith(
          2,
          gp2Contentful.FETCH_USERS,
          expect.objectContaining({
            limit: 12,
            skip: 2,
            where: expect.objectContaining({
              role_not: 'Hidden',
              sys: { id_in: [user1Id, user2Id, user3Id] },
            }),
          }),
        );
      });
      test('it should be able to filter out duplicate user Ids', async () => {
        const workingGroup1Id = '3ec68d44-82c1-4855-b6a0-ba44b9e313ba';
        const workingGroup2Id = '3ec68d44-82c1-4855-b6a0-ba44b9e313bb';
        const user1Id = '11';
        const user2Id = '11';
        const workingGroup1Members =
          getContentfulUsersByProjectId(user1Id).projectsCollection.items;
        const workingGroup2Members =
          getContentfulUsersByProjectId(user2Id).projectsCollection.items;
        const workingGroupMembersResponse = {
          workingGroupsCollection: {
            total: 2,
            items: [workingGroup1Members, workingGroup2Members].flat(),
          },
        };

        contentfulGraphqlClientMock.request
          .mockResolvedValueOnce(workingGroupMembersResponse)
          .mockResolvedValueOnce(getContentfulUsersGraphqlResponse());
        const fetchOptions: gp2Model.FetchUsersOptions = {
          take: 12,
          skip: 2,
          filter: {
            workingGroups: [workingGroup1Id, workingGroup2Id],
          },
        };
        await userDataProvider.fetch(fetchOptions);

        expect(contentfulGraphqlClientMock.request).toBeCalledTimes(2);
        expect(contentfulGraphqlClientMock.request).toHaveBeenNthCalledWith(
          1,
          gp2Contentful.FETCH_USERS_BY_WORKING_GROUP_ID,
          expect.objectContaining({
            id: [workingGroup1Id, workingGroup2Id],
          }),
        );
        expect(contentfulGraphqlClientMock.request).toHaveBeenNthCalledWith(
          2,
          gp2Contentful.FETCH_USERS,
          expect.objectContaining({
            limit: 12,
            skip: 2,
            where: expect.objectContaining({
              role_not: 'Hidden',
              sys: { id_in: [user1Id] },
            }),
          }),
        );
      });
    });
    test('it should be able to filter out duplicate user Ids when both the project and working group filters are defined', async () => {
      const projectId = '140f5e15-922d-4cbf-9d39-35dd39225b03';
      const workingGroupId = '3ec68d44-82c1-4855-b6a0-ba44b9e313bb';
      const user1Id = '11';
      const user2Id = '11';

      const workingGroupMembersResponse =
        getContentfulUsersByWorkingGroupId(user2Id);
      const projectMembersResponse = getContentfulUsersByProjectId(user1Id);

      contentfulGraphqlClientMock.request
        .mockResolvedValueOnce(projectMembersResponse)
        .mockResolvedValueOnce(workingGroupMembersResponse)
        .mockResolvedValueOnce(getContentfulUsersGraphqlResponse());
      const fetchOptions: gp2Model.FetchUsersOptions = {
        take: 12,
        skip: 2,
        filter: {
          projects: [projectId],
          workingGroups: [workingGroupId],
        },
      };
      await userDataProvider.fetch(fetchOptions);

      expect(contentfulGraphqlClientMock.request).toBeCalledTimes(3);
      expect(contentfulGraphqlClientMock.request).toHaveBeenNthCalledWith(
        1,
        gp2Contentful.FETCH_USERS_BY_PROJECT_ID,
        expect.objectContaining({
          id: [projectId],
        }),
      );
      expect(contentfulGraphqlClientMock.request).toHaveBeenNthCalledWith(
        2,
        gp2Contentful.FETCH_USERS_BY_WORKING_GROUP_ID,
        expect.objectContaining({
          id: [workingGroupId],
        }),
      );
      expect(contentfulGraphqlClientMock.request).toHaveBeenNthCalledWith(
        3,
        gp2Contentful.FETCH_USERS,
        expect.objectContaining({
          limit: 12,
          skip: 2,
          where: expect.objectContaining({
            role_not: 'Hidden',
            sys: { id_in: [user1Id] },
          }),
        }),
      );
    });

    describe('if there is a working group or a project filter and no users are found - we should return an empty list', () => {
      test('we have a projects filter and no working group filter', async () => {
        const projectId = '140f5e15-922d-4cbf-9d39-35dd39225b03';

        const projectMembersResponse = getContentfulUsersByProjectId();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          projectMembersResponse,
        );

        const fetchOptions: gp2Model.FetchUsersOptions = {
          take: 12,
          skip: 2,
          filter: {
            projects: [projectId],
          },
        };
        const result = await userDataProvider.fetch(fetchOptions);

        expect(contentfulGraphqlClientMock.request).toBeCalledTimes(1);
        expect(result).toEqual({ total: 0, items: [] });
      });
      test('we have a working groups filter and no projects filter', async () => {
        const workingGroupId = '3ec68d44-82c1-4855-b6a0-ba44b9e313bb';

        const workingGroupMembersResponse =
          getContentfulUsersByWorkingGroupId();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          workingGroupMembersResponse,
        );
        const fetchOptions: gp2Model.FetchUsersOptions = {
          take: 12,
          skip: 2,
          filter: {
            workingGroups: [workingGroupId],
          },
        };
        const result = await userDataProvider.fetch(fetchOptions);

        expect(contentfulGraphqlClientMock.request).toBeCalledTimes(1);
        expect(result).toEqual({ total: 0, items: [] });
      });
      test('if both are defined', async () => {
        const projectId = '140f5e15-922d-4cbf-9d39-35dd39225b03';
        const workingGroupId = '3ec68d44-82c1-4855-b6a0-ba44b9e313bb';

        const workingGroupMembersResponse =
          getContentfulUsersByWorkingGroupId();
        const projectMembersResponse = getContentfulUsersByProjectId();

        contentfulGraphqlClientMock.request
          .mockResolvedValueOnce(projectMembersResponse)
          .mockResolvedValueOnce(workingGroupMembersResponse);
        const fetchOptions: gp2Model.FetchUsersOptions = {
          take: 12,
          skip: 2,
          filter: {
            projects: [projectId],
            workingGroups: [workingGroupId],
          },
        };
        const result = await userDataProvider.fetch(fetchOptions);

        expect(contentfulGraphqlClientMock.request).toBeCalledTimes(2);
        expect(result).toEqual({ total: 0, items: [] });
      });
    });

    test('Should query with code filters', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getContentfulUsersGraphqlResponse(),
      );
      const fetchOptions: gp2Model.FetchUsersOptions = {
        take: 1,
        skip: 0,
        filter: {
          onlyOnboarded: false,
          hidden: false,
          code: 'a-code',
        },
      };
      await userDataProvider.fetch(fetchOptions);

      expect(contentfulGraphqlClientMock.request).toBeCalledWith(
        gp2Contentful.FETCH_USERS,
        expect.objectContaining({
          limit: 1,
          skip: 0,
          where: expect.objectContaining({
            connections_contains_all: ['a-code'],
          }),
        }),
      );
    });
    describe('search', () => {
      test('Should query with filters and return the users', async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getContentfulUsersGraphqlResponse(),
        );
        const fetchOptions: gp2Model.FetchUsersOptions = {
          take: 12,
          skip: 2,
          search: 'tony stark',
          filter: {},
        };
        const users = await userDataProvider.fetch(fetchOptions);

        expect(contentfulGraphqlClientMock.request).toBeCalledWith(
          gp2Contentful.FETCH_USERS,
          expect.objectContaining({
            limit: 12,
            skip: 2,
            where: expect.objectContaining({
              AND: [
                {
                  OR: [
                    {
                      firstName_contains: 'tony',
                    },
                    {
                      lastName_contains: 'tony',
                    },
                  ],
                },
                {
                  OR: [
                    {
                      firstName_contains: 'stark',
                    },
                    {
                      lastName_contains: 'stark',
                    },
                  ],
                },
              ],
            }),
          }),
        );
        expect(users).toMatchObject({ total: 1, items: [getUserDataObject()] });
      });
      test('Should search with special characters', async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getContentfulUsersGraphqlResponse(),
        );
        const fetchOptions: gp2Model.FetchUsersOptions = {
          take: 12,
          skip: 2,
          search: 'Solène',
        };
        await userDataProvider.fetch(fetchOptions);

        expect(contentfulGraphqlClientMock.request).toBeCalledWith(
          gp2Contentful.FETCH_USERS,
          expect.objectContaining({
            limit: 12,
            skip: 2,
            where: expect.objectContaining({
              AND: [
                {
                  OR: [
                    {
                      firstName_contains: 'Solène',
                    },
                    {
                      lastName_contains: 'Solène',
                    },
                  ],
                },
              ],
            }),
          }),
        );
      });
    });
  });
  describe('Create', () => {
    test('Should throw when the POST request to contentful fails', async () => {
      environmentMock.createEntry.mockRejectedValue(new Error('failed'));

      await expect(
        userDataProvider.create(getUserCreateDataObject()),
      ).rejects.toThrow(Error);
    });

    test('Should create the user', async () => {
      const userCreateDataObject = getUserCreateDataObject();

      const userMock = getEntry({});
      environmentMock.createEntry.mockResolvedValue(userMock);
      userMock.publish = jest.fn().mockResolvedValueOnce(userMock);

      await userDataProvider.create(userCreateDataObject);

      const { social, telephone, ...fieldsWithoutLocale } =
        userCreateDataObject;
      const fields = addLocaleToFields({
        ...fieldsWithoutLocale,
        ...social,
        telephoneCountryCode: telephone?.countryCode,
        telephoneNumber: telephone?.number,
      });
      expect(environmentMock.createEntry).toHaveBeenCalledWith('users', {
        fields,
      });

      expect(userMock.publish).toHaveBeenCalled();
    });

    test.each`
      region                      | expected
      ${'Africa'}                 | ${'Africa'}
      ${'Asia'}                   | ${'Asia'}
      ${'Australia/Australiasia'} | ${'Australia/Australiasia'}
      ${'Europe'}                 | ${'Europe'}
      ${'North America'}          | ${'North America'}
      ${'South America'}          | ${'South America'}
      ${'Latin America'}          | ${'Latin America'}
    `(
      'Should create a user with the region $region => $expected',
      async ({ region, expected }) => {
        const userCreateDataObject = getUserCreateDataObject();

        const userMock = getEntry({});
        environmentMock.createEntry.mockResolvedValue(userMock);
        userMock.publish = jest.fn().mockResolvedValueOnce(userMock);

        await userDataProvider.create({
          ...userCreateDataObject,
          region,
        });
        expect(environmentMock.createEntry).toHaveBeenCalledWith('users', {
          fields: expect.objectContaining({ region: { 'en-US': expected } }),
        });

        expect(userMock.publish).toHaveBeenCalled();
      },
    );

    test.each`
      role                           | expected
      ${'Working Group Participant'} | ${'Working Group Participant'}
      ${'Network Investigator'}      | ${'Network Investigator'}
      ${'Network Collaborator'}      | ${'Network Collaborator'}
      ${'Administrator'}             | ${'Administrator'}
      ${'Trainee'}                   | ${'Trainee'}
    `(
      'Should create a user with the role $role => $expected',
      async ({ role, expected }) => {
        const userCreateDataObject = getUserCreateDataObject();

        const userMock = getEntry({});
        environmentMock.createEntry.mockResolvedValue(userMock);
        userMock.publish = jest.fn().mockResolvedValueOnce(userMock);

        await userDataProvider.create({
          ...userCreateDataObject,
          role,
        });
        expect(environmentMock.createEntry).toHaveBeenCalledWith('users', {
          fields: expect.objectContaining({ role: { 'en-US': expected } }),
        });

        expect(userMock.publish).toHaveBeenCalled();
      },
    );

    test.each(gp2Model.userDegrees)(
      'Should create a user with the degree %s',
      async (degree) => {
        const userCreateDataObject = getUserCreateDataObject();
        const expected = degree;

        const userMock = getEntry({});
        environmentMock.createEntry.mockResolvedValue(userMock);
        userMock.publish = jest.fn().mockResolvedValueOnce(userMock);

        await userDataProvider.create({
          ...userCreateDataObject,
          degrees: [degree],
        });
        expect(environmentMock.createEntry).toHaveBeenCalledWith('users', {
          fields: expect.objectContaining({ degrees: { 'en-US': [expected] } }),
        });

        expect(userMock.publish).toHaveBeenCalled();
      },
    );
    test.each`
      role                   | expected
      ${'Investigator'}      | ${'Investigator'}
      ${'Co-Investigator'}   | ${'Co-Investigator'}
      ${'Lead Investigator'} | ${'Lead Investigator'}
    `(
      'Should update the contributing cohort role $role => $expected',
      async ({ role, expected }) => {
        const userCreateDataObject = getUserCreateDataObject();
        const id = '42';
        const userMock = getEntry({});
        environmentMock.createEntry.mockResolvedValue(userMock);
        userMock.publish = jest.fn().mockResolvedValueOnce(userMock);
        await userDataProvider.create({
          ...userCreateDataObject,
          contributingCohorts: [{ contributingCohortId: id, role }],
        });
        expect(environmentMock.createEntry).toHaveBeenCalledWith('users', {
          fields: expect.objectContaining({
            contributingCohorts: {
              'en-US': [{ contributingCohortId: id, role }],
            },
          }),
        });

        expect(userMock.publish).toHaveBeenCalled();
      },
    );
  });
  describe('Update', () => {
    const userId = 'user-id';

    const entry = getEntry({
      firstName: 'Test',
      lastName: 'User',
    });

    beforeEach(() => {
      environmentMock.getEntry.mockResolvedValueOnce(entry);
      const mockPatchAndPublish = patchAndPublish as jest.MockedFunction<
        typeof patchAndPublish
      >;
      mockPatchAndPublish.mockResolvedValue({
        sys: {
          publishedVersion: 2,
        },
      } as Entry);
      contentfulGraphqlClientMock.request.mockResolvedValue({
        users: {
          sys: {
            publishedVersion: 2,
          },
        },
      });
    });

    test('Should update telephone fields', async () => {
      await userDataProvider.update(userId, {
        telephone: { countryCode: '+1', number: '212-970-4133' },
      });
      expect(environmentMock.getEntry).toHaveBeenCalledWith(userId);
      expect(patchAndPublish).toHaveBeenCalledWith(entry, {
        telephoneCountryCode: '+1',
        telephoneNumber: '212-970-4133',
      });
    });
    test('Should update allow empty telephone country code', async () => {
      await userDataProvider.update(userId, {
        telephone: { countryCode: '', number: '212-970-4133' },
      });
      expect(patchAndPublish).toHaveBeenCalledWith(entry, {
        telephoneCountryCode: '',
        telephoneNumber: '212-970-4133',
      });
    });
    test('Should update allow empty telephone number', async () => {
      await userDataProvider.update(userId, {
        telephone: { countryCode: '+1', number: '' },
      });
      expect(patchAndPublish).toHaveBeenCalledWith(entry, {
        telephoneCountryCode: '+1',
        telephoneNumber: '',
      });
    });
    test('Should update secondary email', async () => {
      await userDataProvider.update(userId, {
        alternativeEmail: '',
      });
      expect(patchAndPublish).toHaveBeenCalledWith(entry, {
        alternativeEmail: '',
      });
    });
    test('Should update secondary email', async () => {
      await userDataProvider.update(userId, {
        alternativeEmail: 'tony@example.com',
      });
      expect(patchAndPublish).toHaveBeenCalledWith(entry, {
        alternativeEmail: 'tony@example.com',
      });
    });

    test('Should update first name', async () => {
      nock(baseUrl)
        .patch(`/api/content/${appName}/users/${userId}`, {
          firstName: { iv: 'Tony' },
        })
        .reply(200, fetchUserResponse());

      await userDataProvider.update(userId, { firstName: 'Tony' });
      expect(patchAndPublish).toHaveBeenCalledWith(entry, {
        firstName: 'Tony',
      });
    });

    test('Should update last name', async () => {
      await userDataProvider.update(userId, { lastName: 'Stark' });
      expect(patchAndPublish).toHaveBeenCalledWith(entry, {
        lastName: 'Stark',
      });
    });
    test.each`
      region                      | expected
      ${'Africa'}                 | ${'Africa'}
      ${'Asia'}                   | ${'Asia'}
      ${'Australia/Australiasia'} | ${'Australia/Australiasia'}
      ${'Europe'}                 | ${'Europe'}
      ${'North America'}          | ${'North America'}
      ${'South America'}          | ${'South America'}
      ${'Latin America'}          | ${'Latin America'}
    `(
      'Should update the region $region => $expected',
      async ({ region, expected }) => {
        await userDataProvider.update(userId, {
          region,
        });
        expect(patchAndPublish).toHaveBeenCalledWith(entry, {
          region: expected,
        });
      },
    );
    test.each`
      role                           | expected
      ${'Working Group Participant'} | ${'Working Group Participant'}
      ${'Network Investigator'}      | ${'Network Investigator'}
      ${'Network Collaborator'}      | ${'Network Collaborator'}
      ${'Administrator'}             | ${'Administrator'}
      ${'Trainee'}                   | ${'Trainee'}
    `(
      'Should update the role $role => $expected',
      async ({ role, expected }) => {
        await userDataProvider.update(userId, {
          role,
        });
        expect(patchAndPublish).toHaveBeenCalledWith(entry, {
          role: expected,
        });
      },
    );
    test.each(gp2Model.userDegrees)(
      'Should update the degree %s',
      async (degree) => {
        const expected = degree;
        await userDataProvider.update(userId, {
          degrees: [expected],
        });
        expect(patchAndPublish).toHaveBeenCalledWith(entry, {
          degrees: [expected],
        });
      },
    );
    test.each`
      role                   | expected
      ${'Investigator'}      | ${'Investigator'}
      ${'Co-Investigator'}   | ${'Co-Investigator'}
      ${'Lead Investigator'} | ${'Lead Investigator'}
    `(
      'Should update the contributing cohort role $role => $expected',
      async ({ role, expected }) => {
        const id = '42';
        await userDataProvider.update(userId, {
          contributingCohorts: [{ contributingCohortId: id, role }],
        });
        expect(patchAndPublish).toHaveBeenCalledWith(entry, {
          contributingCohorts: [{ contributingCohortId: id, role: expected }],
        });
      },
    );
  });
});

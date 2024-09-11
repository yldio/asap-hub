import {
  Entry,
  Environment,
  FETCH_PUBLIC_USERS,
  FETCH_USERS,
  FETCH_USERS_BY_LAB_ID,
  FETCH_USERS_BY_TEAM_ID,
  patchAndPublish,
  patchAndPublishConflict,
} from '@asap-hub/contentful';
import { UserDataObject, UserSocialLinks } from '@asap-hub/model';
import {
  parseToWorkingGroups,
  UserContentfulDataProvider,
} from '../../../src/data-providers/contentful/user.data-provider';
import { UserDataProvider } from '../../../src/data-providers/types';
import { getEntry } from '../../fixtures/contentful.fixtures';
import {
  getContentfulGraphqlUser,
  getContentfulGraphqlUserListItem,
  getPublicUserDataObject,
  getUserCreateDataObject,
  getUserDataObject,
  getUserListItemDataObject,
} from '../../fixtures/users.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';

jest.mock('@asap-hub/contentful', () => ({
  ...jest.requireActual('@asap-hub/contentful'),
  patchAndPublishConflict: jest.fn().mockResolvedValue(undefined),
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

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch-by-ID', () => {
    test('fetches the user by id', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: getContentfulGraphqlUser(),
      });

      const result = await userDataProvider.fetchById('123');
      const expectation = {
        ...getUserDataObject(),
        workingGroups: [
          {
            active: false,
            id: 'wg-1',
            name: 'working-group-1',
            role: 'Project Manager',
          },
          {
            active: false,
            id: 'wg-1',
            name: 'working-group-1',
            role: 'Member',
          },
        ],
        interestGroups: [
          {
            active: true,
            id: 'ig-1',
            name: 'interest-group-1',
          },
          {
            active: false,
            id: 'ig-2',
            name: 'interest-group-2',
          },
          {
            active: true,
            id: 'interest-group-leader-1',
            name: 'Interest Group Leader 1',
          },
        ],
      };
      expect(result).toEqual(expectation);
    });

    test('returns null if user does not exist', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: null,
      });
      const result = await userDataProvider.fetchById('abc');
      expect(result).toEqual(null);
    });

    test.each(['middleName', 'nickname'] satisfies Array<keyof UserDataObject>)(
      'Should not return a field when its an empty string for %s',
      async (field) => {
        const mockResponse = getContentfulGraphqlUser();
        mockResponse[field] = '';
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: mockResponse,
        });

        const result = await userDataProvider.fetchById('user-id');

        expect(result![field]).toBeUndefined();
      },
    );

    test('should map social properties and orcid onto `social` object', async () => {
      const socialProps = {
        github: '@github',
        twitter: '@twitter',
        website1: 'https://example.com',
        website2: 'https://example2.com',
        researchGate: 'researchGate',
        researcherId: 'researcherId',
        googleScholar: 'googleScholar',
        linkedIn: 'linkedIn',
      };
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: getContentfulGraphqlUser(socialProps),
      });

      const result = await userDataProvider.fetchById('123');

      expect(result!.social).toEqual({ ...socialProps, orcid: '123-456-789' });
      expect(result).not.toMatchObject(socialProps);
    });

    test('should filter out null teams', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: getContentfulGraphqlUser({
          teamsCollection: {
            items: [
              null,
              {
                inactiveSinceDate: null,
                role: 'Lead PI (Core Leadership)',
                team: {
                  sys: {
                    id: '2',
                  },
                  displayName: 'Good team',
                  linkedFrom: {
                    interestGroupsCollection: {
                      items: [],
                    },
                  },
                },
              },
            ],
          },
        }),
      });

      const result = await userDataProvider.fetchById('123');
      expect(result!.teams).toHaveLength(1);
      expect(result!.teams[0]!.displayName).toEqual('Good team');
    });

    test('should filter out teams for which the role is not a valid role', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: getContentfulGraphqlUser({
          teamsCollection: {
            items: [
              {
                inactiveSinceDate: null,
                role: 'Not a role',
                team: {
                  sys: {
                    id: '1',
                  },
                  displayName: 'Bad team',
                },
              },
              {
                inactiveSinceDate: null,
                role: 'Lead PI (Core Leadership)',
                team: {
                  sys: {
                    id: '2',
                  },
                  displayName: 'Good team',
                },
              },
            ],
          },
        }),
      });

      const result = await userDataProvider.fetchById('123');
      expect(result!.teams).toHaveLength(1);
      expect(result!.teams[0]!.displayName).toEqual('Good team');
    });

    test('should normalise invalid user roles to "Guest"', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: getContentfulGraphqlUser({
          role: 'Not a role',
        }),
      });
      const result = await userDataProvider.fetchById('123');
      expect(result!.role).toEqual('Guest');
    });

    test('should normalise invalid user degree properties to undefined', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: getContentfulGraphqlUser({
          degree: 'Not a degree',
        }),
      });
      const result = await userDataProvider.fetchById('123');
      expect(result!.degree).toBe(undefined);
    });

    test('should remove labs without a name', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: getContentfulGraphqlUser({
          labsCollection: {
            items: [
              {
                sys: {
                  id: '1',
                },
                name: 'My lab',
              },
              {
                sys: {
                  id: '2',
                },
                name: null,
              },
            ],
          },
        }),
      });

      const result = await userDataProvider.fetchById('123');
      expect(result!.labs).toHaveLength(1);
      expect(result!.labs[0]!.name).toEqual('My lab');
    });

    test('should tag alumni users', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: getContentfulGraphqlUser({
          alumniSinceDate: '2020-01-01T12:00:00.000Z',
        }),
      });

      const result = await userDataProvider.fetchById('123');

      expect(result!.membershipStatus).toEqual(['Alumni Member']);
    });

    test('should tag non-alumni users', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: getContentfulGraphqlUser({
          alumniSinceDate: null,
        }),
      });

      const result = await userDataProvider.fetchById('123');

      expect(result!.membershipStatus).toEqual(['CRN Member']);
    });

    test('should fall back to `firstPublishedAt` if `createdDate` does not exist', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: getContentfulGraphqlUser({
          sys: {
            id: '123',
            firstPublishedAt: '2018-02-14T12:00:00.000Z',
          },
          createdDate: null,
        }),
      });

      const result = await userDataProvider.fetchById('123');

      expect(result!.createdDate).toEqual('2018-02-14T12:00:00.000Z');
    });

    test('should throw an error when orcid-works field does not adhere to the interface', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: getContentfulGraphqlUser({
          orcidWorks: { invalid: 'data' },
        }),
      });

      await expect(userDataProvider.fetchById('123')).rejects.toThrow(
        'Invalid ORCID works content data',
      );
    });

    describe('default values', () => {
      const stringFields = {
        email: null,
        firstName: null,
        lastName: null,
      };
      const fields = {
        contactEmail: null,
        biography: null,
        jobTitle: null,
        city: null,
        country: null,
        institution: null,
        orcid: null,
        orcidLastModifiedDate: null,
        orcidLastSyncDate: null,
        alumniLocation: null,
        alumniSinceDate: null,
        reachOut: null,
        researchInterests: null,
        responsibilities: null,
        expertiseAndResourceDescription: null,
      };
      const social = {
        website1: null,
        website2: null,
        linkedIn: null,
        orcid: null,
        researcherId: null,
        twitter: null,
        github: null,
        googleScholar: null,
        researchGate: null,
      };

      let result: UserDataObject | null = null;

      beforeAll(async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: getContentfulGraphqlUser({
            ...stringFields,
            ...fields,
          }),
        });
        result = await userDataProvider.fetchById('123');
      });

      test.each(Object.keys(stringFields) as (keyof UserDataObject)[])(
        '%s should default null value to an empty string',
        async (key) => {
          expect(result?.[key]).toEqual('');
        },
      );
      test.each(Object.keys(fields) as (keyof UserDataObject)[])(
        '%s should default null value to undefined',
        async (key) => {
          expect(result?.[key]).toBeUndefined();
        },
      );
      test.each(Object.keys(social) as (keyof UserSocialLinks)[])(
        'social.%s should default null value to undefined',
        async (key) => {
          expect(result?.social?.[key]).toBeUndefined();
        },
      );
    });

    test('should filter null tag items', async () => {
      const id = 'user-id-1';
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: getContentfulGraphqlUser({
          researchTagsCollection: {
            items: [null, { sys: { id: '1' }, name: 'Lysosomes' }],
          },
        }),
      });

      const response = await userDataProvider.fetchById(id);
      expect(response!.tags).toEqual([{ id: '1', name: 'Lysosomes' }]);
    });

    test('Should default missing research theme to an empty array', async () => {
      const id = 'user-id-1';
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: getContentfulGraphqlUser({
          researchTheme: null,
        }),
      });

      const response = await userDataProvider.fetchById(id);
      expect(response!.researchTheme).toEqual([]);
    });
  });

  describe('Fetch', () => {
    test('should receive a user list', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        usersCollection: {
          total: 1,
          items: [getContentfulGraphqlUserListItem()],
        },
      });
      const result = await userDataProvider.fetch({});

      expect(result.total).toEqual(1);
      expect(result.items).toEqual([getUserListItemDataObject()]);
    });

    test('should return an empty response if there is no result', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        usersCollection: null,
      });
      const result = await userDataProvider.fetch({});
      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });

    test('should filter user teams without roles', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        usersCollection: {
          total: 1,
          items: [
            getContentfulGraphqlUserListItem({
              teamsCollection: {
                items: [
                  {
                    team: {
                      sys: {
                        id: 'team-id-0',
                      },
                      displayName: 'Team A',
                    },
                  },
                  {
                    role: 'Lead PI (Core Leadership)',
                    team: {
                      sys: {
                        id: 'team-id-1',
                      },
                      displayName: 'Team B',
                    },
                  },
                ],
              },
            }),
          ],
        },
      });
      const result = await userDataProvider.fetch({});
      expect(result).toEqual({
        total: 1,
        items: [
          {
            ...getUserListItemDataObject(),
            teams: [
              {
                id: 'team-id-1',
                role: 'Lead PI (Core Leadership)',
                displayName: 'Team B',
              },
            ],
          },
        ],
      });
    });

    test.each([
      { membershipStatus: 'CRN Member', alumniSinceDate: null },
      {
        membershipStatus: 'Alumni Member',
        alumniSinceDate: '2020-01-01T12:00:00.000Z',
      },
    ])(
      'should return membershipStatus as $membershipStatus if alumniSinceDate is $alumniSinceDate',
      async ({ membershipStatus, alumniSinceDate }) => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          usersCollection: {
            total: 1,
            items: [
              getContentfulGraphqlUserListItem({
                alumniSinceDate,
              }),
            ],
          },
        });
        const result = await userDataProvider.fetch({});
        expect(result).toEqual({
          total: 1,
          items: [
            {
              ...getUserListItemDataObject(),
              alumniSinceDate,
              membershipStatus: [membershipStatus],
            },
          ],
        });
      },
    );

    test('should filter out team memberships not linked to a user', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        teamMembershipCollection: {
          total: 3,
          items: [
            {
              linkedFrom: {
                usersCollection: {
                  total: 1,
                  items: [{ ...getContentfulGraphqlUser(), firstName: 'Alan' }],
                },
              },
            },
            {
              linkedFrom: {
                usersCollection: {
                  total: 0,
                  items: [],
                },
              },
            },
            {
              linkedFrom: {
                usersCollection: {
                  total: 1,
                  items: [
                    { ...getContentfulGraphqlUser(), firstName: 'Brady' },
                  ],
                },
              },
            },
          ],
        },
      });

      const result = await userDataProvider.fetch({ filter: { teamId: 'A' } });
      expect(result!.total).toEqual(2);
      expect(result!.items.map((item) => item.firstName)).toEqual([
        'Alan',
        'Brady',
      ]);
    });

    describe('query parameters', () => {
      beforeEach(() => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          usersCollection: {
            total: 0,
            items: [],
          },
        });
      });

      test('should set default pagination parameters', async () => {
        await userDataProvider.fetch({});
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_USERS,
          expect.objectContaining({ limit: 8, skip: 0 }),
        );
      });

      test('should pass pagination parameters if provided', async () => {
        await userDataProvider.fetch({ take: 20, skip: 20 });
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_USERS,
          expect.objectContaining({ limit: 20, skip: 20 }),
        );
      });

      test('should filter out non-onboarded users by default', async () => {
        await userDataProvider.fetch({});
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_USERS,
          expect.objectContaining({
            where: expect.objectContaining({ onboarded: true }),
          }),
        );
      });

      test('should allow including non-onboarded users', async () => {
        await userDataProvider.fetch({ filter: { onboarded: false } });
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_USERS,
          expect.objectContaining({
            where: expect.not.objectContaining({
              onboarded: expect.anything(),
            }),
          }),
        );
      });

      test('should filter out hidden users by default', async () => {
        await userDataProvider.fetch({});
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_USERS,
          expect.objectContaining({
            where: expect.objectContaining({ role_not: 'Hidden' }),
          }),
        );
      });

      test('should allow including hidden users', async () => {
        await userDataProvider.fetch({ filter: { hidden: false } });
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_USERS,
          expect.objectContaining({
            where: expect.not.objectContaining({ role_not: expect.anything() }),
          }),
        );
      });

      test('should enable filtering by a connection code', async () => {
        await userDataProvider.fetch({ filter: { code: 'google-auth-123' } });
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_USERS,
          expect.objectContaining({
            where: expect.objectContaining({
              connections_contains_all: ['google-auth-123'],
            }),
          }),
        );
      });

      test('should support filtering by lab', async () => {
        await userDataProvider.fetch({
          filter: { labId: '1234567' },
        });
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_USERS_BY_LAB_ID,
          expect.objectContaining({ id: '1234567' }),
        );
      });

      test('should support filtering by team', async () => {
        await userDataProvider.fetch({ filter: { teamId: '1234567' } });
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_USERS_BY_TEAM_ID,
          expect.objectContaining({ id: '1234567' }),
        );
      });

      test('should support filtering by orcid', async () => {
        await userDataProvider.fetch({
          filter: { orcid: '0000-0000-1111-1111' },
        });
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_USERS,
          expect.objectContaining({
            where: expect.objectContaining({
              orcid_contains: '0000-0000-1111-1111',
            }),
          }),
        );
      });

      test('should support filtering by orcidLastSyncDate', async () => {
        await userDataProvider.fetch({
          filter: {
            orcidLastSyncDate: 'some-date',
          },
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_USERS,
          expect.objectContaining({
            where: expect.objectContaining({
              orcidLastSyncDate_lt: 'some-date',
            }),
          }),
        );
      });
      test('Should query data properly when passing search param', async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getContentfulGraphqlUser(),
        );

        const search = 'Tag';
        await userDataProvider.fetch({
          search,
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            limit: 8,
            order: ['lastName_ASC'],
            skip: 0,
            where: {
              AND: [
                { OR: [{ expertiseAndResourceDescription_contains: 'Tag' }] },
              ],
              onboarded: true,
              role_not: 'Hidden',
            },
          }),
        );
      });
    });
  });

  describe('FetchPublicUsers', () => {
    test('should receive a user list', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        usersCollection: {
          total: 1,
          items: [getContentfulGraphqlUser()],
        },
      });

      const expectation = {
        ...getPublicUserDataObject(),
        researchOutputs: [],
        workingGroups: [
          {
            active: false,
            id: 'wg-1',
            name: 'working-group-1',
            role: 'Project Manager',
          },
          {
            active: false,
            id: 'wg-1',
            name: 'working-group-1',
            role: 'Member',
          },
        ],
        interestGroups: [
          {
            active: true,
            id: 'ig-1',
            name: 'interest-group-1',
          },
          {
            active: false,
            id: 'ig-2',
            name: 'interest-group-2',
          },
          {
            active: true,
            id: 'interest-group-leader-1',
            name: 'Interest Group Leader 1',
          },
        ],
      };

      const result = await userDataProvider.fetchPublicUsers({});

      expect(result.total).toEqual(1);
      expect(result.items).toEqual([expectation]);
    });

    test('should return an empty response if there is no result', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        usersCollection: null,
      });
      const result = await userDataProvider.fetch({});
      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });

    test('should filter out research outputs where the user is not the author', async () => {
      const graphqlUser = getContentfulGraphqlUser();
      graphqlUser.linkedFrom!.researchOutputsCollection = {
        items: [
          {
            sys: {
              id: 'research-output-1',
            },
            authorsCollection: {
              items: [
                {
                  __typename: 'Users',
                  sys: {
                    id: graphqlUser.sys.id,
                  },
                },
              ],
            },
          },
          {
            sys: {
              id: 'research-output-2',
            },
            authorsCollection: {
              items: [
                {
                  __typename: 'Users',
                  sys: {
                    id: 'random-user-id',
                  },
                },
              ],
            },
          },
        ],
      };
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        usersCollection: {
          total: 1,
          items: [graphqlUser],
        },
      });

      const result = await userDataProvider.fetchPublicUsers({});
      expect(result!.items[0]!.researchOutputs).toEqual([
        {
          id: 'research-output-1',
        },
      ]);
    });

    describe('query parameters', () => {
      beforeEach(() => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          usersCollection: {
            total: 0,
            items: [],
          },
        });
      });

      test('should set default pagination parameters', async () => {
        await userDataProvider.fetchPublicUsers({});
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_PUBLIC_USERS,
          expect.objectContaining({ limit: 8, skip: 0 }),
        );
      });

      test('should pass pagination parameters if provided', async () => {
        await userDataProvider.fetchPublicUsers({ take: 20, skip: 20 });
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_PUBLIC_USERS,
          expect.objectContaining({ limit: 20, skip: 20 }),
        );
      });

      test('should filter out non-onboarded users by default', async () => {
        await userDataProvider.fetchPublicUsers({});
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_PUBLIC_USERS,
          expect.objectContaining({
            where: expect.objectContaining({ onboarded: true }),
          }),
        );
      });

      test('should filter out hidden users by default', async () => {
        await userDataProvider.fetchPublicUsers({});
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_PUBLIC_USERS,
          expect.objectContaining({
            where: expect.objectContaining({ role_not: 'Hidden' }),
          }),
        );
      });
    });
  });

  describe('Update', () => {
    const entry = getEntry({
      firstName: 'Test',
      lastName: 'User',
    });
    const mockPatchAndPublishConflict =
      patchAndPublishConflict as jest.MockedFunction<
        typeof patchAndPublishConflict
      >;
    const mockPatchAndPublish = patchAndPublish as jest.MockedFunction<
      typeof patchAndPublish
    >;

    beforeEach(() => {
      environmentMock.getEntry.mockResolvedValueOnce(entry);
      mockPatchAndPublish.mockResolvedValue({
        sys: {
          publishedVersion: 2,
        },
      } as Entry);
      mockPatchAndPublishConflict.mockResolvedValue({
        sys: {
          publishedVersion: 2,
        },
      } as Entry);
      const user = getContentfulGraphqlUser();
      contentfulGraphqlClientMock.request.mockResolvedValue({
        users: {
          ...user,
          sys: {
            ...user.sys,
            publishedVersion: 2,
          },
        },
      });
    });

    describe('polling', () => {
      test('it is true by default when no options is passed, thus it makes a graphql request', async () => {
        await userDataProvider.update('123', {
          firstName: 'Colin',
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalled();
      });

      test('does not call graphql request when polling is passed as false', async () => {
        await userDataProvider.update(
          '123',
          {
            firstName: 'Colin',
          },
          { polling: false },
        );

        expect(contentfulGraphqlClientMock.request).not.toHaveBeenCalled();
      });
    });

    describe('suppressConflict false', () => {
      test('fetches entry from contentful and passes to `patchAndPublish`', async () => {
        await userDataProvider.update('123', {
          firstName: 'Colin',
        });
        expect(environmentMock.getEntry).toHaveBeenCalledWith('123');
        expect(patchAndPublish).toHaveBeenCalledWith(entry, {
          firstName: 'Colin',
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalled();
      });

      test('flattens `social` values', async () => {
        await userDataProvider.update('123', {
          social: {
            github: 'yldio',
            twitter: 'yldio',
          },
        });
        expect(patchAndPublish).toHaveBeenCalledWith(
          entry,
          expect.objectContaining({ github: 'yldio', twitter: 'yldio' }),
        );
        expect(patchAndPublish).toHaveBeenCalledWith(
          entry,
          expect.not.objectContaining({ social: expect.anything() }),
        );
      });

      test('includes undefined `social` values as null to allow unsetting', async () => {
        await userDataProvider.update('123', {
          social: {
            github: 'yldio',
            twitter: 'yldio',
          },
        });
        expect(patchAndPublish).toHaveBeenCalledWith(entry, {
          website1: null,
          website2: null,
          googleScholar: null,
          linkedIn: null,
          researchGate: null,
          researcherId: null,
          github: 'yldio',
          twitter: 'yldio',
        });
      });
      test('maps avatar value to a linked resource', async () => {
        await userDataProvider.update('123', {
          avatar: 'abc123',
        });
        expect(patchAndPublish).toHaveBeenCalledWith(entry, {
          avatar: {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: 'abc123',
            },
          },
        });
      });
      test('map tag value to a linked resource', async () => {
        await userDataProvider.update('123', {
          tagIds: ['1'],
        });

        expect(patchAndPublish).toHaveBeenCalledWith(entry, {
          researchTags: [
            {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: '1',
              },
            },
          ],
        });
      });
      test('converts empty string values to `null`', async () => {
        await userDataProvider.update('123', {
          firstName: '  ',
          degree: '',
          onboarded: false,
        });
        expect(patchAndPublish).toHaveBeenCalledWith(entry, {
          firstName: null,
          degree: null,
          onboarded: false,
        });
      });

      test('checks version of published data and polls until they match', async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: {
            sys: {
              publishedVersion: 1,
            },
          },
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: {
            sys: {
              publishedVersion: 1,
            },
          },
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: {
            sys: {
              publishedVersion: 2,
            },
          },
        });

        await userDataProvider.update('123', {
          firstName: 'Colin',
        });
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledTimes(3);
      });

      test('throws if polling query does not return a value', async () => {
        contentfulGraphqlClientMock.request.mockReset().mockResolvedValueOnce({
          users: null,
        });

        await expect(
          userDataProvider.update('123', {
            firstName: 'Colin',
          }),
        ).rejects.toThrow();
      });

      test('unwraps `code` property of connections', async () => {
        await userDataProvider.update('123', {
          connections: [{ code: 'abc123' }],
        });
        expect(patchAndPublish).toHaveBeenCalledWith(entry, {
          connections: ['abc123'],
        });
      });
    });
    describe('suppressConflict true', () => {
      test('fetches entry from contentful and passes to `patchAndPublishConflict`', async () => {
        await userDataProvider.update(
          '123',
          {
            firstName: 'Colin',
            middleName: 'Mike',
          },

          { suppressConflict: true },
        );
        expect(environmentMock.getEntry).toHaveBeenCalledWith('123');
        expect(patchAndPublishConflict).toHaveBeenCalledWith(entry, {
          firstName: 'Colin',
          middleName: 'Mike',
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalled();
      });
      test('when conflict should return and not poll', async () => {
        mockPatchAndPublishConflict.mockReset().mockResolvedValueOnce(null);
        await userDataProvider.update(
          '123',
          {
            firstName: 'Colin',
          },
          { suppressConflict: true },
        );
        expect(environmentMock.getEntry).toHaveBeenCalledWith('123');
        expect(patchAndPublishConflict).toHaveBeenCalledWith(entry, {
          firstName: 'Colin',
        });

        expect(contentfulGraphqlClientMock.request).not.toHaveBeenCalled();
      });
      test('flattens `social` values', async () => {
        await userDataProvider.update(
          '123',
          {
            social: {
              github: 'yldio',
              twitter: 'yldio',
            },
          },
          { suppressConflict: true },
        );
        expect(patchAndPublishConflict).toHaveBeenCalledWith(
          entry,
          expect.objectContaining({ github: 'yldio', twitter: 'yldio' }),
        );
        expect(patchAndPublishConflict).toHaveBeenCalledWith(
          entry,
          expect.not.objectContaining({ social: expect.anything() }),
        );
      });

      test('includes undefined `social` values as null to allow unsetting', async () => {
        await userDataProvider.update(
          '123',
          {
            social: {
              github: 'yldio',
              twitter: 'yldio',
            },
          },
          { suppressConflict: true },
        );
        expect(patchAndPublishConflict).toHaveBeenCalledWith(entry, {
          website1: null,
          website2: null,
          googleScholar: null,
          linkedIn: null,
          researchGate: null,
          researcherId: null,
          github: 'yldio',
          twitter: 'yldio',
        });
      });
      test('maps avatar value to a linked resource', async () => {
        await userDataProvider.update(
          '123',
          {
            avatar: 'abc123',
          },
          { suppressConflict: true },
        );
        expect(patchAndPublishConflict).toHaveBeenCalledWith(entry, {
          avatar: {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: 'abc123',
            },
          },
        });
      });
      test('converts empty string values to `null`', async () => {
        await userDataProvider.update(
          '123',
          {
            firstName: '  ',
            degree: '',
            onboarded: false,
          },
          { suppressConflict: true },
        );
        expect(patchAndPublishConflict).toHaveBeenCalledWith(entry, {
          firstName: null,
          degree: null,
          onboarded: false,
        });
      });

      test('checks version of published data and polls until they match', async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: {
            sys: {
              publishedVersion: 1,
            },
          },
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: {
            sys: {
              publishedVersion: 1,
            },
          },
        });
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: {
            sys: {
              publishedVersion: 2,
            },
          },
        });

        await userDataProvider.update(
          '123',
          {
            firstName: 'Colin',
          },
          { suppressConflict: true },
        );
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledTimes(3);
      });

      test('throws if polling query does not return a value', async () => {
        contentfulGraphqlClientMock.request.mockReset().mockResolvedValueOnce({
          users: null,
        });

        await expect(
          userDataProvider.update(
            '123',
            {
              firstName: 'Colin',
            },
            { suppressConflict: true },
          ),
        ).rejects.toThrow();
      });

      test('unwraps `code` property of connections', async () => {
        await userDataProvider.update(
          '123',
          {
            connections: [{ code: 'abc123' }],
          },
          { suppressConflict: true },
        );
        expect(patchAndPublishConflict).toHaveBeenCalledWith(entry, {
          connections: ['abc123'],
        });
      });
    });
  });

  describe('Create', () => {
    test('not implemented', async () => {
      await expect(
        userDataProvider.create(getUserCreateDataObject()),
      ).rejects.toThrow();
    });
  });

  describe('parseToWorkingGroups', () => {
    test('should discard working group roles that are not linked to a working group', async () => {
      const workingGroupGQLResponse = [
        {
          inactiveSinceDate: '',
          role: 'Project Manager',
          linkedFrom: {
            workingGroupsCollection: {
              items: [
                {
                  sys: {
                    id: 'wg-1',
                  },
                  title: 'working-group-1',
                  complete: false,
                },
              ],
            },
          },
          user: {
            lastName: 'simpson',
          },
        },
        {
          inactiveSinceDate: '',
          role: 'Chair',
          linkedFrom: {
            workingGroupsCollection: {
              items: [],
            },
          },
          user: {
            lastName: 'simpson',
          },
        },
      ];
      const isAlumni = false;
      const parsedWorkingGroups = parseToWorkingGroups(
        workingGroupGQLResponse,
        isAlumni,
      );
      expect(parsedWorkingGroups).toEqual([
        {
          id: 'wg-1',
          active: true,
          name: 'working-group-1',
          role: 'Project Manager',
        },
      ]);
    });
    test('should set role to leadership role for leaders', () => {
      const workingGroupGQLResponse = [
        {
          inactiveSinceDate: '',
          role: 'Project Manager',
          linkedFrom: {
            workingGroupsCollection: {
              items: [
                {
                  sys: {
                    id: 'wg-1',
                  },
                  title: 'working-group-1',
                  complete: false,
                },
              ],
            },
          },
          user: {
            lastName: 'simpson',
          },
        },
      ];
      const isAlumni = false;
      const parsedWorkingGroups = parseToWorkingGroups(
        workingGroupGQLResponse,
        isAlumni,
      );
      expect(parsedWorkingGroups[0]!.role).toBe('Project Manager');
    });

    test('should set role to `Member` for members', () => {
      const workingGroupGQLResponse = [
        {
          inactiveSinceDate: '',
          linkedFrom: {
            workingGroupsCollection: {
              items: [
                {
                  sys: {
                    id: 'wg-1',
                  },
                  title: 'working-group-1',
                  complete: false,
                },
              ],
            },
          },
          user: {
            lastName: 'simpson',
          },
        },
      ];
      const isAlumni = false;
      const parsedWorkingGroups = parseToWorkingGroups(
        workingGroupGQLResponse,
        isAlumni,
      );
      expect(parsedWorkingGroups[0]!.role).toBe('Member');
    });

    test('should set active to false if user is set to inactive', () => {
      const workingGroupGQLResponse = [
        {
          inactiveSinceDate: '2020-09-23T20:45:22Z',
          linkedFrom: {
            workingGroupsCollection: {
              items: [
                {
                  sys: {
                    id: 'wg-1',
                  },
                  title: 'working-group-1',
                  complete: false,
                },
              ],
            },
          },
          user: {
            lastName: 'simpson',
          },
        },
      ];
      const isAlumni = false;
      const parsedWorkingGroups = parseToWorkingGroups(
        workingGroupGQLResponse,
        isAlumni,
      );
      expect(parsedWorkingGroups[0]!.active).toBe(false);
    });

    test('should set active to false if user is set as alumni', () => {
      const workingGroupGQLResponse = [
        {
          inactiveSinceDate: '',
          linkedFrom: {
            workingGroupsCollection: {
              items: [
                {
                  sys: {
                    id: 'wg-1',
                  },
                  title: 'working-group-1',
                  complete: false,
                },
              ],
            },
          },
          user: {
            lastName: 'simpson',
          },
        },
      ];
      const isAlumni = true;
      const parsedWorkingGroups = parseToWorkingGroups(
        workingGroupGQLResponse,
        isAlumni,
      );
      expect(parsedWorkingGroups[0]!.active).toBe(false);
    });

    test('should set active to false if working group is complete', () => {
      const workingGroupGQLResponse = [
        {
          inactiveSinceDate: '',
          linkedFrom: {
            workingGroupsCollection: {
              items: [
                {
                  sys: {
                    id: 'wg-1',
                  },
                  title: 'working-group-1',
                  complete: false,
                },
              ],
            },
          },
          user: {
            lastName: 'simpson',
          },
        },
      ];
      const isAlumni = true;
      const parsedWorkingGroups = parseToWorkingGroups(
        workingGroupGQLResponse,
        isAlumni,
      );
      expect(parsedWorkingGroups[0]!.active).toBe(false);
    });
  });
});

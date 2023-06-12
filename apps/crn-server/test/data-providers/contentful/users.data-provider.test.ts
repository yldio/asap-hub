import {
  patchAndPublish,
  getContentfulGraphqlClientMockServer,
  Environment,
  Entry,
  FETCH_USERS,
  FETCH_USERS_BY_LAB_ID,
  FETCH_USERS_BY_TEAM_ID,
} from '@asap-hub/contentful';
import { UserDataObject, UserSocialLinks } from '@asap-hub/model';
import {
  getContentfulGraphql,
  getContentfulGraphqlUser,
  getUserDataObject,
  getUserCreateDataObject,
} from '../../fixtures/users.fixtures';
import { getEntry } from '../../fixtures/contentful.fixtures';
import { UserDataProvider } from '../../../src/data-providers/types';
import { UserContentfulDataProvider } from '../../../src/data-providers/contentful/users.data-provider';
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

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch-by-ID', () => {
    test('fetches the user from Contentful GraphQL', async () => {
      const contentfulGraphqlClientMockServer =
        getContentfulGraphqlClientMockServer(getContentfulGraphql());

      const userDataProviderWithMockServer: UserDataProvider =
        new UserContentfulDataProvider(
          contentfulGraphqlClientMockServer,
          contentfulRestClientMock,
        );
      const result = await userDataProviderWithMockServer.fetchById('123');
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
        ],
      };
      // TODO: team proposal
      expectation.teams[0]!.proposal = undefined;
      expect(result).toEqual(expectation);
    });

    test('returns null if user does not exist', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: null,
      });
      const result = await userDataProvider.fetchById('abc');
      expect(result).toEqual(null);
    });

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

    test('should remove empty values from expertise tags and questions', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: getContentfulGraphqlUser({
          questions: [null, '', 'Why?'],
          expertiseAndResourceTags: ['Research', null, ''],
        }),
      });
      const result = await userDataProvider.fetchById('123');
      expect(result!.questions).toEqual(['Why?']);
      expect(result!.expertiseAndResourceTags).toEqual(['Research']);
    });

    test('should tag alumni users', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: getContentfulGraphqlUser({
          alumniSinceDate: '2020-01-01T12:00:00.000Z',
        }),
      });

      const result = await userDataProvider.fetchById('123');

      expect(result!._tags).toEqual(['Alumni Member']);
    });

    test('should tag non-alumni users', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: getContentfulGraphqlUser({
          alumniSinceDate: null,
        }),
      });

      const result = await userDataProvider.fetchById('123');

      expect(result!._tags).toEqual(['CRN Member']);
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
  });

  describe('Fetch', () => {
    test('should receive a user list', async () => {
      const contentfulGraphqlClientMockServer =
        getContentfulGraphqlClientMockServer(getContentfulGraphql());

      const userDataProviderWithMockServer: UserDataProvider =
        new UserContentfulDataProvider(
          contentfulGraphqlClientMockServer,
          contentfulRestClientMock,
        );
      const result = await userDataProviderWithMockServer.fetch({});
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
        ],
      };
      // TODO: team proposal
      expectation.teams[0]!.proposal = undefined;
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
        await userDataProvider.fetch({ filter: { labId: '1234567' } });
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_USERS_BY_LAB_ID,
          expect.objectContaining({ id: '1234567' }),
        );

        const contentfulGraphqlClientMockServer =
          getContentfulGraphqlClientMockServer({
            UsersCollection: () => {
              return {
                total: 2,
                items: [...new Array(2)],
              };
            },
            ...getContentfulGraphql(),
          });

        const userDataProviderWithMockServer: UserDataProvider =
          new UserContentfulDataProvider(
            contentfulGraphqlClientMockServer,
            contentfulRestClientMock,
          );

        const result = await userDataProviderWithMockServer.fetch({
          filter: { labId: '1234567' },
        });
        expect(result.total).toEqual(2);
        expect(result.items).toHaveLength(2);
      });

      test('should support filtering by team', async () => {
        await userDataProvider.fetch({ filter: { teamId: '1234567' } });
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_USERS_BY_TEAM_ID,
          expect.objectContaining({ id: '1234567' }),
        );

        const contentfulGraphqlClientMockServer =
          getContentfulGraphqlClientMockServer({
            TeamMembershipCollection: () => {
              return {
                total: 2,
                items: [
                  {
                    linkedFrom: {
                      usersCollection: {
                        total: 1,
                        items: [...Array(1)],
                      },
                    },
                  },
                  {
                    linkedFrom: {
                      usersCollection: {
                        total: 1,
                        items: [...Array(1)],
                      },
                    },
                  },
                ],
              };
            },
            ...getContentfulGraphql(),
          });

        const userDataProviderWithMockServer: UserDataProvider =
          new UserContentfulDataProvider(
            contentfulGraphqlClientMockServer,
            contentfulRestClientMock,
          );
        const result = await userDataProviderWithMockServer.fetch({
          filter: { teamId: '1234567' },
        });

        expect(result.total).toEqual(2);
        expect(result.items).toHaveLength(2);
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
    });
  });

  describe('Update', () => {
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

    test('fetches entry from contentful and passes to `patchAndPublish`', async () => {
      await userDataProvider.update('123', {
        firstName: 'Colin',
      });
      expect(environmentMock.getEntry).toHaveBeenCalledWith('123');
      expect(patchAndPublish).toHaveBeenCalledWith(entry, {
        firstName: 'Colin',
      });
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
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        users: null,
      });

      expect(async () =>
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

  describe('Create', () => {
    test('not implemented', async () => {
      expect(async () =>
        userDataProvider.create(getUserCreateDataObject()),
      ).rejects.toThrow();
    });
  });
});

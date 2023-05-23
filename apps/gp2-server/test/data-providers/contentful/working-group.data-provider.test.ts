import { getGP2ContentfulGraphqlClientMockServer } from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import { WorkingGroupContentfulDataProvider } from '../../../src/data-providers/contentful/working-group.data-provider';
import {
  getContentfulGraphqlWorkingGroup,
  getWorkingGroupDataObject,
} from '../../fixtures/working-group.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';

describe('Working Group Data Provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();

  const workingGroupDataProvider = new WorkingGroupContentfulDataProvider(
    contentfulGraphqlClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getGP2ContentfulGraphqlClientMockServer({
      WorkingGroups: () => getContentfulGraphqlWorkingGroup(),
    });

  const workingGroupDataProviderWithMockServer =
    new WorkingGroupContentfulDataProvider(contentfulGraphqlClientMockServer);
  beforeEach(jest.resetAllMocks);

  describe('FetchById', () => {
    test('Should fetch the working group from squidex graphql', async () => {
      const result = await workingGroupDataProviderWithMockServer.fetchById(
        'working-group-id',
      );

      expect(result).toMatchObject(getWorkingGroupDataObject());
    });

    test('Should return null when the working group is not found', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        workingGroups: null,
      });

      expect(await workingGroupDataProvider.fetchById('not-found')).toBeNull();
    });
    test('the working group is parsed', async () => {
      const workingGroup = getContentfulGraphqlWorkingGroup();
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        workingGroups: workingGroup,
      });
      const workingGroupDataObject = await workingGroupDataProvider.fetchById(
        'working-group-id',
      );
      const expected = getWorkingGroupDataObject();
      expect(workingGroupDataObject).toEqual(expected);
    });
    test('the calendar is null is ignored', async () => {
      const workingGroup = getContentfulGraphqlWorkingGroup();
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        workingGroups: { ...workingGroup, calendar: null },
      });
      const workingGroupDataObject = await workingGroupDataProvider.fetchById(
        'working-group-id',
      );
      expect(workingGroupDataObject?.calendar).toBeUndefined();
    });
    describe('members', () => {
      test('the members in working group are parsed', async () => {
        const workingGroup = getContentfulGraphqlWorkingGroup();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          workingGroups: workingGroup,
        });
        const workingGroupDataObject = await workingGroupDataProvider.fetchById(
          'working-group-id',
        );
        expect(workingGroupDataObject?.members).toEqual([
          {
            userId: '11',
            role: 'Lead',
            firstName: 'Tony',
            lastName: 'Stark',
          },
        ]);
      });
      test('empty members returns empty array', async () => {
        const workingGroup = {
          ...getContentfulGraphqlWorkingGroup(),
          membersCollection: {
            total: 0,
            items: [],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          workingGroups: workingGroup,
        });
        const workingGroupDataObject = await workingGroupDataProvider.fetchById(
          'working-group-id',
        );
        expect(workingGroupDataObject?.members).toEqual([]);
      });
      test('avatar urls are added if available', async () => {
        const url = 'http://a-avatar.url';
        const workingGroup = {
          ...getContentfulGraphqlWorkingGroup(),
          membersCollection: {
            total: 0,
            items: [
              {
                sys: { id: '11' },
                role: 'Lead',
                user: {
                  sys: { id: '42 ' },
                  avatar: { url },
                  onboarded: true,
                },
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          workingGroups: workingGroup,
        });
        const workingGroupDataObject = await workingGroupDataProvider.fetchById(
          'working-group-id',
        );
        expect(workingGroupDataObject?.members[0]?.avatarUrl).toEqual(url);
      });
      test('should skip if the role property is undefined', async () => {
        const workingGroup = {
          ...getContentfulGraphqlWorkingGroup(),
          membersCollection: {
            total: 0,
            items: [
              {
                sys: { id: '11' },
                role: undefined,
                user: {
                  sys: { id: '42 ' },
                  onboarded: true,
                },
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          workingGroups: workingGroup,
        });
        const workingGroupDataObject = await workingGroupDataProvider.fetchById(
          'working-group-id',
        );
        expect(workingGroupDataObject?.members).toEqual([]);
      });
      test('should throw if the role property is invalid', () => {
        const workingGroup = {
          ...getContentfulGraphqlWorkingGroup(),
          membersCollection: {
            total: 0,
            items: [
              {
                sys: { id: '11' },
                role: 'invalid-role',
                user: {
                  sys: { id: '42 ' },
                  onboarded: true,
                },
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          workingGroups: workingGroup,
        });
        expect(() =>
          workingGroupDataProvider.fetchById('working-group-id'),
        ).rejects.toThrow();
      });
      test.each([false, undefined])(
        'should skip the user from the result if the user is not onboarded',
        async (onboarded) => {
          const workingGroup = {
            ...getContentfulGraphqlWorkingGroup(),
            membersCollection: {
              total: 0,
              items: [
                {
                  sys: { id: '11' },
                  role: 'Lead',
                  user: {
                    sys: { id: '42 ' },
                    onboarded,
                  },
                },
              ],
            },
          };
          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            workingGroups: workingGroup,
          });
          const workingGroupDataObject =
            await workingGroupDataProvider.fetchById('working-group-id');
          expect(workingGroupDataObject?.members).toEqual([]);
        },
      );
      test.each(gp2Model.workingGroupMemberRole)(
        'should parse the role',
        async (role) => {
          const workingGroup = {
            ...getContentfulGraphqlWorkingGroup(),
            membersCollection: {
              total: 0,
              items: [
                {
                  sys: { id: '11' },
                  role,
                  user: {
                    sys: { id: '42 ' },
                    onboarded: true,
                  },
                },
              ],
            },
          };
          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            workingGroups: workingGroup,
          });
          const workingGroupDataObject =
            await workingGroupDataProvider.fetchById('working-group-id');
          expect(workingGroupDataObject?.members[0]?.role).toEqual(role);
        },
      );
      test('should skip the user from the result if the user property is undefined', async () => {
        const workingGroup = {
          ...getContentfulGraphqlWorkingGroup(),
          membersCollection: {
            total: 0,
            items: [
              {
                sys: { id: '11' },
                role: 'Lead',
                user: null,
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          workingGroups: workingGroup,
        });
        const workingGroupDataObject = await workingGroupDataProvider.fetchById(
          'working-group-id',
        );
        expect(workingGroupDataObject?.members).toEqual([]);
      });
      test('undefined members should return empty array', async () => {
        const workingGroup = {
          ...getContentfulGraphqlWorkingGroup(),
          membersCollection: null,
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          workingGroups: workingGroup,
        });
        const workingGroupDataObject = await workingGroupDataProvider.fetchById(
          'working-group-id',
        );
        expect(workingGroupDataObject?.members).toEqual([]);
      });
    });
    describe('milestones', () => {
      test('undefined milestones returns empty array', async () => {
        const workingGroup = {
          ...getContentfulGraphqlWorkingGroup(),
          milestonesCollection: {
            total: 0,
            items: [],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          workingGroups: workingGroup,
        });
        const workingGroupDataObject = await workingGroupDataProvider.fetchById(
          'working-group-id',
        );
        expect(workingGroupDataObject?.milestones).toEqual([]);
      });
      test('if present it parses the link', async () => {
        const externalLink = 'it-is-a-link';
        const workingGroup = {
          ...getContentfulGraphqlWorkingGroup(),
          milestonesCollection: {
            total: 0,
            items: [
              {
                sys: {
                  id: '23',
                },
                status: 'Active',
                title: 'A working group milestone',
                externalLink,
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          workingGroups: workingGroup,
        });
        const workingGroupDataObject = await workingGroupDataProvider.fetchById(
          'working-group-id',
        );
        expect(workingGroupDataObject?.milestones[0]?.link).toEqual(
          externalLink,
        );
      });
      test('if present it parses the description', async () => {
        const description = 'it-is-a-description';
        const workingGroup = {
          ...getContentfulGraphqlWorkingGroup(),
          milestonesCollection: {
            total: 0,
            items: [
              {
                sys: {
                  id: '23',
                },
                status: 'Active',
                title: 'A working group milestone',
                description,
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          workingGroups: workingGroup,
        });
        const workingGroupDataObject = await workingGroupDataProvider.fetchById(
          'working-group-id',
        );
        expect(workingGroupDataObject?.milestones[0]?.description).toEqual(
          description,
        );
      });
      test('throws if status is not provided', () => {
        const workingGroup = {
          ...getContentfulGraphqlWorkingGroup(),
          milestonesCollection: {
            total: 0,
            items: [
              {
                sys: {
                  id: '23',
                },
                status: undefined,
                title: 'A working group milestone',
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          workingGroups: workingGroup,
        });
        expect(() =>
          workingGroupDataProvider.fetchById('working-group-id'),
        ).rejects.toThrow(new TypeError('milestone status is unknown'));
      });
      test('empty collection return empty array', async () => {
        const workingGroup = {
          ...getContentfulGraphqlWorkingGroup(),
          milestonesCollection: {
            total: 0,
            items: null,
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          workingGroups: workingGroup,
        });
        const workingGroupDataObject = await workingGroupDataProvider.fetchById(
          'working-group-id',
        );
        expect(workingGroupDataObject?.milestones).toEqual([]);
      });
    });
    describe('resources', () => {
      test('should map a resource note', async () => {
        const workingGroup = {
          ...getContentfulGraphqlWorkingGroup(),
          resourcesCollection: {
            total: 0,
            items: [
              {
                sys: {
                  id: '27',
                },
                type: 'Note',
                title: 'Working group resource title',
                description: 'Working group resource description',
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          workingGroups: workingGroup,
        });
        const workingGroupDataObject = await workingGroupDataProvider.fetchById(
          'working-group-id',
        );
        expect(workingGroupDataObject?.resources).toStrictEqual([
          {
            description: 'Working group resource description',
            title: 'Working group resource title',
            type: 'Note',
          },
        ]);
      });
      test('should ignore an external link for a resource note', async () => {
        const workingGroup = {
          ...getContentfulGraphqlWorkingGroup(),
          resourcesCollection: {
            total: 0,
            items: [
              {
                sys: {
                  id: '27',
                },
                type: 'Note',
                title: 'Working group resource title',
                description: 'Working group resource description',
                externalLink: 'http://example/link',
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          workingGroups: workingGroup,
        });
        const workingGroupDataObject = await workingGroupDataProvider.fetchById(
          'working-group-id',
        );
        expect(workingGroupDataObject?.resources).toStrictEqual([
          {
            description: 'Working group resource description',
            title: 'Working group resource title',
            type: 'Note',
          },
        ]);
      });
      test('should map a resource link', async () => {
        const externalLink = 'this is an external link';
        const workingGroup = {
          ...getContentfulGraphqlWorkingGroup(),
          resourcesCollection: {
            total: 0,
            items: [
              {
                sys: {
                  id: '27',
                },
                type: 'Link',
                title: 'Working group resource title',
                description: 'Working group resource description',
                externalLink,
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          workingGroups: workingGroup,
        });
        const workingGroupDataObject = await workingGroupDataProvider.fetchById(
          'working-group-id',
        );
        expect(workingGroupDataObject?.resources).toStrictEqual([
          {
            description: 'Working group resource description',
            title: 'Working group resource title',
            type: 'Link',
            externalLink,
          },
        ]);
      });
      test('should ignore a resource if title is undefined.', async () => {
        const workingGroup = {
          ...getContentfulGraphqlWorkingGroup(),
          resourcesCollection: {
            total: 0,
            items: [
              {
                sys: {
                  id: '27',
                },
                type: 'Link',
                title: null,
                description: 'Working group resource description',
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          workingGroups: workingGroup,
        });
        const workingGroupDataObject = await workingGroupDataProvider.fetchById(
          'working-group-id',
        );
        expect(workingGroupDataObject?.resources).toStrictEqual([]);
      });
    });
    test('should return a resource if description is undefined.', async () => {
      const workingGroup = {
        ...getContentfulGraphqlWorkingGroup(),
        resourcesCollection: {
          total: 0,
          items: [
            {
              sys: {
                id: '27',
              },
              type: 'Link',
              title: 'Working group resource title',
              description: null,
            },
          ],
        },
      };
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        workingGroups: workingGroup,
      });
      const workingGroupDataObject = await workingGroupDataProvider.fetchById(
        'working-group-id',
      );
      expect(
        workingGroupDataObject?.resources![0]?.description,
      ).toBeUndefined();
    });
    test('should ignore a resource if external Link is undefined for a Link.', async () => {
      const workingGroup = {
        ...getContentfulGraphqlWorkingGroup(),
        resourcesCollection: {
          total: 0,
          items: [
            {
              sys: {
                id: '27',
              },
              type: 'Link',
              title: 'Working group resource title',
              externalLink: null,
            },
          ],
        },
      };
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        workingGroups: workingGroup,
      });
      const workingGroupDataObject = await workingGroupDataProvider.fetchById(
        'working-group-id',
      );
      expect(workingGroupDataObject?.resources).toStrictEqual([]);
    });
    test('empty resources returns empty array', async () => {
      const workingGroup = {
        ...getContentfulGraphqlWorkingGroup(),
        resourcesCollection: {
          total: 0,
          items: [],
        },
      };
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        workingGroups: workingGroup,
      });
      const workingGroupDataObject = await workingGroupDataProvider.fetchById(
        'working-group-id',
      );
      expect(workingGroupDataObject?.resources).toEqual([]);
    });
  });
  describe('Fetch method', () => {
    test('Should throw as not implemented', async () => {
      expect(await workingGroupDataProvider.fetch()).toEqual({
        items: [],
        total: 0,
      });
    });
  });
  describe('update method', () => {
    test('Should throw as not implemented', async () => {
      expect.assertions(1);
      await expect(workingGroupDataProvider.update()).rejects.toThrow(
        /Method not implemented/i,
      );
    });
  });
});

import {
  Entry,
  Environment,
  getGP2ContentfulGraphqlClientMockServer,
  patchAndPublish,
} from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import { WorkingGroupContentfulDataProvider } from '../../../src/data-providers/contentful/working-group.data-provider';
import { getEntry } from '../../fixtures/contentful.fixtures';
import {
  getContentfulGraphqlWorkingGroup,
  getContentfulGraphqlWorkingGroupsResponse,
  getListWorkingGroupDataObject,
  getWorkingGroupDataObject,
} from '../../fixtures/working-group.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';

jest.mock('@asap-hub/contentful', () => ({
  ...jest.requireActual('@asap-hub/contentful'),
  patchAndPublish: jest.fn().mockResolvedValue(undefined),
}));
describe('Working Group Data Provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const workingGroupDataProvider = new WorkingGroupContentfulDataProvider(
    contentfulGraphqlClientMock,
    contentfulRestClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getGP2ContentfulGraphqlClientMockServer({
      WorkingGroups: () => getContentfulGraphqlWorkingGroup(),
    });

  const workingGroupDataProviderWithMockServer =
    new WorkingGroupContentfulDataProvider(
      contentfulGraphqlClientMockServer,
      contentfulRestClientMock,
    );

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
            id: '27',
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
            id: '27',
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
            id: '27',
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
    test('Should fetch the working group from squidex graphql', async () => {
      const result = await workingGroupDataProviderWithMockServer.fetch();

      expect(result).toMatchObject(getListWorkingGroupDataObject());
    });

    test('Should return an empty result', async () => {
      const mockResponse = getContentfulGraphqlWorkingGroupsResponse();
      mockResponse.workingGroupsCollection!.items = [];
      mockResponse.workingGroupsCollection!.total = 0;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await workingGroupDataProvider.fetch();
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result if the client returns a response with a null items property', async () => {
      const mockResponse = getContentfulGraphqlWorkingGroupsResponse();
      mockResponse.workingGroupsCollection = null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await workingGroupDataProvider.fetch();
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should default null title, shortDescription and leadingMembers to an empty string', async () => {
      const mockResponse = getContentfulGraphqlWorkingGroupsResponse();
      const workingGroup = getContentfulGraphqlWorkingGroup();
      workingGroup.title = null;
      workingGroup.shortDescription = null;
      workingGroup.leadingMembers = null;
      mockResponse.workingGroupsCollection!.items = [workingGroup];
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const { items } = await workingGroupDataProvider.fetch();
      expect(items[0]).toMatchObject({
        title: '',
        shortDescription: '',
        leadingMembers: '',
      });
    });

    test('Should default null calendars to undefined', async () => {
      const mockResponse = getContentfulGraphqlWorkingGroupsResponse();
      const workingGroup = getContentfulGraphqlWorkingGroup();
      workingGroup.calendar = null;
      mockResponse.workingGroupsCollection!.items = [workingGroup];
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const { items } = await workingGroupDataProvider.fetch();
      expect(items[0]).toMatchObject({
        calendar: undefined,
      });
    });
  });
  describe('update method', () => {
    const workingGroupId = '11';

    beforeEach(() => {
      jest.resetAllMocks();
      const mockPatchAndPublish = patchAndPublish as jest.MockedFunction<
        typeof patchAndPublish
      >;
      mockPatchAndPublish.mockResolvedValue({
        sys: {
          publishedVersion: 2,
        },
      } as Entry);
      contentfulGraphqlClientMock.request.mockResolvedValue({
        workingGroups: {
          sys: {
            publishedVersion: 2,
          },
        },
      });
    });

    describe.only('resource', () => {
      test('It should create the resource and associate it to the working group', async () => {
        const id = '42';
        const resourceMock = getEntry({}, id);
        const title = 'a title 2';
        const type = 'Note';
        const entry = getEntry({ fields: { resources: [] } });
        environmentMock.getEntry.mockResolvedValueOnce(entry);
        environmentMock.createEntry.mockResolvedValueOnce(resourceMock);
        resourceMock.publish = jest.fn().mockResolvedValueOnce(resourceMock);
        await workingGroupDataProvider.update(workingGroupId, {
          resources: [{ title, type }],
        });
        expect(environmentMock.createEntry).toHaveBeenCalledWith('resources', {
          fields: {
            title: { 'en-US': title },
            type: { 'en-US': type },
          },
        });

        expect(resourceMock.publish).toHaveBeenCalled();
        expect(patchAndPublish).toHaveBeenCalledWith(entry, {
          resources: [{ sys: { id, linkType: 'Entry', type: 'Link' } }],
        });
      });
    });
    test('checks version of published data and polls until they match', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        workingGroups: {
          sys: {
            publishedVersion: 1,
          },
        },
      });
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        workingGroups: {
          sys: {
            publishedVersion: 1,
          },
        },
      });
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        workingGroups: {
          sys: {
            publishedVersion: 2,
          },
        },
      });

      await workingGroupDataProvider.update('123', {
        resources: [{ title: 'title', type: 'Note' }],
      });
      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledTimes(3);
    });
  });
});

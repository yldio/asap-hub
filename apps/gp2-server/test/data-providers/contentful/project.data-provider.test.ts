import {
  Entry,
  Environment,
  getGP2ContentfulGraphqlClientMockServer,
  patchAndPublish,
} from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import { ProjectContentfulDataProvider } from '../../../src/data-providers/contentful/project.data-provider';
import { getEntry } from '../../fixtures/contentful.fixtures';
import {
  getContentfulGraphqlProject,
  getContentfulGraphqlProjectsResponse,
  getListProjectDataObject,
  getProjectDataObject,
} from '../../fixtures/project.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';

jest.mock('@asap-hub/contentful', () => ({
  ...jest.requireActual('@asap-hub/contentful'),
  patchAndPublish: jest.fn().mockResolvedValue(undefined),
}));
describe('Project Data Provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const projectDataProvider = new ProjectContentfulDataProvider(
    contentfulGraphqlClientMock,
    contentfulRestClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getGP2ContentfulGraphqlClientMockServer({
      Projects: () => getContentfulGraphqlProject(),
    });

  const projectDataProviderWithMockServer = new ProjectContentfulDataProvider(
    contentfulGraphqlClientMockServer,
    contentfulRestClientMock,
  );
  beforeEach(jest.resetAllMocks);

  describe('FetchById', () => {
    test('Should fetch the project from squidex graphql', async () => {
      const result = await projectDataProviderWithMockServer.fetchById('id');

      expect(result).toMatchObject(getProjectDataObject());
    });

    test('Should return null when the project is not found', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projects: null,
      });

      expect(await projectDataProvider.fetchById('not-found')).toBeNull();
    });
    test('the project is parsed', async () => {
      const project = getContentfulGraphqlProject();
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projects: project,
      });
      const projectDataObject = await projectDataProvider.fetchById('id');
      const expected = getProjectDataObject();
      expect(projectDataObject).toEqual(expected);
    });
    test.each([null, 'invalid-status'])('with no status %s', (status) => {
      const project = getContentfulGraphqlProject();
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projects: { ...project, status },
      });
      expect(() => projectDataProvider.fetchById('id')).rejects.toThrowError(
        new TypeError('status is unknown'),
      );
    });
    test('pm emails are added if available', async () => {
      const email = 'tony@starkenterprises.com';
      const project = getContentfulGraphqlProject();
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projects: { ...project, pmEmail: email },
      });
      const projectDataObject = await projectDataProvider.fetchById('id');
      expect(projectDataObject?.pmEmail).toEqual(email);
    });

    test('lead emails are added if available', async () => {
      const email = 'tony@starkenterprises.com';
      const project = getContentfulGraphqlProject();
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projects: { ...project, leadEmail: email },
      });
      const projectDataObject = await projectDataProvider.fetchById('id');
      expect(projectDataObject?.leadEmail).toEqual(email);
    });

    test('description is added if available', async () => {
      const description = 'this is a description';
      const project = getContentfulGraphqlProject();
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projects: { ...project, description },
      });
      const projectDataObject = await projectDataProvider.fetchById('id');
      expect(projectDataObject?.description).toEqual(description);
    });

    describe('keywords', () => {
      test.each(gp2Model.keywords)(
        'keywords are added - %s',
        async (keyword) => {
          const expectedKeywords = [keyword];
          const project = getContentfulGraphqlProject();
          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            projects: { ...project, keywords: expectedKeywords },
          });
          const projectDataObject = await projectDataProvider.fetchById('id');
          expect(projectDataObject?.keywords).toEqual(expectedKeywords);
        },
      );

      test('keywords are valid', () => {
        const project = getContentfulGraphqlProject();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          projects: { ...project, keywords: ['invalid'] },
        });
        expect(() => projectDataProvider.fetchById('id')).rejects.toThrow();
      });
    });

    describe('traineeProject', () => {
      test('if doesnt exist it returns as false', async () => {
        const project = getContentfulGraphqlProject();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          projects: { ...project, traineeProject: null },
        });
        const projectDataObject = await projectDataProvider.fetchById('id');
        expect(projectDataObject?.traineeProject).toEqual(false);
      });

      test('returns if available', async () => {
        const project = getContentfulGraphqlProject();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          projects: { ...project, traineeProject: true },
        });
        const projectDataObject = await projectDataProvider.fetchById('id');
        expect(projectDataObject?.traineeProject).toEqual(true);
      });
    });
    describe('opportunitiesLink', () => {
      test('if doesnt exist it returns as false', async () => {
        const project = getContentfulGraphqlProject();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          projects: { ...project, opportunitiesLink: null },
        });
        const projectDataObject = await projectDataProvider.fetchById('id');
        expect(projectDataObject?.opportunitiesLink).toBeUndefined();
      });

      test('returns if available', async () => {
        const opportunitiesLink = 'https://link';
        const project = getContentfulGraphqlProject();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          projects: { ...project, opportunitiesLink },
        });
        const projectDataObject = await projectDataProvider.fetchById('id');
        expect(projectDataObject?.opportunitiesLink).toEqual(opportunitiesLink);
      });
    });
    describe('members', () => {
      test('empty members returns empty array', async () => {
        const project = getContentfulGraphqlProject();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          projects: { ...project, membersCollection: { total: 0, items: [] } },
        });
        const projectDataObject = await projectDataProvider.fetchById('id');
        expect(projectDataObject?.members).toEqual([]);
      });

      test('avatar urls are added if available', async () => {
        const project = getContentfulGraphqlProject();
        const url = 'http://a-avatar.url';
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          projects: {
            ...project,
            membersCollection: {
              total: 0,
              items: [
                {
                  sys: { id: '11' },
                  role: 'Project lead',
                  user: {
                    sys: { id: '42 ' },
                    avatar: { url },
                    onboarded: true,
                  },
                },
              ],
            },
          },
        });
        const projectDataObject = await projectDataProvider.fetchById('id');
        expect(projectDataObject?.members[0]?.avatarUrl).toEqual(url);
      });

      test('should skip the user from the result if the role property is undefined', async () => {
        const project = getContentfulGraphqlProject();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          projects: {
            ...project,
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
          },
        });
        const projectDataObject = await projectDataProvider.fetchById('id');
        expect(projectDataObject?.members).toEqual([]);
      });
      test('should throw if the role property is invalid', () => {
        const project = {
          ...getContentfulGraphqlProject(),
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
          projects: project,
        });
        expect(() => projectDataProvider.fetchById('id')).rejects.toThrow();
      });

      test.each([false, undefined])(
        'should skip the user from the result if the user is not onboarded',
        async (onboarded) => {
          const project = {
            ...getContentfulGraphqlProject(),
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
            projects: project,
          });
          const projectDataObject = await projectDataProvider.fetchById('id');
          expect(projectDataObject?.members).toEqual([]);
        },
      );

      test.each([gp2Model.projectMemberRole])(
        'should parse the role',
        async (role) => {
          const project = {
            ...getContentfulGraphqlProject(),
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
            projects: project,
          });
          const projectDataObject = await projectDataProvider.fetchById('id');
          expect(projectDataObject?.members[0]?.role).toEqual(role);
        },
      );
    });
    describe('resources', () => {
      test('should map a resource note', async () => {
        const project = {
          ...getContentfulGraphqlProject(),
          resourcesCollection: {
            total: 0,
            items: [
              {
                sys: {
                  id: '27',
                },
                type: 'Note',
                title: 'Project resource title',
                description: 'Project resource description',
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          projects: project,
        });
        const projectDataObject = await projectDataProvider.fetchById('id');
        expect(projectDataObject?.resources).toStrictEqual([
          {
            id: '27',
            description: 'Project resource description',
            title: 'Project resource title',
            type: 'Note',
          },
        ]);
      });
      test('should ignore an external link for a resource note', async () => {
        const project = {
          ...getContentfulGraphqlProject(),
          resourcesCollection: {
            total: 0,
            items: [
              {
                sys: {
                  id: '27',
                },
                type: 'Note',
                title: 'Project resource title',
                description: 'Project resource description',
                externalLink: 'http://example/link',
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          projects: project,
        });
        const projectDataObject = await projectDataProvider.fetchById('id');
        expect(projectDataObject?.resources).toStrictEqual([
          {
            id: '27',
            description: 'Project resource description',
            title: 'Project resource title',
            type: 'Note',
          },
        ]);
      });
      test('should map a resource link', async () => {
        const externalLink = 'this is an external link';
        const project = {
          ...getContentfulGraphqlProject(),
          resourcesCollection: {
            total: 0,
            items: [
              {
                sys: {
                  id: '27',
                },
                type: 'Link',
                title: 'Project resource title',
                description: 'Project resource description',
                externalLink,
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          projects: project,
        });
        const projectDataObject = await projectDataProvider.fetchById('id');
        expect(projectDataObject?.resources).toStrictEqual([
          {
            id: '27',
            description: 'Project resource description',
            title: 'Project resource title',
            type: 'Link',
            externalLink,
          },
        ]);
      });
      test('should ignore a resource if title is undefined.', async () => {
        const project = {
          ...getContentfulGraphqlProject(),
          resourcesCollection: {
            total: 0,
            items: [
              {
                sys: {
                  id: '27',
                },
                type: 'Link',
                title: null,
                description: 'Project resource description',
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          projects: project,
        });
        const projectDataObject = await projectDataProvider.fetchById('id');
        expect(projectDataObject?.resources).toStrictEqual([]);
      });
      test('should return a resource if description is undefined.', async () => {
        const project = {
          ...getContentfulGraphqlProject(),
          resourcesCollection: {
            total: 0,
            items: [
              {
                sys: {
                  id: '27',
                },
                type: 'Link',
                title: 'Project resource title',
                description: null,
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          projects: project,
        });
        const projectDataObject = await projectDataProvider.fetchById('id');
        expect(projectDataObject?.resources![0]?.description).toBeUndefined();
      });
      test('should ignore a resource if external Link is undefined for a Link.', async () => {
        const project = {
          ...getContentfulGraphqlProject(),
          resourcesCollection: {
            total: 0,
            items: [
              {
                sys: {
                  id: '27',
                },
                type: 'Link',
                title: 'Project resource title',
                externalLink: null,
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          projects: project,
        });
        const projectDataObject = await projectDataProvider.fetchById('id');
        expect(projectDataObject?.resources).toStrictEqual([]);
      });
      test('empty resources returns empty array', async () => {
        const project = {
          ...getContentfulGraphqlProject(),
          resourcesCollection: {
            total: 0,
            items: [],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          projects: project,
        });
        const projectDataObject = await projectDataProvider.fetchById('id');
        expect(projectDataObject?.resources).toEqual([]);
      });
    });
    describe('milestones', () => {
      test('undefined milestones returns empty array', async () => {
        const project = {
          ...getContentfulGraphqlProject(),
          milestonesCollection: {
            total: 0,
            items: [],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          projects: project,
        });
        const projectDataObject = await projectDataProvider.fetchById('id');
        expect(projectDataObject?.milestones).toEqual([]);
      });
      test('if present it parses the link', async () => {
        const externalLink = 'it-is-a-link';
        const project = {
          ...getContentfulGraphqlProject(),
          milestonesCollection: {
            total: 0,
            items: [
              {
                sys: {
                  id: '23',
                },
                status: 'Active',
                title: 'A project milestone',
                externalLink,
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          projects: project,
        });
        const projectDataObject = await projectDataProvider.fetchById('id');
        expect(projectDataObject?.milestones[0]?.link).toEqual(externalLink);
      });
      test('if present it parses the description', async () => {
        const description = 'it-is-a-description';
        const project = {
          ...getContentfulGraphqlProject(),
          milestonesCollection: {
            total: 0,
            items: [
              {
                sys: {
                  id: '23',
                },
                status: 'Active',
                title: 'A project milestone',
                description,
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          projects: project,
        });
        const projectDataObject = await projectDataProvider.fetchById('id');
        expect(projectDataObject?.milestones[0]?.description).toEqual(
          description,
        );
      });
      test('throws if status is not provided', async () => {
        const project = {
          ...getContentfulGraphqlProject(),
          milestonesCollection: {
            total: 0,
            items: [
              {
                sys: {
                  id: '23',
                },
                status: undefined,
                title: 'A project milestone',
              },
            ],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          projects: project,
        });
        const projectDataObject = await projectDataProvider.fetchById('id');
        expect(projectDataObject?.milestones).toEqual([]);
      });
    });
  });

  describe('Fetch', () => {
    const options = {
      take: 10,
      skip: 0,
    };

    test('Should fetch the project from squidex graphql', async () => {
      const result = await projectDataProviderWithMockServer.fetch(options);

      expect(result).toMatchObject(getListProjectDataObject());
    });

    test('Should return null when the project is not found', async () => {
      const mockResponse = getContentfulGraphqlProjectsResponse();
      mockResponse.projectsCollection!.items = [];
      mockResponse.projectsCollection!.total = 0;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await projectDataProvider.fetch(options);
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result if the client returns a response with a null items property', async () => {
      const mockResponse = getContentfulGraphqlProjectsResponse();
      mockResponse.projectsCollection = null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await projectDataProvider.fetch(options);
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result if the client returns a response with a null query property', async () => {
      const mockResponse = getContentfulGraphqlProjectsResponse();
      mockResponse.projectsCollection = null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await projectDataProvider.fetch(options);
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should default null title, startDate to an empty string', async () => {
      const mockResponse = getContentfulGraphqlProjectsResponse();
      const project = getContentfulGraphqlProject();
      project.title = null;
      project.startDate = null;
      mockResponse.projectsCollection!.items = [project];
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const { items } = await projectDataProvider.fetch(options);
      expect(items[0]).toMatchObject({
        title: '',
        startDate: '',
      });
    });

    test('Should default null calendars to undefined', async () => {
      const mockResponse = getContentfulGraphqlProjectsResponse();
      const project = getContentfulGraphqlProject();
      project.calendar = null;
      mockResponse.projectsCollection!.items = [project];
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const { items } = await projectDataProvider.fetch(options);
      expect(items[0]).toMatchObject({
        calendar: undefined,
      });
    });
  });

  describe('Update', () => {
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
        projects: {
          sys: {
            publishedVersion: 2,
          },
          status: 'Active',
        },
      });
    });

    describe('resource', () => {
      test('It should create the Note resource and associate it to the project', async () => {
        const projectId = '11';
        const resourceId = '11';
        const createdResourceMock = getEntry({}, resourceId);
        const title = 'a title 2';
        const type = 'Note';
        const existingProjectMock = getEntry({
          fields: { resources: [] },
        });
        environmentMock.getEntry.mockResolvedValueOnce(existingProjectMock);
        environmentMock.createEntry.mockResolvedValueOnce(createdResourceMock);
        createdResourceMock.publish = jest
          .fn()
          .mockResolvedValueOnce(createdResourceMock);
        await projectDataProvider.update(projectId, {
          resources: [{ title, type }],
        });
        expect(environmentMock.createEntry).toHaveBeenCalledWith('resources', {
          fields: {
            description: { 'en-US': undefined },
            externalLink: { 'en-US': undefined },
            title: { 'en-US': title },
            type: { 'en-US': type },
          },
        });

        expect(createdResourceMock.publish).toHaveBeenCalled();
        expect(patchAndPublish).toHaveBeenCalledWith(existingProjectMock, {
          resources: [
            { sys: { id: resourceId, linkType: 'Entry', type: 'Link' } },
          ],
        });
      });
      test('It should create the Link resource and associate it to the project', async () => {
        const projectId = '11';
        const resourceId = '11';
        const createdResourceMock = getEntry({}, resourceId);
        const title = 'a title 2';
        const description = 'a description 2';
        const externalLink = 'http://example.com/a-link';
        const type = 'Link';
        const existingProjectMock = getEntry({
          fields: { resources: [] },
        });
        environmentMock.getEntry.mockResolvedValueOnce(existingProjectMock);
        environmentMock.createEntry.mockResolvedValueOnce(createdResourceMock);
        createdResourceMock.publish = jest
          .fn()
          .mockResolvedValueOnce(createdResourceMock);
        await projectDataProvider.update(projectId, {
          resources: [{ title, type, externalLink, description }],
        });
        expect(environmentMock.createEntry).toHaveBeenCalledWith('resources', {
          fields: {
            description: { 'en-US': description },
            externalLink: { 'en-US': externalLink },
            title: { 'en-US': title },
            type: { 'en-US': type },
          },
        });

        expect(createdResourceMock.publish).toHaveBeenCalled();
        expect(patchAndPublish).toHaveBeenCalledWith(existingProjectMock, {
          resources: [
            { sys: { id: resourceId, linkType: 'Entry', type: 'Link' } },
          ],
        });
      });
      test('It should delete the resource and unassociate it to the project if no resources passed', async () => {
        const projectId = '42';
        const existingResourceId = '11';
        const existingProjectMock = getEntry(
          {
            fields: {
              resources: {
                'en-US': [
                  {
                    sys: { id: existingResourceId },
                    linkType: 'Entry',
                    type: 'Link',
                  },
                ],
              },
            },
          },
          projectId,
        );
        const existingResourceMock = getEntry({}, existingResourceId);
        const unpublishSpy = jest.fn();
        const deleteSpy = jest.fn();
        environmentMock.getEntry
          .mockResolvedValueOnce(existingProjectMock)
          .mockResolvedValueOnce(existingResourceMock);
        existingResourceMock.unpublish = unpublishSpy;
        existingResourceMock.delete = deleteSpy;
        await projectDataProvider.update(projectId, {
          resources: [],
        });
        expect(patchAndPublish).toHaveBeenCalledWith(existingProjectMock, {
          resources: [],
        });
        expect(unpublishSpy).toBeCalled();
        expect(deleteSpy).toBeCalled();
        expect(environmentMock.createEntry).not.toBeCalled();
      });
      test('It should update the resource', async () => {
        const title = 'a title 2';
        const type = 'Note';
        const projectId = '42';
        const existingResourceId = '11';
        const existingProjectMock = getEntry(
          {
            fields: {
              resources: {
                'en-US': [
                  {
                    sys: { id: existingResourceId },
                    linkType: 'Entry',
                    type: 'Link',
                  },
                ],
              },
            },
          },
          projectId,
        );
        const existingResourceMock = getEntry({}, existingResourceId);
        environmentMock.getEntry
          .mockResolvedValueOnce(existingProjectMock)
          .mockResolvedValueOnce(existingResourceMock);
        await projectDataProvider.update(projectId, {
          resources: [{ id: existingResourceId, title, type }],
        });
        expect(patchAndPublish).toHaveBeenNthCalledWith(
          1,
          existingResourceMock,
          {
            title,
            type,
          },
        );
        expect(patchAndPublish).toHaveBeenNthCalledWith(
          2,
          existingProjectMock,
          {
            resources: [
              {
                sys: {
                  id: existingResourceId,
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            ],
          },
        );
        expect(environmentMock.createEntry).not.toBeCalled();
      });
      test.each([
        {
          title: 'new title',
        },
        {
          description: 'new title',
        },
        {
          type: 'Note' as const,
        },
        {
          externalLink: 'http://example.com/new-link',
        },
      ])(
        'It should not update the resource only if it is the same',
        async (override) => {
          const title = 'a title 2';
          const type = 'Link' as const;
          const description = 'a description';
          const externalLink = 'http://example.com/a-link';
          const projectId = '42';
          const existingResourceId = '11';
          const project = getContentfulGraphqlProject();
          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            projects: {
              ...project,
              resourcesCollection: {
                total: 1,
                items: [
                  {
                    sys: { id: existingResourceId },
                    title,
                    type,
                    description,
                    externalLink,
                  },
                ],
              },
            },
          });
          const existingProjectMock = getEntry(
            {
              fields: {
                resources: {
                  'en-US': [
                    {
                      sys: { id: existingResourceId },
                      linkType: 'Entry',
                      type: 'Link',
                    },
                  ],
                },
              },
            },
            projectId,
          );
          const existingResourceMock = getEntry(
            {
              fields: {
                type,
                title,
                description,
                externalLink,
              },
            },
            existingResourceId,
          );
          environmentMock.getEntry
            .mockResolvedValueOnce(existingProjectMock)
            .mockResolvedValueOnce(existingResourceMock);
          await projectDataProvider.update(projectId, {
            resources: [
              {
                id: existingResourceId,
                title,
                type,
                externalLink,
                description,
                ...override,
              },
            ],
          });
          expect(patchAndPublish).toHaveBeenNthCalledWith(
            1,
            existingResourceMock,
            {
              title,
              type,
              description,
              externalLink,
              ...override,
            },
          );
          expect(patchAndPublish).toHaveBeenNthCalledWith(
            2,
            existingProjectMock,
            {
              resources: [
                {
                  sys: {
                    id: existingResourceId,
                    linkType: 'Entry',
                    type: 'Link',
                  },
                },
              ],
            },
          );
          expect(environmentMock.createEntry).not.toBeCalled();
        },
      );
      test.each<gp2Model.Resource['type']>(['Link', 'Note'])(
        'It should not update the resource only if it is the same',
        async (type) => {
          const title = 'a title 2';
          const description = 'a description';
          const externalLink = 'http://example.com/a-link';
          const projectId = '42';
          const existingResourceId = '11';
          const project = getContentfulGraphqlProject();
          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            projects: {
              ...project,
              resourcesCollection: {
                total: 1,
                items: [
                  {
                    sys: { id: existingResourceId },
                    title,
                    type,
                    description,
                    ...(type === 'Link' ? { externalLink } : {}),
                  },
                ],
              },
            },
          });
          const existingProjectMock = getEntry(
            {
              fields: {
                resources: {
                  'en-US': [
                    {
                      sys: { id: existingResourceId },
                      linkType: 'Entry',
                      type: 'Link',
                    },
                  ],
                },
              },
            },
            projectId,
          );
          const existingResourceMock = getEntry(
            {
              fields: {
                type,
                title,
                description,
                ...(type === 'Link' ? { externalLink } : {}),
              },
            },
            existingResourceId,
          );
          environmentMock.getEntry
            .mockResolvedValueOnce(existingProjectMock)
            .mockResolvedValueOnce(existingResourceMock);
          const resourceToUpdate: gp2Model.Resource = {
            id: existingResourceId,
            title,
            description,
            ...(type === 'Link' ? { externalLink, type } : { type }),
          };
          await projectDataProvider.update(projectId, {
            resources: [resourceToUpdate],
          });
          expect(patchAndPublish).toHaveBeenNthCalledWith(
            1,
            existingProjectMock,
            {
              resources: [
                {
                  sys: {
                    id: existingResourceId,
                    linkType: 'Entry',
                    type: 'Link',
                  },
                },
              ],
            },
          );
          expect(environmentMock.createEntry).not.toBeCalled();
        },
      );
    });
    test('checks version of published data and polls until they match', async () => {
      const existingProjectMock = getEntry({
        fields: { resources: [] },
      });
      environmentMock.getEntry.mockResolvedValueOnce(existingProjectMock);
      const createdResourceMock = getEntry({});
      environmentMock.createEntry.mockResolvedValueOnce(createdResourceMock);
      createdResourceMock.publish = jest
        .fn()
        .mockResolvedValueOnce(createdResourceMock);
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projects: {
          sys: {
            publishedVersion: 1,
          },
          status: 'Active',
        },
      });
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projects: {
          sys: {
            publishedVersion: 1,
          },
        },
      });
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projects: {
          sys: {
            publishedVersion: 2,
          },
        },
      });

      await projectDataProvider.update('123', {
        resources: [{ title: 'title', type: 'Note' }],
      });
      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledTimes(3);
    });
  });
});

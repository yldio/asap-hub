import { AimsMilestonesContentfulDataProvider } from '../../../src/data-providers/contentful/aims-milestones.data-provider';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';

describe('AimsMilestonesContentfulDataProvider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const dataProvider = new AimsMilestonesContentfulDataProvider(
    contentfulGraphqlClientMock,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('fetchProjectsWithAims', () => {
    it('returns projects with their aims collections', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projectsCollection: {
          total: 1,
          items: [
            {
              sys: { id: 'project-1' },
              originalGrantAimsCollection: {
                items: [
                  { sys: { id: 'aim-1' }, description: 'Aim one' },
                  { sys: { id: 'aim-2' }, description: 'Aim two' },
                ],
              },
              supplementGrant: null,
            },
          ],
        },
      });

      const result = await dataProvider.fetchProjectsWithAims({
        limit: 10,
        skip: 0,
      });

      expect(result).toEqual({
        total: 1,
        items: [
          {
            sys: { id: 'project-1' },
            originalGrantAimsCollection: {
              items: [
                { sys: { id: 'aim-1' }, description: 'Aim one' },
                { sys: { id: 'aim-2' }, description: 'Aim two' },
              ],
            },
            supplementGrant: null,
          },
        ],
      });
    });

    it('passes limit and skip to the query', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projectsCollection: { total: 0, items: [] },
      });

      await dataProvider.fetchProjectsWithAims({ limit: 25, skip: 50 });

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ limit: 25, skip: 50 }),
      );
    });

    it('returns empty result when Contentful returns null collection', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projectsCollection: null,
      });

      const result = await dataProvider.fetchProjectsWithAims({
        limit: 10,
        skip: 0,
      });

      expect(result).toEqual({ total: 0, items: [] });
    });
  });

  describe('fetchAimsWithMilestones', () => {
    it('returns aims with their linked milestones', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        aimsCollection: {
          total: 2,
          items: [
            {
              sys: { id: 'aim-1' },
              milestonesCollection: {
                items: [
                  { sys: { id: 'milestone-1' } },
                  { sys: { id: 'milestone-2' } },
                ],
              },
            },
            {
              sys: { id: 'aim-2' },
              milestonesCollection: { items: [] },
            },
          ],
        },
      });

      const result = await dataProvider.fetchAimsWithMilestones({
        limit: 10,
        skip: 0,
      });

      expect(result).toEqual({
        total: 2,
        items: [
          {
            sys: { id: 'aim-1' },
            milestonesCollection: {
              items: [
                { sys: { id: 'milestone-1' } },
                { sys: { id: 'milestone-2' } },
              ],
            },
          },
          {
            sys: { id: 'aim-2' },
            milestonesCollection: { items: [] },
          },
        ],
      });
    });

    it('passes limit and skip to the query', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        aimsCollection: { total: 0, items: [] },
      });

      await dataProvider.fetchAimsWithMilestones({ limit: 100, skip: 200 });

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ limit: 100, skip: 200 }),
      );
    });

    it('returns empty result when Contentful returns null collection', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        aimsCollection: null,
      });

      const result = await dataProvider.fetchAimsWithMilestones({
        limit: 10,
        skip: 0,
      });

      expect(result).toEqual({ total: 0, items: [] });
    });
  });

  describe('fetchMilestones', () => {
    it('returns milestones with sys fields, status, and related articles', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        milestonesCollection: {
          total: 1,
          items: [
            {
              sys: {
                id: 'milestone-1',
                firstPublishedAt: '2025-01-01T00:00:00.000Z',
                publishedAt: '2025-06-01T00:00:00.000Z',
              },
              description: 'Deliver initial dataset',
              status: 'Completed',
              relatedArticlesCollection: {
                total: 2,
                items: [{ doi: '10.1000/abc123' }, { doi: '10.1000/def456' }],
              },
            },
          ],
        },
      });

      const result = await dataProvider.fetchMilestones({ limit: 10, skip: 0 });

      expect(result).toEqual({
        total: 1,
        items: [
          {
            sys: {
              id: 'milestone-1',
              firstPublishedAt: '2025-01-01T00:00:00.000Z',
              publishedAt: '2025-06-01T00:00:00.000Z',
            },
            description: 'Deliver initial dataset',
            status: 'Completed',
            relatedArticlesCollection: {
              total: 2,
              items: [{ doi: '10.1000/abc123' }, { doi: '10.1000/def456' }],
            },
          },
        ],
      });
    });

    it('passes limit and skip to the query', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        milestonesCollection: { total: 0, items: [] },
      });

      await dataProvider.fetchMilestones({ limit: 50, skip: 100 });

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ limit: 50, skip: 100 }),
      );
    });

    it('returns empty result when Contentful returns null collection', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        milestonesCollection: null,
      });

      const result = await dataProvider.fetchMilestones({ limit: 10, skip: 0 });

      expect(result).toEqual({ total: 0, items: [] });
    });

    it('handles milestones with no related articles', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        milestonesCollection: {
          total: 1,
          items: [
            {
              sys: {
                id: 'milestone-2',
                firstPublishedAt: null,
                publishedAt: null,
              },
              description: 'Pending milestone',
              status: 'Active',
              relatedArticlesCollection: { total: 0, items: [] },
            },
          ],
        },
      });

      const result = await dataProvider.fetchMilestones({ limit: 10, skip: 0 });

      expect(result.items[0]).toMatchObject({
        sys: { id: 'milestone-2' },
        relatedArticlesCollection: { total: 0, items: [] },
      });
    });
  });

  describe('fetchArticlesForAim', () => {
    it('returns articles from milestones, deduplicating by id', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        aims: {
          milestonesCollection: {
            items: [
              {
                relatedArticlesCollection: {
                  items: [
                    { sys: { id: 'ro-1' }, title: 'Article One' },
                    { sys: { id: 'ro-2' }, title: 'Article Two' },
                  ],
                },
              },
              {
                relatedArticlesCollection: {
                  items: [
                    { sys: { id: 'ro-2' }, title: 'Article Two' },
                    { sys: { id: 'ro-3' }, title: 'Article Three' },
                  ],
                },
              },
            ],
          },
        },
      });

      const result = await dataProvider.fetchArticlesForAim('aim-1');

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        id: 'ro-1',
        title: 'Article One',
        href: '/shared-research/ro-1',
      });
      expect(result[1]).toEqual({
        id: 'ro-2',
        title: 'Article Two',
        href: '/shared-research/ro-2',
      });
      expect(result[2]).toEqual({
        id: 'ro-3',
        title: 'Article Three',
        href: '/shared-research/ro-3',
      });
    });

    it('returns empty array when aim has no milestones', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        aims: {
          milestonesCollection: { items: [] },
        },
      });

      const result =
        await dataProvider.fetchArticlesForAim('aim-no-milestones');

      expect(result).toEqual([]);
    });

    it('returns empty array when aim is null', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        aims: null,
      });

      const result = await dataProvider.fetchArticlesForAim('unknown-aim');

      expect(result).toEqual([]);
    });

    it('skips null milestones and null articles', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        aims: {
          milestonesCollection: {
            items: [
              null,
              {
                relatedArticlesCollection: {
                  items: [
                    null,
                    { sys: { id: 'ro-1' }, title: 'Valid Article' },
                  ],
                },
              },
            ],
          },
        },
      });

      const result = await dataProvider.fetchArticlesForAim('aim-1');

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ id: 'ro-1', title: 'Valid Article' });
    });
  });

  describe('fetchProjectsWithAimsDetail', () => {
    it('returns projects with status, team members, and nested aim/milestone/article data', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projectsCollection: {
          total: 1,
          items: [
            {
              sys: { id: 'project-1' },
              status: 'Active',
              membersCollection: {
                items: [
                  {
                    projectMember: {
                      __typename: 'Teams',
                      sys: { id: 'team-1' },
                      displayName: 'Team Alpha',
                    },
                  },
                ],
              },
              originalGrantAimsCollection: {
                items: [
                  {
                    sys: {
                      id: 'aim-1',
                      firstPublishedAt: '2025-01-01T00:00:00.000Z',
                      publishedAt: '2025-06-01T00:00:00.000Z',
                    },
                    description: 'First aim',
                  },
                ],
              },
              supplementGrant: null,
            },
          ],
        },
      });

      const result = await dataProvider.fetchProjectsWithAimsDetail({
        limit: 10,
        skip: 0,
      });

      expect(result).toEqual({
        total: 1,
        items: [
          {
            sys: { id: 'project-1' },
            status: 'Active',
            membersCollection: {
              items: [
                {
                  projectMember: {
                    __typename: 'Teams',
                    sys: { id: 'team-1' },
                    displayName: 'Team Alpha',
                  },
                },
              ],
            },
            originalGrantAimsCollection: {
              items: [
                {
                  sys: {
                    id: 'aim-1',
                    firstPublishedAt: '2025-01-01T00:00:00.000Z',
                    publishedAt: '2025-06-01T00:00:00.000Z',
                  },
                  description: 'First aim',
                },
              ],
            },
            supplementGrant: null,
          },
        ],
      });
    });

    it('passes limit and skip to the query', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projectsCollection: { total: 0, items: [] },
      });

      await dataProvider.fetchProjectsWithAimsDetail({ limit: 25, skip: 50 });

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ limit: 25, skip: 50 }),
      );
    });

    it('returns empty result when Contentful returns null collection', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projectsCollection: null,
      });

      const result = await dataProvider.fetchProjectsWithAimsDetail({
        limit: 10,
        skip: 0,
      });

      expect(result).toEqual({ total: 0, items: [] });
    });
  });

  describe('fetchArticlesForAim', () => {
    it('returns deduplicated articles across milestones', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        aims: {
          milestonesCollection: {
            items: [
              {
                relatedArticlesCollection: {
                  items: [
                    { sys: { id: 'article-1' }, title: 'First Article' },
                    { sys: { id: 'article-2' }, title: 'Second Article' },
                  ],
                },
              },
              {
                relatedArticlesCollection: {
                  items: [
                    // duplicate — should be omitted
                    { sys: { id: 'article-1' }, title: 'First Article' },
                    { sys: { id: 'article-3' }, title: 'Third Article' },
                  ],
                },
              },
            ],
          },
        },
      });

      const result = await dataProvider.fetchArticlesForAim('aim-1');

      expect(result).toEqual([
        {
          id: 'article-1',
          title: 'First Article',
          href: '/shared-research/article-1',
        },
        {
          id: 'article-2',
          title: 'Second Article',
          href: '/shared-research/article-2',
        },
        {
          id: 'article-3',
          title: 'Third Article',
          href: '/shared-research/article-3',
        },
      ]);
    });

    it('passes the aim id to the query', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        aims: { milestonesCollection: { items: [] } },
      });

      await dataProvider.fetchArticlesForAim('aim-42');

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        { id: 'aim-42' },
      );
    });

    it('returns empty array when aim has no milestones collection', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        aims: null,
      });

      const result = await dataProvider.fetchArticlesForAim('aim-1');

      expect(result).toEqual([]);
    });

    it('skips milestones with no related articles collection', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        aims: {
          milestonesCollection: {
            items: [
              { relatedArticlesCollection: null },
              {
                relatedArticlesCollection: {
                  items: [{ sys: { id: 'article-1' }, title: 'Only Article' }],
                },
              },
            ],
          },
        },
      });

      const result = await dataProvider.fetchArticlesForAim('aim-1');

      expect(result).toEqual([
        {
          id: 'article-1',
          title: 'Only Article',
          href: '/shared-research/article-1',
        },
      ]);
    });

    it('uses empty string for article title when title is null', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        aims: {
          milestonesCollection: {
            items: [
              {
                relatedArticlesCollection: {
                  items: [{ sys: { id: 'article-1' }, title: null }],
                },
              },
            ],
          },
        },
      });

      const result = await dataProvider.fetchArticlesForAim('aim-1');

      expect(result).toEqual([
        { id: 'article-1', title: '', href: '/shared-research/article-1' },
      ]);
    });
  });

  describe('fetchArticlesForMilestone', () => {
    it('returns empty array when milestone has no articles collection', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        milestones: null,
      });

      const result =
        await dataProvider.fetchArticlesForMilestone('milestone-1');

      expect(result).toEqual([]);
    });

    it('uses empty string for article title when title is null', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        milestones: {
          relatedArticlesCollection: {
            items: [{ sys: { id: 'article-1' }, title: null }],
          },
        },
      });

      const result =
        await dataProvider.fetchArticlesForMilestone('milestone-1');

      expect(result).toEqual([
        { id: 'article-1', title: '', href: '/shared-research/article-1' },
      ]);
    });
  });

  describe('fetchAimIdsLinkedToMilestone', () => {
    it('returns aim ids linked to a milestone', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        milestones: {
          linkedFrom: {
            aimsCollection: {
              items: [{ sys: { id: 'aim-1' } }, { sys: { id: 'aim-2' } }],
            },
          },
        },
      });

      const result =
        await dataProvider.fetchAimIdsLinkedToMilestone('milestone-1');

      expect(result).toEqual(['aim-1', 'aim-2']);
    });

    it('filters out null items', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        milestones: {
          linkedFrom: {
            aimsCollection: {
              items: [null, { sys: { id: 'aim-1' } }, null],
            },
          },
        },
      });

      const result =
        await dataProvider.fetchAimIdsLinkedToMilestone('milestone-1');

      expect(result).toEqual(['aim-1']);
    });

    it('returns empty array when milestone not found', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        milestones: null,
      });

      const result =
        await dataProvider.fetchAimIdsLinkedToMilestone('milestone-missing');

      expect(result).toEqual([]);
    });
  });

  describe('fetchProjectWithAimsDetailByAimId', () => {
    it('returns the direct project linked to an aim', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        aims: {
          linkedFrom: {
            projectsCollection: {
              items: [
                {
                  sys: { id: 'project-1' },
                  title: 'Project Alpha',
                },
              ],
            },
            supplementGrantCollection: { items: [] },
          },
        },
      });

      const result =
        await dataProvider.fetchProjectWithAimsDetailByAimId('aim-1');

      expect(result).toEqual({
        sys: { id: 'project-1' },
        title: 'Project Alpha',
      });
    });

    it('returns project via supplement grant when no direct project', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        aims: {
          linkedFrom: {
            projectsCollection: { items: [null] },
            supplementGrantCollection: {
              items: [
                {
                  linkedFrom: {
                    projectsCollection: {
                      items: [
                        {
                          sys: { id: 'project-2' },
                          title: 'Project Beta',
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      });

      const result =
        await dataProvider.fetchProjectWithAimsDetailByAimId('aim-1');

      expect(result).toEqual({
        sys: { id: 'project-2' },
        title: 'Project Beta',
      });
    });

    it('returns null when aim not found', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        aims: null,
      });

      const result =
        await dataProvider.fetchProjectWithAimsDetailByAimId('aim-missing');

      expect(result).toBeNull();
    });
  });

  describe('fetchAimWithMilestonesById', () => {
    it('returns the aim with its milestones', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        aims: {
          sys: { id: 'aim-1' },
          milestonesCollection: {
            items: [{ sys: { id: 'ms-1' } }, { sys: { id: 'ms-2' } }],
          },
        },
      });

      const result = await dataProvider.fetchAimWithMilestonesById('aim-1');

      expect(result).toEqual({
        sys: { id: 'aim-1' },
        milestonesCollection: {
          items: [{ sys: { id: 'ms-1' } }, { sys: { id: 'ms-2' } }],
        },
      });
    });

    it('returns null when aim not found', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        aims: null,
      });

      const result =
        await dataProvider.fetchAimWithMilestonesById('aim-missing');

      expect(result).toBeNull();
    });
  });

  describe('fetchMilestoneById', () => {
    it('returns the milestone', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        milestones: {
          sys: { id: 'ms-1' },
          description: 'Test milestone',
          status: 'Completed',
        },
      });

      const result = await dataProvider.fetchMilestoneById('ms-1');

      expect(result).toEqual({
        sys: { id: 'ms-1' },
        description: 'Test milestone',
        status: 'Completed',
      });
    });

    it('returns null when milestone not found', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        milestones: null,
      });

      const result = await dataProvider.fetchMilestoneById('ms-missing');

      expect(result).toBeNull();
    });
  });

  describe('fetchProjectWithAimsDetailById', () => {
    it('returns the project with aims detail', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projects: {
          sys: { id: 'project-1' },
          title: 'Project Alpha',
          originalGrantAimsCollection: {
            items: [{ sys: { id: 'aim-1' }, description: 'First aim' }],
          },
        },
      });

      const result =
        await dataProvider.fetchProjectWithAimsDetailById('project-1');

      expect(result).toEqual({
        sys: { id: 'project-1' },
        title: 'Project Alpha',
        originalGrantAimsCollection: {
          items: [{ sys: { id: 'aim-1' }, description: 'First aim' }],
        },
      });
    });

    it('returns null when project not found', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projects: null,
      });

      const result =
        await dataProvider.fetchProjectWithAimsDetailById('project-missing');

      expect(result).toBeNull();
    });
  });

  describe('fetchProjectIdByMembershipId', () => {
    it('returns the project id linked to a membership', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projectMembership: {
          linkedFrom: {
            projectsCollection: {
              items: [{ sys: { id: 'project-1' } }],
            },
          },
        },
      });

      const result =
        await dataProvider.fetchProjectIdByMembershipId('membership-1');

      expect(result).toBe('project-1');
    });

    it('returns null when membership not found', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projectMembership: null,
      });

      const result =
        await dataProvider.fetchProjectIdByMembershipId('membership-missing');

      expect(result).toBeNull();
    });

    it('returns null when no projects linked to membership', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        projectMembership: {
          linkedFrom: {
            projectsCollection: {
              items: [],
            },
          },
        },
      });

      const result =
        await dataProvider.fetchProjectIdByMembershipId('membership-1');

      expect(result).toBeNull();
    });
  });

  describe('fetchProjectIdBySupplementGrantId', () => {
    it('returns the project id linked to a supplement grant', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        supplementGrant: {
          linkedFrom: {
            projectsCollection: {
              items: [{ sys: { id: 'project-1' } }],
            },
          },
        },
      });

      const result =
        await dataProvider.fetchProjectIdBySupplementGrantId('sg-1');

      expect(result).toBe('project-1');
    });

    it('returns null when supplement grant not found', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        supplementGrant: null,
      });

      const result =
        await dataProvider.fetchProjectIdBySupplementGrantId('sg-missing');

      expect(result).toBeNull();
    });

    it('returns null when no projects linked to supplement grant', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        supplementGrant: {
          linkedFrom: {
            projectsCollection: {
              items: [],
            },
          },
        },
      });

      const result =
        await dataProvider.fetchProjectIdBySupplementGrantId('sg-1');

      expect(result).toBeNull();
    });
  });
});

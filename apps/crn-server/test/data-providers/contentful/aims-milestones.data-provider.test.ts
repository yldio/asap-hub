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
                items: [
                  { doi: '10.1000/abc123' },
                  { doi: '10.1000/def456' },
                ],
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
});

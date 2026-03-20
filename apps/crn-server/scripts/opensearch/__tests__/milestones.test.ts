/* eslint-disable @typescript-eslint/no-explicit-any */

jest.mock('@asap-hub/contentful', () => {
  const actual = jest.requireActual('@asap-hub/contentful');
  return {
    ...actual,
    getGraphQLClient: jest.fn(),
  };
});

jest.mock('../../../src/config', () => ({
  contentfulAccessToken: 'test-token',
  contentfulEnvId: 'test-env',
  contentfulSpaceId: 'test-space',
}));

import { getGraphQLClient } from '@asap-hub/contentful';
import { exportMilestonesData } from '../milestones';

const mockRequest = jest.fn();

const mockGetGraphQLClient = getGraphQLClient as jest.MockedFunction<
  typeof getGraphQLClient
>;

const projectsFixture = {
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
};

const aimsFixture = {
  aimsCollection: {
    total: 2,
    items: [
      {
        sys: { id: 'aim-1' },
        milestonesCollection: {
          items: [{ sys: { id: 'milestone-1' } }],
        },
      },
      {
        sys: { id: 'aim-2' },
        milestonesCollection: {
          items: [{ sys: { id: 'milestone-1' } }],
        },
      },
    ],
  },
};

const milestonesFixture = {
  milestonesCollection: {
    total: 1,
    items: [
      {
        sys: {
          id: 'milestone-1',
          firstPublishedAt: '2025-01-01T00:00:00.000Z',
          publishedAt: '2025-02-01T00:00:00.000Z',
        },
        description: 'First milestone',
        status: 'In Progress',
        relatedArticlesCollection: {
          total: 3,
          items: [
            { doi: '10.1000/xyz123' },
            { doi: '10.1000/xyz456' },
            // Duplicate DOI — should be deduplicated
            { doi: '10.1000/xyz123' },
          ],
        },
      },
    ],
  },
};

const makeDefaultMock = () => (query: any) => {
  const body = query?.loc?.source?.body ?? '';
  if (body.includes('projectsCollection'))
    return Promise.resolve(projectsFixture);
  if (body.includes('aimsCollection')) return Promise.resolve(aimsFixture);
  if (body.includes('milestonesCollection'))
    return Promise.resolve(milestonesFixture);
  return Promise.reject(new Error(`Unexpected query: ${body}`));
};

describe('exportMilestonesData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.mockImplementation(makeDefaultMock());
    mockGetGraphQLClient.mockReturnValue({
      request: mockRequest,
    } as any);
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('builds milestone documents with aim numbers, article count, and DOIs', async () => {
    const result = await exportMilestonesData();

    expect(result).toHaveLength(1);

    expect(result[0]).toMatchObject({
      id: 'milestone-1',
      description: 'First milestone',
      status: 'In Progress',
      articleCount: 3,
      createdDate: '2025-01-01T00:00:00.000Z',
      lastDate: '2025-02-01T00:00:00.000Z',
      aimNumbersAsc: '1,2',
      aimNumbersDesc: '2,1',
      articlesDOI: '10.1000/xyz123,10.1000/xyz456',
    });
  });

  it('deduplicates DOIs within a milestone', async () => {
    const result = await exportMilestonesData();
    // fixture has xyz123 twice — deduplicated to two unique DOIs
    expect(result[0]!.articlesDOI.split(',').sort()).toEqual(
      ['10.1000/xyz123', '10.1000/xyz456'].sort(),
    );
  });

  it('produces empty aimNumbersAsc and aimNumbersDesc when milestone has no linked aims', async () => {
    mockRequest.mockImplementation((query: any) => {
      const body = query?.loc?.source?.body ?? '';
      if (body.includes('projectsCollection'))
        return Promise.resolve(projectsFixture);
      if (body.includes('aimsCollection'))
        return Promise.resolve({
          aimsCollection: { total: 0, items: [] },
        });
      if (body.includes('milestonesCollection'))
        return Promise.resolve(milestonesFixture);
      return Promise.reject(new Error(`Unexpected query: ${body}`));
    });

    const result = await exportMilestonesData();

    expect(result).toHaveLength(1);
    expect(result[0]!.aimNumbersAsc).toBe('');
    expect(result[0]!.aimNumbersDesc).toBe('');
  });

  it('warns when the aim order map is empty', async () => {
    mockRequest.mockImplementation((query: any) => {
      const body = query?.loc?.source?.body ?? '';
      if (body.includes('projectsCollection'))
        return Promise.resolve({
          projectsCollection: { total: 0, items: [] },
        });
      if (body.includes('aimsCollection'))
        return Promise.resolve({
          aimsCollection: { total: 0, items: [] },
        });
      if (body.includes('milestonesCollection'))
        return Promise.resolve(milestonesFixture);
      return Promise.reject(new Error(`Unexpected query: ${body}`));
    });

    await exportMilestonesData();

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('Aim order map is empty'),
    );
  });

  it('trims whitespace from description and falls back to empty string when null', async () => {
    mockRequest.mockImplementation((query: any) => {
      const body = query?.loc?.source?.body ?? '';
      if (body.includes('projectsCollection'))
        return Promise.resolve(projectsFixture);
      if (body.includes('aimsCollection')) return Promise.resolve(aimsFixture);
      if (body.includes('milestonesCollection'))
        return Promise.resolve({
          milestonesCollection: {
            total: 2,
            items: [
              {
                sys: {
                  id: 'milestone-padded',
                  firstPublishedAt: null,
                  publishedAt: null,
                },
                description: '  padded description  ',
                status: 'Active',
                relatedArticlesCollection: { total: 0, items: [] },
              },
              {
                sys: {
                  id: 'milestone-null-desc',
                  firstPublishedAt: null,
                  publishedAt: null,
                },
                description: null,
                status: 'Active',
                relatedArticlesCollection: { total: 0, items: [] },
              },
            ],
          },
        });
      return Promise.reject(new Error(`Unexpected query: ${body}`));
    });

    const result = await exportMilestonesData();

    expect(result.find((d) => d.id === 'milestone-padded')!.description).toBe(
      'padded description',
    );
    expect(
      result.find((d) => d.id === 'milestone-null-desc')!.description,
    ).toBe('');
  });
});

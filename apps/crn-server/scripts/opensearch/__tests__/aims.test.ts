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
import { exportAimsData } from '../aims';

const mockRequest = jest.fn();

const mockGetGraphQLClient = getGraphQLClient as jest.MockedFunction<
  typeof getGraphQLClient
>;

// Query 1: project + aim metadata (no milestones nesting)
const projectsDetailFixture = {
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
              description: 'First original aim',
            },
            {
              sys: {
                id: 'aim-2',
                firstPublishedAt: '2025-02-01T00:00:00.000Z',
                publishedAt: '2025-07-01T00:00:00.000Z',
              },
              description: 'Second original aim',
            },
          ],
        },
        supplementGrant: {
          aimsCollection: {
            items: [
              {
                sys: {
                  id: 'aim-3',
                  firstPublishedAt: '2025-03-01T00:00:00.000Z',
                  publishedAt: '2025-08-01T00:00:00.000Z',
                },
                description: 'Supplement aim',
              },
            ],
          },
        },
      },
    ],
  },
};

// Query 2: aims → milestone IDs (FetchAimsWithMilestones)
const aimsWithMilestonesFixture = {
  aimsCollection: {
    total: 3,
    items: [
      {
        sys: { id: 'aim-1' },
        milestonesCollection: {
          items: [{ sys: { id: 'ms-1' } }, { sys: { id: 'ms-2' } }],
        },
      },
      {
        sys: { id: 'aim-2' },
        milestonesCollection: {
          items: [{ sys: { id: 'ms-3' } }],
        },
      },
      {
        sys: { id: 'aim-3' },
        milestonesCollection: {
          items: [{ sys: { id: 'ms-4' } }],
        },
      },
    ],
  },
};

// Query 3: milestones → article data (FetchMilestones)
const milestonesFixture = {
  milestonesCollection: {
    total: 4,
    items: [
      {
        sys: { id: 'ms-1', firstPublishedAt: null, publishedAt: null },
        description: 'Milestone 1',
        status: 'Active',
        relatedArticlesCollection: {
          total: 2,
          items: [{ doi: '10.1000/abc' }, { doi: '10.1000/def' }],
        },
      },
      {
        sys: { id: 'ms-2', firstPublishedAt: null, publishedAt: null },
        description: 'Milestone 2',
        status: 'Active',
        relatedArticlesCollection: {
          total: 1,
          // Duplicate DOI — should be deduplicated at aim level
          items: [{ doi: '10.1000/abc' }],
        },
      },
      {
        sys: { id: 'ms-3', firstPublishedAt: null, publishedAt: null },
        description: 'Milestone 3',
        status: 'Active',
        relatedArticlesCollection: {
          total: 0,
          items: [],
        },
      },
      {
        sys: { id: 'ms-4', firstPublishedAt: null, publishedAt: null },
        description: 'Milestone 4',
        status: 'Active',
        relatedArticlesCollection: {
          total: 1,
          items: [{ doi: '10.1000/xyz' }],
        },
      },
    ],
  },
};

const makeDefaultMock = () => (query: any) => {
  const body = query?.loc?.source?.body ?? '';
  if (body.includes('projectsCollection'))
    return Promise.resolve(projectsDetailFixture);
  if (body.includes('FetchAimsWithMilestones'))
    return Promise.resolve(aimsWithMilestonesFixture);
  if (body.includes('milestonesCollection'))
    return Promise.resolve(milestonesFixture);
  return Promise.reject(new Error(`Unexpected query: ${body}`));
};

describe('exportAimsData', () => {
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

  it('produces one document per aim across original and supplement collections', async () => {
    const result = await exportAimsData();
    expect(result).toHaveLength(3);
  });

  it('correctly sets grantType for original aims', async () => {
    const result = await exportAimsData();
    const originalAims = result.filter((d) => d.grantType === 'original');
    expect(originalAims).toHaveLength(2);
    expect(originalAims.map((d) => d.id)).toEqual(['aim-1', 'aim-2']);
  });

  it('correctly sets grantType for supplement aims', async () => {
    const result = await exportAimsData();
    const supplementAims = result.filter((d) => d.grantType === 'supplement');
    expect(supplementAims).toHaveLength(1);
    expect(supplementAims[0]!.id).toBe('aim-3');
  });

  it('derives teamName from the first Teams-typed member', async () => {
    const result = await exportAimsData();
    result.forEach((doc) => {
      expect(doc.teamName).toBe('Team Alpha');
    });
  });

  it('sets status from the parent project', async () => {
    const result = await exportAimsData();
    result.forEach((doc) => {
      expect(doc.status).toBe('Active');
    });
  });

  it('sums articleCount across all linked milestones', async () => {
    const result = await exportAimsData();
    const aim1 = result.find((d) => d.id === 'aim-1')!;
    // ms-1 has 2 articles + ms-2 has 1 article = 3
    expect(aim1.articleCount).toBe(3);
  });

  it('deduplicates articlesDOI across all linked milestones', async () => {
    const result = await exportAimsData();
    const aim1 = result.find((d) => d.id === 'aim-1')!;
    // '10.1000/abc' appears in ms-1 and ms-2 but should be deduplicated
    expect(aim1.articlesDOI.split(',').sort()).toEqual(
      ['10.1000/abc', '10.1000/def'].sort(),
    );
  });

  it('stores empty articlesDOI when no milestones have articles', async () => {
    const result = await exportAimsData();
    const aim2 = result.find((d) => d.id === 'aim-2')!;
    expect(aim2.articleCount).toBe(0);
    expect(aim2.articlesDOI).toBe('');
  });

  it('maps sys dates to createdDate and lastDate', async () => {
    const result = await exportAimsData();
    expect(result[0]).toMatchObject({
      id: 'aim-1',
      description: 'First original aim',
      grantType: 'original',
      projectId: 'project-1',
      teamName: 'Team Alpha',
      status: 'Active',
      articleCount: 3,
      createdDate: '2025-01-01T00:00:00.000Z',
      lastDate: '2025-06-01T00:00:00.000Z',
    });
  });

  it('warns and skips aims with missing description', async () => {
    mockRequest.mockImplementation((query: any) => {
      const body = query?.loc?.source?.body ?? '';
      if (body.includes('projectsCollection')) {
        return Promise.resolve({
          projectsCollection: {
            total: 1,
            items: [
              {
                sys: { id: 'project-2' },
                status: 'Active',
                membersCollection: { items: [] },
                originalGrantAimsCollection: {
                  items: [
                    {
                      sys: {
                        id: 'aim-no-desc',
                        firstPublishedAt: null,
                        publishedAt: null,
                      },
                      description: null,
                    },
                  ],
                },
                supplementGrant: null,
              },
            ],
          },
        });
      }
      if (body.includes('FetchAimsWithMilestones')) {
        return Promise.resolve({
          aimsCollection: { total: 0, items: [] },
        });
      }
      if (body.includes('milestonesCollection')) {
        return Promise.resolve({
          milestonesCollection: { total: 0, items: [] },
        });
      }
      return Promise.reject(new Error(`Unexpected query: ${body}`));
    });

    const result = await exportAimsData();

    expect(result).toHaveLength(0);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('aim-no-desc'),
    );
  });

  it('uses empty string for teamName when no Teams member exists', async () => {
    mockRequest.mockImplementation((query: any) => {
      const body = query?.loc?.source?.body ?? '';
      if (body.includes('projectsCollection')) {
        return Promise.resolve({
          projectsCollection: {
            total: 1,
            items: [
              {
                sys: { id: 'project-3' },
                status: 'Active',
                membersCollection: {
                  items: [
                    {
                      projectMember: {
                        __typename: 'Users',
                        sys: { id: 'user-1' },
                        displayName: null,
                      },
                    },
                  ],
                },
                originalGrantAimsCollection: {
                  items: [
                    {
                      sys: {
                        id: 'aim-4',
                        firstPublishedAt: null,
                        publishedAt: null,
                      },
                      description: 'Aim without team',
                    },
                  ],
                },
                supplementGrant: null,
              },
            ],
          },
        });
      }
      if (body.includes('FetchAimsWithMilestones')) {
        return Promise.resolve({
          aimsCollection: {
            total: 1,
            items: [
              {
                sys: { id: 'aim-4' },
                milestonesCollection: { items: [] },
              },
            ],
          },
        });
      }
      if (body.includes('milestonesCollection')) {
        return Promise.resolve({
          milestonesCollection: { total: 0, items: [] },
        });
      }
      return Promise.reject(new Error(`Unexpected query: ${body}`));
    });

    const result = await exportAimsData();

    expect(result).toHaveLength(1);
    expect(result[0]!.teamName).toBe('');
  });
});

// Fixtures shared by aims and milestones OpenSearch script tests.

// Aims test fixtures

export const aimsProjectsDetailFixture = {
  projectsCollection: {
    total: 1,
    items: [
      {
        sys: { id: 'project-1' },
        title: 'Project Alpha',
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

export const aimsWithMilestonesFixture = {
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

export const aimsMilestonesFixture = {
  milestonesCollection: {
    total: 4,
    items: [
      {
        sys: { id: 'ms-1', firstPublishedAt: null, publishedAt: null },
        description: 'Milestone 1',
        // aim-1 links to ms-1 (In Progress) + ms-2 (Complete) → 'In Progress'
        status: 'In Progress',
        relatedArticlesCollection: {
          total: 2,
          items: [
            { sys: { id: 'article-1' }, doi: '10.1000/abc' },
            { sys: { id: 'article-2' }, doi: '10.1000/def' },
          ],
        },
      },
      {
        sys: { id: 'ms-2', firstPublishedAt: null, publishedAt: null },
        description: 'Milestone 2',
        status: 'Complete',
        relatedArticlesCollection: {
          total: 1,
          items: [{ sys: { id: 'article-1' }, doi: '10.1000/abc' }],
        },
      },
      {
        sys: { id: 'ms-3', firstPublishedAt: null, publishedAt: null },
        description: 'Milestone 3',
        // aim-2 links to ms-3 (Complete) → 'Complete'
        status: 'Complete',
        relatedArticlesCollection: {
          total: 0,
          items: [],
        },
      },
      {
        sys: { id: 'ms-4', firstPublishedAt: null, publishedAt: null },
        description: 'Milestone 4',
        // aim-3 links to ms-4 (Pending) → 'Pending'
        status: 'Pending',
        relatedArticlesCollection: {
          total: 1,
          items: [{ sys: { id: 'article-3' }, doi: '10.1000/xyz' }],
        },
      },
    ],
  },
};

// ---------------------------------------------------------------------------

// Milestones test fixtures

export const milestonesProjectsFixture = {
  projectsCollection: {
    total: 1,
    items: [
      {
        sys: { id: 'project-1' },
        title: 'Project Alpha',
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

export const milestonesAimsFixture = {
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

export const milestonesFixture = {
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

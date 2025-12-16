import { mockConsoleError } from '@asap-hub/dom-test-utils';
import {
  performanceByDocumentType,
  userProductivityPerformance,
  userCollaborationPerformance,
  teamCollaborationPerformance,
} from '@asap-hub/fixtures';
import { enable, disable } from '@asap-hub/flags';
import { EngagementPerformance } from '@asap-hub/model';
import { analytics } from '@asap-hub/routing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import {
  getTeamCollaboration,
  getTeamCollaborationPerformance,
  getUserCollaboration,
  getUserCollaborationPerformance,
} from '../collaboration/api';
import { getEngagement, getEngagementPerformance } from '../engagement/api';
import {
  getAnalyticsLeadership,
  getAnalyticsOSChampion,
} from '../leadership/api';
import {
  getTeamProductivity,
  getTeamProductivityPerformance,
  getUserProductivity,
  getUserProductivityPerformance,
} from '../productivity/api';
import Analytics from '../Routes';

jest.mock('../leadership/api');
jest.mock('../productivity/api');
jest.mock('../collaboration/api');
jest.mock('../engagement/api');
jest.mock('../open-science/api', () => ({
  getPreprintCompliance: jest.fn().mockResolvedValue({ items: [], total: 0 }),
  getPublicationCompliance: jest
    .fn()
    .mockResolvedValue({ items: [], total: 0 }),
}));

mockConsoleError();
afterEach(() => {
  jest.clearAllMocks();
});

const mockGetAnalyticsLeadership =
  getAnalyticsLeadership as jest.MockedFunction<typeof getAnalyticsLeadership>;

const mockGetAnalyticsOSChampion =
  getAnalyticsOSChampion as jest.MockedFunction<typeof getAnalyticsOSChampion>;

const mockGetTeamProductivity = getTeamProductivity as jest.MockedFunction<
  typeof getTeamProductivity
>;

const mockGetTeamProductivityPerformance =
  getTeamProductivityPerformance as jest.MockedFunction<
    typeof getTeamProductivityPerformance
  >;

const mockGetUserProductivity = getUserProductivity as jest.MockedFunction<
  typeof getUserProductivity
>;
const mockGetUserProductivityPerformance =
  getUserProductivityPerformance as jest.MockedFunction<
    typeof getUserProductivityPerformance
  >;

const mockGetUserCollaboration = getUserCollaboration as jest.MockedFunction<
  typeof getUserCollaboration
>;

const mockGetUserCollaborationPerformance =
  getUserCollaborationPerformance as jest.MockedFunction<
    typeof getUserCollaborationPerformance
  >;

const mockGetTeamCollaboration = getTeamCollaboration as jest.MockedFunction<
  typeof getTeamCollaboration
>;

const mockGetTeamCollaborationPerformance =
  getTeamCollaborationPerformance as jest.MockedFunction<
    typeof getTeamCollaborationPerformance
  >;

const mockGetEngagement = getEngagement as jest.MockedFunction<
  typeof getEngagement
>;

const mockGetEngagementPerformance =
  getEngagementPerformance as jest.MockedFunction<
    typeof getEngagementPerformance
  >;

mockGetUserCollaborationPerformance.mockResolvedValue(
  userCollaborationPerformance,
);
mockGetTeamCollaborationPerformance.mockResolvedValue(
  teamCollaborationPerformance,
);

const metric = {
  belowAverageMin: 1,
  belowAverageMax: 1,
  averageMin: 1,
  averageMax: 1,
  aboveAverageMin: 1,
  aboveAverageMax: 1,
};

const engagementPerformance: EngagementPerformance = {
  events: metric,
  totalSpeakers: metric,
  uniqueAllRoles: metric,
  uniqueKeyPersonnel: metric,
};
mockGetEngagementPerformance.mockResolvedValue({
  ...engagementPerformance,
});

mockGetTeamProductivityPerformance.mockResolvedValue(performanceByDocumentType);
mockGetUserProductivityPerformance.mockResolvedValue(
  userProductivityPerformance,
);

const renderPage = async (path: string) => {
  const { container } = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname: path }]}>
              <Routes>
                <Route
                  path={analytics.template + '/*'}
                  element={<Analytics />}
                />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

  return container;
};

describe('Analytics page', () => {
  it('renders the Analytics Page successfully', async () => {
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'user' }).$,
    );
    expect(
      await screen.findByText(/Analytics/i, {
        selector: 'h1',
      }),
    ).toBeVisible();
  });

  it('renders the export modal when user clicks on the export button', async () => {
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'user' }).$,
    );

    expect(screen.queryByText(/Select data range/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Select metrics to download/i),
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: /Multiple XLSX/i }),
    );

    expect(screen.getByText(/Select data range/i)).toBeVisible();
    expect(screen.getByText(/Select metrics to download/i)).toBeVisible();
  });

  it('user can dismiss export modal when they click on cancel button', async () => {
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'user' }).$,
    );

    await userEvent.click(
      screen.getByRole('button', { name: /Multiple XLSX/i }),
    );

    expect(screen.getByText(/Select data range/i)).toBeVisible();
    expect(screen.getByText(/Select metrics to download/i)).toBeVisible();

    await userEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    expect(screen.queryByText(/Select data range/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Select metrics to download/i),
    ).not.toBeInTheDocument();
  });

  it('redirects to user productivity page when flag is true', async () => {
    mockGetTeamProductivity.mockResolvedValue({ items: [], total: 0 });
    mockGetUserProductivity.mockResolvedValue({ items: [], total: 0 });

    await renderPage(analytics({}).$);

    expect(
      await screen.findByText(/User Productivity/i, {
        selector: 'h3',
      }),
    ).toBeVisible();
  });
});

describe('Productivity', () => {
  it('renders the productivity tab', async () => {
    mockGetTeamProductivity.mockResolvedValue({ items: [], total: 0 });
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'team' }).$,
    );
    expect(
      await screen.findByText(/Analytics/i, {
        selector: 'h1',
      }),
    ).toBeVisible();
  });

  it('renders error message when the team response is not a 2XX', async () => {
    mockGetTeamProductivity.mockRejectedValueOnce(new Error('Failed to fetch'));

    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'team' }).$,
    );
    await waitFor(() => {
      expect(mockGetTeamProductivity).toHaveBeenCalled();
    });

    expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  });

  it('renders error message when the team performance response is not a 2XX', async () => {
    mockGetTeamProductivityPerformance.mockRejectedValueOnce(
      new Error('Failed to fetch'),
    );

    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'team' }).$,
    );
    await waitFor(() => {
      expect(mockGetTeamProductivityPerformance).toHaveBeenCalled();
    });

    expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  });

  it('renders error message when user response is not a 2XX', async () => {
    mockGetUserProductivity.mockRejectedValueOnce(new Error('Failed to fetch'));

    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'user' }).$,
    );

    await waitFor(() => {
      expect(mockGetUserProductivity).toHaveBeenCalled();
    });

    expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  });

  it('renders error message when the user performance response is not a 2XX', async () => {
    mockGetUserProductivityPerformance.mockRejectedValueOnce(
      new Error('Failed to fetch'),
    );

    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'user' }).$,
    );

    await waitFor(() => {
      expect(mockGetUserProductivityPerformance).toHaveBeenCalled();
    });

    expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  });
});

describe('Leadership & Membership', () => {
  it('renders the Analytics Page successfully', async () => {
    mockGetAnalyticsLeadership.mockResolvedValueOnce({ items: [], total: 0 });

    await renderPage(
      analytics({}).leadership({}).metric({ metric: 'interest-group' }).$,
    );
    expect(
      await screen.findByText(/Analytics/i, {
        selector: 'h1',
      }),
    ).toBeVisible();
  });

  it('renders error message when team leadership response is not a 2XX', async () => {
    mockGetAnalyticsLeadership.mockRejectedValueOnce(
      new Error('Failed to fetch'),
    );
    await renderPage(
      analytics({}).leadership({}).metric({ metric: 'interest-group' }).$,
    );

    await waitFor(() => {
      expect(mockGetAnalyticsLeadership).toHaveBeenCalled();
    });

    expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  });

  it('renders error message when os champion response is not a 2XX', async () => {
    enable('ANALYTICS_PHASE_TWO');
    mockGetAnalyticsOSChampion.mockRejectedValue(new Error('Failed to fetch'));
    await renderPage(
      analytics({}).leadership({}).metric({ metric: 'os-champion' }).$,
    );

    await waitFor(() => {
      expect(mockGetAnalyticsOSChampion).toHaveBeenCalled();
    });

    expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  });
});

describe('Collaboration', () => {
  it('renders the Collaboration tab', async () => {
    await renderPage(
      analytics({})
        .collaboration({})
        .collaborationPath({ metric: 'user', type: 'within-team' }).$,
    );
    expect(
      await screen.findByText(/Analytics/i, {
        selector: 'h1',
      }),
    ).toBeVisible();
  });

  it('renders error message when the user response is not a 2XX', async () => {
    mockGetUserCollaboration.mockRejectedValueOnce(
      new Error('Failed to fetch'),
    );
    await renderPage(
      analytics({})
        .collaboration({})
        .collaborationPath({ metric: 'user', type: 'within-team' }).$,
    );

    await waitFor(() => {
      expect(mockGetUserCollaboration).toHaveBeenCalled();
    });

    expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  });

  it('renders error message when the team response is not a 2XX', async () => {
    mockGetUserCollaboration.mockResolvedValueOnce({ items: [], total: 0 });
    mockGetTeamCollaboration.mockRejectedValueOnce(
      new Error('Failed to fetch'),
    );
    await renderPage(
      analytics({})
        .collaboration({})
        .collaborationPath({ metric: 'team', type: 'within-team' }).$,
    );

    await waitFor(() => {
      expect(mockGetTeamCollaboration).toHaveBeenCalled();
    });

    expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  });
});

describe('Engagement', () => {
  it('renders the Engagement tab', async () => {
    await renderPage(analytics({}).engagement({}).$);
    expect(
      await screen.findByText(/Analytics/i, {
        selector: 'h1',
      }),
    ).toBeVisible();
  });

  it('renders error message when the engagement response is not a 2XX', async () => {
    mockGetEngagement.mockRejectedValueOnce(new Error('Failed to fetch'));

    await renderPage(analytics({}).engagement({}).$);

    await waitFor(() => {
      expect(mockGetEngagement).toHaveBeenCalled();
    });

    expect(await screen.findByText(/Something went wrong/i)).toBeVisible();
  });
});

describe('Open Science', () => {
  beforeEach(() => {
    enable('ANALYTICS_PHASE_TWO');
  });

  it('does not render the Open Science tab when the flag is disabled', async () => {
    disable('ANALYTICS_PHASE_TWO');
    mockGetTeamProductivity.mockResolvedValue({ items: [], total: 0 });
    mockGetUserProductivity.mockResolvedValue({ items: [], total: 0 });

    await renderPage(
      analytics({}).openScience({}).metric({ metric: 'preprint-compliance' }).$,
    );
    expect(
      await screen.findByText(/Analytics/i, {
        selector: 'h1',
      }),
    ).toBeVisible();
    expect(
      screen.queryByText(/Preprint Compliance/i, {
        selector: 'h3',
      }),
    ).not.toBeInTheDocument();

    expect(
      await screen.findByText(/User Productivity/i, {
        selector: 'h3',
      }),
    ).toBeVisible();
  });

  it('renders the Open Science tab successfully', async () => {
    await renderPage(
      analytics({}).openScience({}).metric({ metric: 'preprint-compliance' }).$,
    );
    expect(
      await screen.findByText(/Analytics/i, {
        selector: 'h1',
      }),
    ).toBeVisible();
    expect(
      await screen.findByText(/Preprint Compliance/i, {
        selector: 'h3',
      }),
    ).toBeVisible();
  });

  it('renders Publication Compliance when metric is selected', async () => {
    await renderPage(
      analytics({}).openScience({}).metric({ metric: 'publication-compliance' })
        .$,
    );
    expect(
      await screen.findByText(/Publication Compliance/i, {
        selector: 'h3',
      }),
    ).toBeVisible();
  });

  it('redirects to preprint-compliance when no metric is specified', async () => {
    await renderPage(analytics({}).openScience({}).$);
    expect(
      await screen.findByText(/Preprint Compliance/i, {
        selector: 'h3',
      }),
    ).toBeVisible();
  });
});

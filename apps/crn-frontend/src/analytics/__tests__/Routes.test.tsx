import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { disable, enable } from '@asap-hub/flags';
import {
  performanceByDocumentType,
  userProductivityPerformance,
  userCollaborationPerformance,
  teamCollaborationPerformance,
} from '@asap-hub/fixtures';
import { analyticsRoutes } from '@asap-hub/routing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
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
import { getEngagement } from '../engagement/api';
import { getAnalyticsLeadership } from '../leadership/api';
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

mockConsoleError();
afterEach(() => {
  jest.clearAllMocks();
});

const mockGetAnalyticsLeadership =
  getAnalyticsLeadership as jest.MockedFunction<typeof getAnalyticsLeadership>;

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

mockGetUserCollaborationPerformance.mockResolvedValue(
  userCollaborationPerformance,
);
mockGetTeamCollaborationPerformance.mockResolvedValue(
  teamCollaborationPerformance,
);

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
                  path={analyticsRoutes.DEFAULT.path}
                  element={<Analytics />}
                ></Route>
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
      analyticsRoutes.DEFAULT.PRODUCTIVITY.METRIC.buildPath({ metric: 'user' }),
    );
    expect(
      await screen.findByText(/Analytics/i, {
        selector: 'h1',
      }),
    ).toBeVisible();
  });

  it('redirects to user productivity page when flag is true', async () => {
    enable('DISPLAY_ANALYTICS_BETA');
    mockGetTeamProductivity.mockResolvedValue({ items: [], total: 0 });
    mockGetUserProductivity.mockResolvedValue({ items: [], total: 0 });

    await renderPage(analyticsRoutes.DEFAULT.buildPath({}));

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
      analyticsRoutes.DEFAULT.PRODUCTIVITY.METRIC.buildPath({ metric: 'team' }),
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
      analyticsRoutes.DEFAULT.PRODUCTIVITY.METRIC.buildPath({ metric: 'team' }),
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
      analyticsRoutes.DEFAULT.PRODUCTIVITY.METRIC.buildPath({ metric: 'team' }),
    );
    await waitFor(() => {
      expect(mockGetTeamProductivityPerformance).toHaveBeenCalled();
    });

    expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  });

  it('renders error message when user response is not a 2XX', async () => {
    mockGetUserProductivity.mockRejectedValueOnce(new Error('Failed to fetch'));

    await renderPage(
      analyticsRoutes.DEFAULT.PRODUCTIVITY.METRIC.buildPath({ metric: 'user' }),
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
      analyticsRoutes.DEFAULT.PRODUCTIVITY.METRIC.buildPath({ metric: 'user' }),
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
      analyticsRoutes.DEFAULT.LEADERSHIP.METRIC.buildPath({
        metric: 'interest-group',
      }),
    );
    expect(
      await screen.findByText(/Analytics/i, {
        selector: 'h1',
      }),
    ).toBeVisible();
  });

  it('renders error message when the response is not a 2XX', async () => {
    mockGetAnalyticsLeadership.mockRejectedValueOnce(
      new Error('Failed to fetch'),
    );
    await renderPage(
      analyticsRoutes.DEFAULT.LEADERSHIP.METRIC.buildPath({
        metric: 'interest-group',
      }),
    );

    await waitFor(() => {
      expect(mockGetAnalyticsLeadership).toHaveBeenCalled();
    });

    expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  });
});

describe('Collaboration', () => {
  beforeEach(() => {
    enable('DISPLAY_ANALYTICS_BETA');
  });
  it('renders the Collaboration tab', async () => {
    await renderPage(
      analyticsRoutes.DEFAULT.COLLABORATION.METRIC.buildPath({
        metric: 'user',
        type: 'within-team',
      }),
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
      analyticsRoutes.DEFAULT.COLLABORATION.METRIC.buildPath({
        metric: 'user',
        type: 'within-team',
      }),
    );

    await waitFor(() => {
      expect(mockGetUserCollaboration).toHaveBeenCalled();
    });

    expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  });

  it('renders error message when the team response is not a 2XX', async () => {
    mockGetTeamCollaboration.mockRejectedValueOnce(
      new Error('Failed to fetch'),
    );
    await renderPage(
      analyticsRoutes.DEFAULT.COLLABORATION.METRIC.buildPath({
        metric: 'team',
        type: 'within-team',
      }),
    );

    await waitFor(() => {
      expect(mockGetTeamCollaboration).toHaveBeenCalled();
    });

    expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  });
});

describe('Engagement', () => {
  it('renders the Engagement tab', async () => {
    await renderPage(analyticsRoutes.DEFAULT.ENGAGEMENT.buildPath({}));
    expect(
      await screen.findByText(/Analytics/i, {
        selector: 'h1',
      }),
    ).toBeVisible();
  });

  it('renders error message when the engagement response is not a 2XX', async () => {
    mockGetEngagement.mockRejectedValueOnce(new Error('Failed to fetch'));

    await renderPage(analyticsRoutes.DEFAULT.ENGAGEMENT.buildPath({}));

    await waitFor(() => {
      expect(mockGetEngagement).toHaveBeenCalled();
    });

    expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  });
});

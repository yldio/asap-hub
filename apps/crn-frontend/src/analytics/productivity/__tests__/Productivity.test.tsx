import {
  AlgoliaSearchClient,
  AnalyticsSearchOptionsWithFiltering,
} from '@asap-hub/algolia';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { createCsvFileStream } from '@asap-hub/frontend-utils';
import {
  performanceByDocumentType,
  userProductivityPerformance,
} from '@asap-hub/fixtures';
import {
  SortTeamProductivity,
  DocumentCategoryOption,
  SortUserProductivity,
  TeamProductivityAlgoliaResponse,
  UserProductivityAlgoliaResponse,
} from '@asap-hub/model';
import { analytics } from '@asap-hub/routing';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { useAnalyticsAlgolia } from '../../../hooks/algolia';
import {
  getTeamProductivity,
  getTeamProductivityPerformance,
  getUserProductivity,
  getUserProductivityPerformance,
} from '../api';
import Productivity from '../Productivity';

jest.mock('@asap-hub/frontend-utils', () => {
  const original = jest.requireActual('@asap-hub/frontend-utils');
  return {
    ...original,
    createCsvFileStream: jest
      .fn()
      .mockImplementation(() => ({ write: jest.fn(), end: jest.fn() })),
  };
});

jest.mock('../api');

jest.mock('../../../hooks/algolia', () => ({
  useAnalyticsAlgolia: jest.fn(),
}));

const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
>;

mockConsoleError();

afterEach(() => {
  jest.clearAllMocks();
});

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

mockGetTeamProductivityPerformance.mockResolvedValue(performanceByDocumentType);
mockGetUserProductivityPerformance.mockResolvedValue(
  userProductivityPerformance,
);

const mockSearchForTagValues = jest.fn() as jest.MockedFunction<
  AlgoliaSearchClient<'analytics'>['searchForTagValues']
>;

const mockUseAnalyticsAlgolia = useAnalyticsAlgolia as jest.MockedFunction<
  typeof useAnalyticsAlgolia
>;

beforeEach(() => {
  const mockAlgoliaClient = {
    searchForTagValues: mockSearchForTagValues,
  };

  mockUseAnalyticsAlgolia.mockReturnValue({
    client: mockAlgoliaClient as unknown as AlgoliaSearchClient<'analytics'>,
  });
  mockGetUserProductivity.mockResolvedValue({ items: [], total: 0 });
  mockGetTeamProductivity.mockResolvedValue({ items: [], total: 0 });
});

const defaultUserOptions: AnalyticsSearchOptionsWithFiltering<SortUserProductivity> =
  {
    pageSize: 10,
    currentPage: 0,
    timeRange: '30d',
    sort: 'team_asc',
    tags: [],
  };
const defaultTeamOptions: AnalyticsSearchOptionsWithFiltering<SortTeamProductivity> =
  {
    pageSize: 10,
    currentPage: 0,
    timeRange: '30d',
    sort: 'team_asc',
    tags: [],
  };

const userProductivityResponse: UserProductivityAlgoliaResponse = {
  id: '1',
  objectID: '1-user-productivity-30d-all',
  name: 'Test User',
  isAlumni: false,
  teams: [
    {
      id: '1',
      team: 'Team A',
      isTeamInactive: false,
      isUserInactiveOnTeam: false,
      role: 'Collaborating PI',
    },
  ],
  asapOutput: 200,
  asapPublicOutput: 100,
  ratio: '0.50',
};

const teamProductivityResponse: TeamProductivityAlgoliaResponse = {
  id: '1',
  objectID: '1-team-productivity-30d',
  name: 'Team Alessi',
  isInactive: false,
  Article: 50,
  Bioinformatics: 0,
  Dataset: 0,
  'Lab Resource': 0,
  Protocol: 0,
};

const renderPage = async (path: string) => {
  const result = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[path]}>
              <Route path="/analytics/productivity/:metric">
                <Productivity />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );

  return result;
};

describe('user productivity', () => {
  const userOptions = {
    ...defaultUserOptions,
    documentCategory: 'all' as DocumentCategoryOption,
    sort: 'user_asc' as SortUserProductivity,
  };
  it('renders with user data', async () => {
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'user' }).$,
    );
    expect(screen.getAllByText('User Productivity').length).toBe(2);
  });

  it('renders data for different time ranges', async () => {
    when(mockGetUserProductivity)
      .calledWith(expect.anything(), userOptions)
      .mockResolvedValue({ items: [userProductivityResponse], total: 1 });
    when(mockGetUserProductivity)
      .calledWith(expect.anything(), { ...userOptions, timeRange: '90d' })
      .mockResolvedValue({
        items: [
          {
            ...userProductivityResponse,
            objectID: '1-user-productivity-90d-all',
            asapOutput: 600,
          },
        ],
        total: 1,
      });
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'user' }).$,
    );

    expect(screen.getByText('200')).toBeVisible();
    expect(screen.queryByText('600')).not.toBeInTheDocument();

    const rangeButton = screen.getByRole('button', {
      name: /last 30 days chevron down/i,
    });
    userEvent.click(rangeButton);
    userEvent.click(screen.getByText(/Last 90 days/));
    await waitFor(() =>
      expect(screen.getAllByText('User Productivity')).toHaveLength(2),
    );

    expect(screen.getByText('600')).toBeVisible();
    expect(screen.queryByText('200')).not.toBeInTheDocument();

    userEvent.click(rangeButton);
    userEvent.click(screen.getByText(/Last 30 days/));
    await waitFor(() =>
      expect(screen.getAllByText('User Productivity')).toHaveLength(2),
    );

    expect(screen.getByText('200')).toBeVisible();
    expect(screen.queryByText('600')).not.toBeInTheDocument();
  });

  it('renders data for different document categories', async () => {
    when(mockGetUserProductivity)
      .calledWith(expect.anything(), userOptions)
      .mockResolvedValue({ items: [userProductivityResponse], total: 1 });
    when(mockGetUserProductivity)
      .calledWith(expect.anything(), {
        ...userOptions,
        documentCategory: 'article',
      })
      .mockResolvedValue({
        items: [
          {
            ...userProductivityResponse,
            objectID: '1-user-productivity-30d-article',
            asapOutput: 50,
          },
        ],
        total: 1,
      });
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'user' }).$,
    );

    expect(screen.getByText('200')).toBeVisible();
    expect(screen.queryByText('50')).not.toBeInTheDocument();

    const categoryButton = screen.getByRole('button', {
      name: /all chevron down/i,
    });
    userEvent.click(categoryButton);
    userEvent.click(screen.getByText(/Article/));
    await waitFor(() =>
      expect(screen.getAllByText('User Productivity')).toHaveLength(2),
    );

    expect(screen.getByText('50')).toBeVisible();
    expect(screen.queryByText('200')).not.toBeInTheDocument();

    userEvent.click(categoryButton);
    userEvent.click(screen.getByText(/All/));
    await waitFor(() =>
      expect(screen.getAllByText('User Productivity')).toHaveLength(2),
    );

    expect(screen.getByText('200')).toBeVisible();
    expect(screen.queryByText('50')).not.toBeInTheDocument();
  });

  it('calls algolia client with the right index name', async () => {
    const { getByTitle } = await renderPage(
      analytics({}).productivity({}).metric({ metric: 'user' }).$,
    );

    await waitFor(() => {
      expect(mockUseAnalyticsAlgolia).toHaveBeenLastCalledWith(
        expect.not.stringContaining('user_desc'),
      );
    });
    userEvent.click(getByTitle('User Active Alphabetical Ascending Sort Icon'));
    await waitFor(() => {
      expect(mockUseAnalyticsAlgolia).toHaveBeenLastCalledWith(
        expect.stringContaining('user_desc'),
      );
    });
  });
});

describe('team productivity', () => {
  it('renders with team data', async () => {
    const label = 'Team Productivity';

    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'user' }).$,
    );
    const input = screen.getAllByRole('textbox', { hidden: false })[0]!;
    userEvent.click(input);
    userEvent.click(screen.getByText(label));

    expect(screen.getAllByText(label).length).toBe(2);
  });

  it('renders data for different time ranges', async () => {
    when(mockGetTeamProductivity)
      .calledWith(expect.anything(), {
        ...defaultTeamOptions,
        outputType: 'all',
      })
      .mockResolvedValue({ items: [teamProductivityResponse], total: 1 });
    when(mockGetTeamProductivity)
      .calledWith(expect.anything(), {
        ...defaultTeamOptions,
        timeRange: '90d',
        outputType: 'all',
      })
      .mockResolvedValue({
        items: [
          {
            ...teamProductivityResponse,
            objectID: '1-team-productivity-90d',
            Article: 60,
          },
        ],
        total: 1,
      });
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'team' }).$,
    );

    expect(screen.getByText('50')).toBeVisible();
    expect(screen.queryByText('60')).not.toBeInTheDocument();

    const rangeButton = screen.getByRole('button', {
      name: /last 30 days chevron down/i,
    });
    userEvent.click(rangeButton);
    userEvent.click(screen.getByText(/Last 90 days/));
    await waitFor(() =>
      expect(screen.getAllByText('Team Productivity')).toHaveLength(2),
    );

    expect(screen.getByText('60')).toBeVisible();
    expect(screen.queryByText('50')).not.toBeInTheDocument();

    userEvent.click(rangeButton);
    userEvent.click(screen.getByText(/Last 30 days/));
    await waitFor(() =>
      expect(screen.getAllByText('Team Productivity')).toHaveLength(2),
    );

    expect(screen.getByText('50')).toBeVisible();
    expect(screen.queryByText('60')).not.toBeInTheDocument();
  });

  it('renders data for different output types', async () => {
    when(mockGetTeamProductivity)
      .calledWith(expect.anything(), {
        ...defaultTeamOptions,
        outputType: 'all',
      })
      .mockResolvedValue({ items: [teamProductivityResponse], total: 1 });
    when(mockGetTeamProductivity)
      .calledWith(expect.anything(), {
        ...defaultTeamOptions,
        outputType: 'public',
      })
      .mockResolvedValue({
        items: [
          {
            ...teamProductivityResponse,
            objectID: '1-team-productivity-public',
            Article: 60,
          },
        ],
        total: 1,
      });
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'team' }).$,
    );

    expect(screen.getByText('50')).toBeVisible();
    expect(screen.queryByText('60')).not.toBeInTheDocument();

    const outputTypeButton = screen.getByRole('button', {
      name: /ASAP Output chevron down/i,
    });
    userEvent.click(outputTypeButton);
    userEvent.click(screen.getByText(/ASAP Public Output/i));
    await waitFor(() =>
      expect(screen.getAllByText('Team Productivity')).toHaveLength(2),
    );

    expect(screen.getByText('60')).toBeVisible();
    expect(screen.queryByText('50')).not.toBeInTheDocument();

    userEvent.click(outputTypeButton);
    userEvent.click(screen.getByText(/ASAP Output/));
    await waitFor(() =>
      expect(screen.getAllByText('Team Productivity')).toHaveLength(2),
    );

    expect(screen.getByText('50')).toBeVisible();
    expect(screen.queryByText('60')).not.toBeInTheDocument();
  });

  it('calls algolia client with the right index name', async () => {
    const { getByTitle } = await renderPage(
      analytics({}).productivity({}).metric({ metric: 'team' }).$,
    );

    await waitFor(() => {
      expect(mockUseAnalyticsAlgolia).toHaveBeenLastCalledWith(
        expect.not.stringContaining('team_desc'),
      );
    });
    userEvent.click(getByTitle('Active Alphabetical Ascending Sort Icon'));
    await waitFor(() => {
      expect(mockUseAnalyticsAlgolia).toHaveBeenLastCalledWith(
        expect.stringContaining('team_desc'),
      );
    });
  });
});

describe('search', () => {
  const getSearchBox = () => {
    const searchContainer = screen.getByRole('search') as HTMLElement;
    return within(searchContainer).getByRole('textbox') as HTMLInputElement;
  };
  it('allows typing in search queries', async () => {
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'team' }).$,
    );
    const searchBox = getSearchBox();

    userEvent.type(searchBox, 'test123');
    expect(searchBox.value).toEqual('test123');
    await waitFor(() =>
      expect(mockSearchForTagValues).toHaveBeenCalledWith(
        ['team-productivity'],
        'test123',
        {},
      ),
    );
  });
});

describe('csv export', () => {
  it('exports analytics for user', async () => {
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'user' }).$,
    );
    userEvent.click(screen.getByText(/csv/i));
    expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
      expect.stringMatching(/productivity_user_\d+\.csv/),
      expect.anything(),
    );
  });

  it('exports analytics for teams', async () => {
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'team' }).$,
    );
    const input = screen.getAllByRole('textbox', { hidden: false })[0];

    input && userEvent.click(input);
    userEvent.click(screen.getByText(/csv/i));
    expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
      expect.stringMatching(/productivity_team_\d+\.csv/),
      expect.anything(),
    );
  });
});

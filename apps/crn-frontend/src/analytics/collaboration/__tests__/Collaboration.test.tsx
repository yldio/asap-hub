import { mockConsoleError } from '@asap-hub/dom-test-utils';
import {
  teamCollaborationPerformance,
  userCollaborationPerformance,
} from '@asap-hub/fixtures';
import {
  ListTeamCollaborationAlgoliaResponse,
  ListUserCollaborationAlgoliaResponse,
} from '@asap-hub/model';
import { analytics } from '@asap-hub/routing';
import { render, screen, waitFor } from '@testing-library/react';
import { when } from 'jest-when';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { AnalyticsSearchOptionsWithFiltering } from '@asap-hub/algolia';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import {
  getUserCollaboration,
  getTeamCollaboration,
  getTeamCollaborationPerformance,
  getUserCollaborationPerformance,
} from '../api';
import Collaboration from '../Collaboration';

jest.mock('../api');
mockConsoleError();

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetUserCollaboration = getUserCollaboration as jest.MockedFunction<
  typeof getUserCollaboration
>;
const mockGetTeamCollaboration = getTeamCollaboration as jest.MockedFunction<
  typeof getTeamCollaboration
>;

const mockGetTeamCollaborationPerformance =
  getTeamCollaborationPerformance as jest.MockedFunction<
    typeof getTeamCollaborationPerformance
  >;
mockGetTeamCollaborationPerformance.mockResolvedValue(
  teamCollaborationPerformance,
);

const mockGetUserCollaborationPerformance =
  getUserCollaborationPerformance as jest.MockedFunction<
    typeof getUserCollaborationPerformance
  >;
mockGetUserCollaborationPerformance.mockResolvedValue(
  userCollaborationPerformance,
);

const userData: ListUserCollaborationAlgoliaResponse = {
  total: 2,
  items: [
    {
      id: '1',
      isAlumni: false,
      name: 'User',
      teams: [
        {
          id: '1',
          team: 'Team A',
          role: 'Key Personnel',
          isTeamInactive: false,
          outputsCoAuthoredWithinTeam: 300,
          outputsCoAuthoredAcrossTeams: 400,
        },
      ],
      objectID: '1',
    },
    {
      id: '2',
      isAlumni: false,
      name: 'User',
      teams: [
        {
          id: '1',
          team: 'Team A',
          role: 'Key Personnel',
          isTeamInactive: true,
          outputsCoAuthoredWithinTeam: 2,
          outputsCoAuthoredAcrossTeams: 3,
        },
      ],
      objectID: '2',
    },
  ],
};

const teamData: ListTeamCollaborationAlgoliaResponse = {
  total: 1,
  items: [
    {
      id: '1',
      isInactive: false,
      name: 'Team 1',
      outputsCoProducedWithin: {
        Article: 100,
        Bioinformatics: 0,
        Dataset: 0,
        'Lab Resource': 0,
        Protocol: 1,
      },
      outputsCoProducedAcross: {
        byDocumentType: {
          Article: 1,
          Bioinformatics: 0,
          Dataset: 0,
          'Lab Resource': 0,
          Protocol: 1,
        },
        byTeam: [
          {
            id: '2',
            name: 'Team 2',
            isInactive: false,
            Article: 1,
            Bioinformatics: 0,
            Dataset: 0,
            'Lab Resource': 0,
            Protocol: 1,
          },
        ],
      },
      objectID: '1',
    },
  ],
};

const renderPage = async (metric: string = 'user') => {
  const path = analytics({})
    .collaboration({})
    .collaborationPath({ metric, type: 'within-team' }).$;
  const result = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[path]}>
              <Route path="/analytics/collaboration/:metric/:type">
                <Collaboration />
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

describe('user collaboration', () => {
  it('renders with user data', async () => {
    mockGetUserCollaboration.mockResolvedValue(userData);
    await renderPage();

    expect(screen.getByText('User Co-Production')).toBeVisible();
    expect(screen.queryByText('Team Co-Production')).not.toBeInTheDocument();

    expect(screen.getByText('Co-Production Within Team by User')).toBeVisible();
    expect(
      screen.queryByText('Co-Production Across Teams by User'),
    ).not.toBeInTheDocument();

    const input = screen.getAllByRole('textbox', { hidden: false });

    userEvent.click(input[1]!);
    userEvent.click(screen.getByText('Across Teams'));

    expect(
      screen.getByText('Co-Production Across Teams by User'),
    ).toBeVisible();
    expect(
      screen.queryByText('Co-Production Within Team by User'),
    ).not.toBeInTheDocument();
  });

  it('renders data for different document categories', async () => {
    const defaultUserOptions: AnalyticsSearchOptionsWithFiltering = {
      sort: '',
      pageSize: 10,
      currentPage: 0,
      timeRange: '30d',
      documentCategory: 'all',
      tags: [],
    };

    when(mockGetUserCollaboration)
      .calledWith(expect.anything(), defaultUserOptions)
      .mockResolvedValue(userData);
    when(mockGetUserCollaboration)
      .calledWith(expect.anything(), {
        ...defaultUserOptions,
        documentCategory: 'article',
      })
      .mockResolvedValue({
        items: [
          {
            ...userData.items[0]!,
            objectID: '1-user-collaboration-30d-article',
            teams: [
              {
                ...userData.items[0]!.teams[0]!,
                outputsCoAuthoredWithinTeam: 100,
              },
            ],
          },
        ],
        total: 1,
      });
    await renderPage();

    expect(screen.getByText('300')).toBeVisible();
    expect(screen.queryByText('100')).not.toBeInTheDocument();

    const categoryButton = screen.getByRole('button', {
      name: /all chevron down/i,
    });
    userEvent.click(categoryButton);
    userEvent.click(screen.getByText(/Article/));
    await waitFor(() =>
      expect(screen.getAllByText(/Co-Production/)).toHaveLength(2),
    );

    expect(screen.getByText('100')).toBeVisible();
    expect(screen.queryByText('300')).not.toBeInTheDocument();
  });
});

describe('team collaboration', () => {
  it('renders with team data', async () => {
    mockGetTeamCollaboration.mockResolvedValue(teamData);
    await renderPage('team');

    expect(screen.getByText('Team Co-Production')).toBeVisible();
    expect(screen.queryByText('User Co-Production')).not.toBeInTheDocument();

    expect(
      screen.getByText('Co-Production Within Teams by Team'),
    ).toBeVisible();
    expect(
      screen.queryByText('Co-Production Across Teams by Team'),
    ).not.toBeInTheDocument();

    const input = screen.getAllByRole('textbox', { hidden: false });

    userEvent.click(input[1]!);
    userEvent.click(screen.getByText('Across Teams'));

    expect(
      screen.getByText('Co-Production Across Teams by Team'),
    ).toBeVisible();
    expect(
      screen.queryByText('Co-Production Within Teams by Team'),
    ).not.toBeInTheDocument();
  });

  it('renders data for different output types', async () => {
    const defaultTeamOptions: AnalyticsSearchOptionsWithFiltering = {
      pageSize: 10,
      currentPage: 0,
      timeRange: '30d',
      outputType: 'all',
      sort: '',
      tags: [],
    };
    when(mockGetTeamCollaboration)
      .calledWith(expect.anything(), {
        ...defaultTeamOptions,
        outputType: 'all',
      })
      .mockResolvedValue(teamData);
    when(mockGetTeamCollaboration)
      .calledWith(expect.anything(), {
        ...defaultTeamOptions,
        outputType: 'public',
      })
      .mockResolvedValue({
        items: [
          {
            ...teamData.items[0]!,
            objectID: '1-team-collaboration-30d-public',
            outputsCoProducedWithin: {
              Article: 50,
              Bioinformatics: 0,
              Dataset: 0,
              'Lab Resource': 0,
              Protocol: 1,
            },
          },
        ],
        total: 1,
      });
    await renderPage('team');

    expect(screen.getByText('100')).toBeVisible();
    expect(screen.queryByText('50')).not.toBeInTheDocument();

    const outputTypeButton = screen.getByRole('button', {
      name: /ASAP Output chevron down/i,
    });
    userEvent.click(outputTypeButton);
    userEvent.click(screen.getByText(/ASAP Public Output/i));
    await waitFor(() =>
      expect(screen.getAllByText(/Co-Production/)).toHaveLength(2),
    );

    expect(screen.getByText('50')).toBeVisible();
    expect(screen.queryByText('100')).not.toBeInTheDocument();
  });
});

it('navigates between user and team collaboration pages', async () => {
  mockGetUserCollaboration.mockResolvedValue(userData);
  mockGetTeamCollaboration.mockResolvedValue(teamData);

  await renderPage();
  const input = screen.getAllByRole('textbox', { hidden: false });

  userEvent.click(input[0]!);
  userEvent.click(screen.getByText('Team Co-Production'));

  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  expect(screen.getByText('Team Co-Production')).toBeVisible();
  expect(screen.queryByText('User Co-Production')).not.toBeInTheDocument();
});

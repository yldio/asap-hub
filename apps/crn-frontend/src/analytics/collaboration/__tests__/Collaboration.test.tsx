import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { teamCollaborationPerformance } from '@asap-hub/fixtures';
import {
  ListTeamCollaborationAlgoliaResponse,
  ListUserCollaborationAlgoliaResponse,
} from '@asap-hub/model';
import { analytics } from '@asap-hub/routing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import {
  getUserCollaboration,
  getTeamCollaboration,
  getTeamCollaborationPerformance,
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
          outputsCoAuthoredWithinTeam: 1,
          outputsCoAuthoredAcrossTeams: 2,
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
        Article: 1,
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

  expect(screen.getByText('Co-Production Across Teams by User')).toBeVisible();
  expect(
    screen.queryByText('Co-Production Within Team by User'),
  ).not.toBeInTheDocument();
});

it('renders with team data', async () => {
  mockGetTeamCollaboration.mockResolvedValue(teamData);
  await renderPage('team');

  expect(screen.getByText('Team Co-Production')).toBeVisible();
  expect(screen.queryByText('User Co-Production')).not.toBeInTheDocument();

  expect(screen.getByText('Co-Production Within Teams by Team')).toBeVisible();
  expect(
    screen.queryByText('Co-Production Across Teams by Team'),
  ).not.toBeInTheDocument();

  const input = screen.getAllByRole('textbox', { hidden: false });

  userEvent.click(input[1]!);
  userEvent.click(screen.getByText('Across Teams'));

  expect(screen.getByText('Co-Production Across Teams by Team')).toBeVisible();
  expect(
    screen.queryByText('Co-Production Within Teams by Team'),
  ).not.toBeInTheDocument();
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

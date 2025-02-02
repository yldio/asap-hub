import { ReactNode, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { StaticRouter } from 'react-router-dom';
import { createInterestGroupResponse } from '@asap-hub/fixtures';
import { render, waitFor } from '@testing-library/react';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { ErrorBoundary } from '@asap-hub/frontend-utils';

import { Auth0Provider, WhenReady } from '../../../../auth/test-utils';

import { getTeamInterestGroups } from '../api';
import InterestGroupsCard from '../InterestGroupsCard';
import { teamInterestGroupsState } from '../state';

jest.mock('../api');
const mockGetTeamInterestGroups = getTeamInterestGroups as jest.MockedFunction<
  typeof getTeamInterestGroups
>;

mockConsoleError();

const id = 't42';

const renderWithWrapper = (children: ReactNode): ReturnType<typeof render> =>
  render(
    <RecoilRoot
      initializeState={({ reset }) => reset(teamInterestGroupsState(id))}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{ id: 'u42' }}>
          <WhenReady>
            <StaticRouter>{children}</StaticRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

afterEach(() => {
  mockGetTeamInterestGroups.mockClear();
});

it('requests groups for the given team id', async () => {
  renderWithWrapper(<InterestGroupsCard id={id} />);
  await waitFor(() =>
    expect(mockGetTeamInterestGroups).toHaveBeenCalledWith(
      id,
      expect.anything(),
    ),
  );
});

it('render nothing when there are no groups and the group is active', async () => {
  mockGetTeamInterestGroups.mockResolvedValue({ total: 0, items: [] });
  const { container, queryByText } = renderWithWrapper(
    <InterestGroupsCard id={id} />,
  );
  await waitFor(() => expect(container).not.toHaveTextContent(/loading/i));
  expect(queryByText(/team groups/i)).not.toBeInTheDocument();
});

it('render the team groups tabbed component when isInactive has a value', async () => {
  mockGetTeamInterestGroups.mockResolvedValue({
    total: 0,
    items: [],
  });
  const { findByText } = renderWithWrapper(
    <InterestGroupsCard id={id} isInactive={new Date().toISOString()} />,
  );
  expect(await findByText(/Team Interest Groups/i)).toBeVisible();
});

it('renders the card when there are groups', async () => {
  mockGetTeamInterestGroups.mockResolvedValue({
    total: 1,
    items: [{ ...createInterestGroupResponse() }],
  });
  const { findByText } = renderWithWrapper(<InterestGroupsCard id={id} />);
  expect(await findByText(/Team Interest Groups/i)).toBeVisible();
});

it('links to the group', async () => {
  mockGetTeamInterestGroups.mockResolvedValue({
    total: 1,
    items: [{ ...createInterestGroupResponse(), id: 'g1', name: 'Group 1' }],
  });
  const { findByText, getByText } = renderWithWrapper(
    <InterestGroupsCard id={id} />,
  );
  expect(await findByText(/Team Interest Groups/i)).toBeVisible();
  expect(getByText('Group 1').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/g1$/),
  );
});

it('throws if the team does not exist', async () => {
  mockGetTeamInterestGroups.mockResolvedValue(undefined);
  const { findByText } = renderWithWrapper(
    <ErrorBoundary>
      <InterestGroupsCard id={id} />
    </ErrorBoundary>,
  );
  expect(await findByText(/failed.+team.+exist/i)).toBeVisible();
});

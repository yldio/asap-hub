import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { analytics } from '@asap-hub/routing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getUserCollaboration } from '../api';
import Collaboration from '../Collaboration';

jest.mock('../api');
mockConsoleError();

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetUserCollaboration = getUserCollaboration as jest.MockedFunction<
  typeof getUserCollaboration
>;

const renderPage = async (
  path = analytics({})
    .collaboration({})
    .collaborationPath({ metric: 'user', type: 'within-team' }).$,
) => {
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
beforeEach(() => {
  mockGetUserCollaboration.mockResolvedValueOnce({ items: [], total: 0 });
});
it('renders with user data', async () => {
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
  await renderPage();
  const input = screen.getAllByRole('textbox', { hidden: false });

  userEvent.click(input[0]!);
  userEvent.click(screen.getByText('Team Co-Production'));

  expect(screen.getByText('Team Co-Production')).toBeVisible();
  expect(screen.queryByText('User Co-Production')).not.toBeInTheDocument();

  expect(screen.getByText('Co-Production Within Teams by Team')).toBeVisible();
  expect(
    screen.queryByText('Co-Production Across Teams by Team'),
  ).not.toBeInTheDocument();

  userEvent.click(input[1]!);
  userEvent.click(screen.getByText('Across Teams'));

  expect(screen.getByText('Co-Production Across Teams by Team')).toBeVisible();
  expect(
    screen.queryByText('Co-Production Within Teams by Team'),
  ).not.toBeInTheDocument();
});

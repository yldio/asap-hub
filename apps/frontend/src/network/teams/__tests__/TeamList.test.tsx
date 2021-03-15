import React, { Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { createListTeamResponse } from '@asap-hub/fixtures';
import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';

import Teams from '../TeamList';
import { getTeams } from '../api';
import { teamsState } from '../state';
import { DEFAULT_PAGE_SIZE } from '../../../hooks';

jest.mock('../api');

const mockGetTeams = getTeams as jest.MockedFunction<typeof getTeams>;

const renderTeamList = async () => {
  const result = render(
    <RecoilRoot
      initializeState={({ set, reset }) => {
        reset(
          teamsState({
            currentPage: 0,
            pageSize: DEFAULT_PAGE_SIZE,
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/teams']}>
              <Route path="/teams" component={Teams} />
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

it('renders a list of teams information', async () => {
  const response = createListTeamResponse(2);
  mockGetTeams.mockResolvedValue({
    ...response,
    items: response.items.map((item, index) => ({
      ...item,
      displayName: `Name Unknown ${index}`,
      projectTitle: `Project Title Unknown ${index}`,
    })),
  });

  const { container } = await renderTeamList();
  expect(container.textContent).toContain('Name Unknown 0');
  expect(container.textContent).toContain('Project Title Unknown 0');
  expect(container.textContent).toContain('Name Unknown 1');
  expect(container.textContent).toContain('Project Title Unknown 1');
});

import React from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createGroupResponse } from '@asap-hub/fixtures';

import GroupProfile from '../GroupProfile';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { refreshGroupState } from '../state';
import { getGroup } from '../api';

jest.mock('../api');

const mockGetGroup = getGroup as jest.MockedFunction<typeof getGroup>;
const renderGroupProfile = async (
  groupResponse = createGroupResponse(),
  { routeProfileId = groupResponse.id } = {},
) => {
  mockGetGroup.mockImplementation(async (id) =>
    id === groupResponse.id ? groupResponse : undefined,
  );

  const result = render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshGroupState(groupResponse.id), Math.random())
      }
    >
      <React.Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[`/${routeProfileId}/`]}>
              <Route path="/:id" component={GroupProfile} />
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </React.Suspense>
    </RecoilRoot>,
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('renders the about group information by default', async () => {
  const { findAllByText } = await renderGroupProfile(createGroupResponse());
  expect(await findAllByText(/description/i)).not.toHaveLength(0);
});

it('deep links to the teams section', async () => {
  const { findByText, container } = await renderGroupProfile(
    createGroupResponse({ teamsCount: 1 }),
  );

  const anchor = (await findByText(/1 team/i)).closest('a');
  expect(anchor).toBeVisible();
  const { hash } = new URL(anchor!.href, globalThis.location.href);

  expect(container.querySelector(hash)).toHaveTextContent(/teams/i);
});
it('generates a different deep link every time to avoid conflicts', async () => {
  const result1 = await renderGroupProfile(
    createGroupResponse({ teamsCount: 1 }),
  );
  const { href: href1 } = (await result1.findByText(/1 team/i)).closest('a')!;
  result1.unmount();

  const result2 = await renderGroupProfile(
    createGroupResponse({ teamsCount: 1 }),
  );
  const { href: href2 } = (await result2.findByText(/1 team/i)).closest('a')!;

  expect(href2).not.toEqual(href1);
});

it('switches to the calendar tab', async () => {
  const { findByText } = await renderGroupProfile(createGroupResponse());
  userEvent.click(await findByText(/^calendar/i));
  expect(await findByText(/subscribe/i, { selector: 'h3' })).toBeVisible();
});

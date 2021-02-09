import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { createListGroupResponse } from '@asap-hub/fixtures';
import { GroupResponse, ListGroupResponse } from '@asap-hub/model';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';
import nock from 'nock';

import GroupList from '../GroupList';
import { getGroups } from '../api';
import { API_BASE_URL } from '../../../config';
import { groupsState } from '../state';
import { DEFAULT_PAGE_SIZE } from '../../../hooks';

jest.mock('../api');

const mockGetGroups = getGroups as jest.MockedFunction<typeof getGroups>;

const renderGroupList = async (listGroupResponse: ListGroupResponse) => {
  mockGetGroups.mockImplementation(async () => listGroupResponse);

  const result = render(
    <RecoilRoot
      initializeState={({ reset }) =>
        reset(groupsState({ currentPage: 0, pageSize: DEFAULT_PAGE_SIZE }))
      }
    >
      <React.Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/groups/']}>
              <Route path="/groups" component={GroupList} />
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

it('renders a list of group information', async () => {
  const response = createListGroupResponse(2);
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/teams')
    .query({ take: 10, skip: 0 })
    .reply(200, {
      ...response,
      items: response.items.map(
        (item, index): GroupResponse => ({
          ...item,
          description: `Group ${index}`,
        }),
      ),
    });
  const { container } = await renderGroupList(response);
  expect(container.textContent).toContain('Group 0');
  expect(container.textContent).toContain('Group 1');
});

import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route } from 'react-router-dom';
import { Frame } from '@asap-hub/frontend-utils';
import { mockConsoleError } from '@asap-hub/dom-test-utils';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getManuscripts } from '../api';
import { manuscriptsState } from '../state';

import Compliance from '../Compliance';

jest.mock('../api');
mockConsoleError();

const mockGetManuscripts = getManuscripts as jest.MockedFunction<
  typeof getManuscripts
>;

const renderCompliancePage = async () => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          manuscriptsState({
            currentPage: 0,
            pageSize: 10,
            filters: new Set(),
            searchQuery: '',
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname: '/' }]}>
              <Route path="/">
                <Frame title={null}>
                  <Compliance />
                </Frame>
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

it('renders error message when the request is not a 2XX', async () => {
  mockGetManuscripts.mockRejectedValue(new Error('error'));

  const { getByText } = await renderCompliancePage();
  expect(mockGetManuscripts).toHaveBeenCalled();
  expect(getByText(/Something went wrong/i)).toBeVisible();
});

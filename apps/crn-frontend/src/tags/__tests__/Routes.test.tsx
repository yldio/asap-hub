import { AlgoliaSearchClient } from '@asap-hub/algolia';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { useAlgolia } from '../../hooks/algolia';
import Routes from '../Routes';

jest.mock('../../hooks/algolia');
jest.mock('../../shared-research/api');
const mockSearchForTagValues = jest.fn();
const mockSearch = jest.fn();
beforeEach(() => {
  const mockUseAlgolia = useAlgolia as jest.MockedFunction<typeof useAlgolia>;
  const mockAlgoliaClient = {
    searchForTagValues: mockSearchForTagValues,
    search: mockSearch,
  };
  mockUseAlgolia.mockReturnValue({
    client: mockAlgoliaClient as unknown as AlgoliaSearchClient<'crn'>,
  });
  mockAlgoliaClient.search.mockResolvedValue({
    hits: [],
  });
});

const renderTagsPage = async (query = '') => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname: '/', search: query }]}>
              <Routes />
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  return waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

it('allows typing in tag queries', async () => {
  await renderTagsPage();
  const searchBox = screen.getByRole('textbox') as HTMLInputElement;

  userEvent.type(searchBox, 'test123');
  expect(searchBox.value).toEqual('test123');
  await waitFor(() => {
    expect(mockSearchForTagValues).toHaveBeenCalledWith(
      ['research-output'],
      'test123',
      { tagFilters: [] },
    );
  });
});

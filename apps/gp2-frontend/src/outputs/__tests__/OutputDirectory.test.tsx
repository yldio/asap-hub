import { createCsvFileStream } from '@asap-hub/frontend-utils';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { useSearch } from '../../hooks/search';
import { createOutputListAlgoliaResponse } from '../../__fixtures__/algolia';
import { getOutputs } from '../api';
import { MAX_RESULTS } from '../export';
import OutputDirectory from '../OutputDirectory';

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
jest.mock('../../hooks/search');
const mockGetOutputs = getOutputs as jest.MockedFunction<typeof getOutputs>;
const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
>;
const mockUseSearch = useSearch as jest.MockedFunction<typeof useSearch>;

const renderOutputDirectory = async ({
  isAdministrator = false,
  filters = {},
  searchQuery = '',
}: {
  isAdministrator?: boolean;
  filters?: Partial<ReturnType<typeof useSearch>['filters']>;
  searchQuery?: string;
} = {}) => {
  mockGetOutputs.mockResolvedValue(createOutputListAlgoliaResponse(2));

  const mockUpdateFilter = jest.fn();
  const mockToggleFilter = jest.fn();
  mockUseSearch.mockImplementation(() => ({
    changeLocation: jest.fn(),
    filters,
    updateFilters: mockUpdateFilter,
    toggleFilter: mockToggleFilter,
    searchQuery,
    debouncedSearchQuery: searchQuery,
    setSearchQuery: jest.fn(),
    tags: [],
    setTags: jest.fn(),
  }));

  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider
          user={{ role: isAdministrator ? 'Administrator' : undefined }}
        >
          <WhenReady>
            <MemoryRouter initialEntries={['/outputs/']}>
              <Route path="/outputs">
                <OutputDirectory />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  return { mockUpdateFilter };
};
afterEach(jest.clearAllMocks);

it('renders the filters modal', async () => {
  await renderOutputDirectory();
  const filterButton = screen.getByText('Filters');
  expect(filterButton).toBeInTheDocument();
  userEvent.click(filterButton);
  expect(screen.getByText('TYPE OF OUTPUT')).toBeVisible();
});

it('triggers export', async () => {
  const searchQuery = 'a search query';

  const documentTypeFilter = ['Article' as const];
  const filters = { documentType: documentTypeFilter };
  const filterSet = new Set(documentTypeFilter);

  await renderOutputDirectory({ isAdministrator: true, searchQuery, filters });
  await waitFor(() =>
    expect(mockGetOutputs).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        filters: filterSet,
        searchQuery,
      }),
    ),
  );
  userEvent.click(screen.getByRole('button', { name: 'Export CSV' }));
  expect(mockCreateCsvFileStream).toHaveBeenLastCalledWith(
    expect.stringMatching(/output_export\.csv/),
    expect.anything(),
  );
  await waitFor(() =>
    expect(mockGetOutputs).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        filters: filterSet,
        searchQuery,
        currentPage: 0,
        pageSize: MAX_RESULTS,
      }),
    ),
  );
});

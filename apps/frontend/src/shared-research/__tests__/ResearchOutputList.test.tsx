import { Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import userEvent from '@testing-library/user-event';

import { createResearchOutputListAlgoliaResponse } from '../../__fixtures__/algolia';
import ResearchOutputList from '../ResearchOutputList';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getResearchOutputs } from '../api';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';
import { researchOutputsState } from '../state';
import { createCsvFileStream, MAX_ALGOLIA_RESULTS } from '../export';

jest.mock('../api');
jest.mock('../export');

const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
>;

const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
  typeof getResearchOutputs
>;

const renderResearchOutputList = async (searchQuery = '') => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          researchOutputsState({
            searchQuery,
            currentPage: 0,
            filters: new Set(),
            pageSize: CARD_VIEW_PAGE_SIZE,
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/shared-research']}>
              <Route path="/shared-research">
                <ResearchOutputList />
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
  jest.clearAllMocks();
});

it('renders a list of research outputs', async () => {
  mockGetResearchOutputs.mockResolvedValue({
    ...createResearchOutputListAlgoliaResponse(2),
    hits: createResearchOutputListAlgoliaResponse(2).hits.map((hit, index) => ({
      ...hit,
      title: `Test Output ${index}`,
    })),
  });
  const { container } = await renderResearchOutputList();
  expect(container.textContent).toContain('Test Output 0');
  expect(container.textContent).toContain('Test Output 1');
});

it('triggers and export with the same parameters', async () => {
  mockGetResearchOutputs.mockResolvedValue(
    createResearchOutputListAlgoliaResponse(2),
  );
  const { getByText } = await renderResearchOutputList('example');
  userEvent.click(getByText(/export/i));
  expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
    expect.anything(),
    expect.stringMatching(/SharedOutputs_\d+\.csv/),
  );
  expect(mockGetResearchOutputs).toHaveBeenCalledWith(expect.anything(), {
    searchQuery: '',
    filters: new Set(),
    currentPage: 0,
    pageSize: CARD_VIEW_PAGE_SIZE,
  });
  expect(mockGetResearchOutputs).toHaveBeenCalledWith(expect.anything(), {
    searchQuery: '',
    filters: new Set(),
    currentPage: 0,
    pageSize: MAX_ALGOLIA_RESULTS,
  });
});

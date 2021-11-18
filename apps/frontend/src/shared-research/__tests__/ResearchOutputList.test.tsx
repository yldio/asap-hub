import { Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  createListResearchOutputResponse,
  createAlgoliaResearchOutputResponse,
} from '@asap-hub/fixtures';
import { RecoilRoot } from 'recoil';
import { disable } from '@asap-hub/flags';
import userEvent from '@testing-library/user-event';

import ResearchOutputList from '../ResearchOutputList';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getResearchOutputsLegacy, getResearchOutputs } from '../api';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';
import { researchOutputsState } from '../state';
import { createCsvFileStream, MAX_ALGOLIA_RESULTS } from '../export';

jest.mock('../api');
jest.mock('../export');

const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
>;

const mockGetResearchOutputsLegacy =
  getResearchOutputsLegacy as jest.MockedFunction<
    typeof getResearchOutputsLegacy
  >;

const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
  typeof getResearchOutputs
>;
afterEach(() => {
  mockGetResearchOutputsLegacy
    .mockClear()
    .mockResolvedValue(createListResearchOutputResponse(1));
});

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

it('renders a list of research outputs (REGRESSION)', async () => {
  disable('ALGOLIA_RESEARCH_OUTPUTS');
  mockGetResearchOutputsLegacy.mockResolvedValue({
    ...createListResearchOutputResponse(2),
    items: createListResearchOutputResponse(2).items.map((item, index) => ({
      ...item,
      title: `Test Output ${index}`,
    })),
  });
  const { container } = await renderResearchOutputList();
  expect(container.textContent).toContain('Test Output 0');
  expect(container.textContent).toContain('Test Output 1');
});

it('renders a list of research outputs', async () => {
  mockGetResearchOutputs.mockResolvedValue({
    ...createAlgoliaResearchOutputResponse(2),
    hits: createAlgoliaResearchOutputResponse(2).hits.map((hit, index) => ({
      ...hit,
      title: `Test Output ${index}`,
    })),
  });
  const { container } = await renderResearchOutputList();
  expect(container.textContent).toContain('Test Output 0');
  expect(container.textContent).toContain('Test Output 1');
});

it('does not show export link when feature flag disabled (REGRESSION)', async () => {
  disable('ALGOLIA_RESEARCH_OUTPUTS');
  mockGetResearchOutputsLegacy.mockResolvedValue(
    createListResearchOutputResponse(2),
  );
  const { queryByText } = await renderResearchOutputList();
  expect(queryByText(/export/i)).toBeNull();
});

it('triggers and export with the same parameters', async () => {
  mockGetResearchOutputs.mockResolvedValue(
    createAlgoliaResearchOutputResponse(2),
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

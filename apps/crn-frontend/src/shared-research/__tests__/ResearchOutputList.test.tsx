import { createCsvFileStream } from '@asap-hub/frontend-utils';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';
import { createResearchOutputListAlgoliaResponse } from '../../__fixtures__/algolia';
import { getResearchOutputs } from '../api';
import { MAX_ALGOLIA_RESULTS } from '../export';
import ResearchOutputList from '../ResearchOutputList';
import { researchOutputsState } from '../state';

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
  userEvent.click(getByText(/csv/i));
  expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
    expect.stringMatching(/SharedOutputs_\d+\.csv/),
    expect.anything(),
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

it('renders an algolia tagged result list and hit', async () => {
  const listResearchOutput = createResearchOutputListAlgoliaResponse(1);

  mockGetResearchOutputs.mockResolvedValue({
    ...listResearchOutput,
    queryID: 'queryId',
    index: 'index',
    hits: listResearchOutput.hits.map((hit) => ({ ...hit, id: 'hitId' })),
  });

  const { container } = await renderResearchOutputList();
  const resultListHtml = container.querySelector('*[data-insights-index]');
  expect(resultListHtml?.getAttribute('data-insights-index')).toEqual('index');
  const hitHtml = resultListHtml?.querySelector('*[data-insights-object-id]');
  expect(hitHtml?.attributes).toMatchInlineSnapshot(`
    NamedNodeMap {
      "data-insights-object-id": "hitId",
      "data-insights-position": "1",
      "data-insights-query-id": "queryId",
    }
  `);
});

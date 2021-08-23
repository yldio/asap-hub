import { Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  createListResearchOutputResponse,
  createAlgoliaResearchOutputResponse,
} from '@asap-hub/fixtures';
import { RecoilRoot } from 'recoil';
import { disable } from '@asap-hub/flags';

import ResearchOutputList from '../ResearchOutputList';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getResearchOutputsLegacy, getResearchOutputs } from '../api';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';
import { researchOutputsState } from '../state';

jest.mock('../api');

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

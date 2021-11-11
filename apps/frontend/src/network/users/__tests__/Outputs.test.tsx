import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAlgoliaResearchOutputResponse } from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import { useFlags } from '@asap-hub/react-context';
import { renderHook } from '@testing-library/react-hooks';

import { RecoilRoot } from 'recoil';
import Outputs from '../Outputs';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getResearchOutputs } from '../../../shared-research/api';
import { researchOutputsState } from '../../../shared-research/state';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';
import {
  createCsvFileStream,
  MAX_ALGOLIA_RESULTS,
} from '../../../shared-research/export';

jest.mock('../../../shared-research/api');
jest.mock('../../../shared-research/export');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
  typeof getResearchOutputs
>;

const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
>;

const renderOutputs = async (
  searchQuery = '',
  filters = new Set<string>(),
  userId = '42',
) => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          researchOutputsState({
            searchQuery,
            filters,
            userId,
            currentPage: 0,
            pageSize: CARD_VIEW_PAGE_SIZE,
          }),
        );
        reset(
          researchOutputsState({
            searchQuery,
            filters,
            userId,
            currentPage: 0,
            pageSize: MAX_ALGOLIA_RESULTS,
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                {
                  pathname: network({}).users({}).user({ userId }).outputs({})
                    .$,
                },
              ]}
            >
              <Route
                path={network({}).users({}).user({ userId }).outputs({}).$}
              >
                <Outputs userId={userId} />
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

it('shows the coming soon text  (REGRESSION)', async () => {
  const {
    result: { current },
  } = renderHook(useFlags);
  current.disable('RESEARCH_OUTPUTS_ON_AUTHOR_PROFILE');

  const { getByText } = await renderOutputs();
  expect(getByText(/more\sto\scome/i)).toBeVisible();
});

it('renders search and filter', async () => {
  const { getByRole } = await renderOutputs();
  expect(getByRole('searchbox')).toHaveAttribute(
    'placeholder',
    'Enter a keyword, method, resource…',
  );
});

it('renders a list of research outputs', async () => {
  mockGetResearchOutputs.mockResolvedValue({
    ...createAlgoliaResearchOutputResponse(2),
    hits: createAlgoliaResearchOutputResponse(2).hits.map((hit, index) => ({
      ...hit,
      title: `Test Output ${index}`,
    })),
  });
  const { container } = await renderOutputs();
  expect(container.textContent).toContain('Test Output 0');
  expect(container.textContent).toContain('Test Output 1');
});

it('calls getResearchOutputs with the right arguments', async () => {
  const searchQuery = 'searchterm';
  const userId = '12345';
  const filters = new Set(['Proposal']);
  mockGetResearchOutputs.mockResolvedValue({
    ...createAlgoliaResearchOutputResponse(2),
  });
  const { getByRole, getByText, getByLabelText } = await renderOutputs(
    searchQuery,
    filters,
    userId,
  );
  userEvent.type(getByRole('searchbox'), searchQuery);

  userEvent.click(getByText('Filters'));
  const checkbox = getByLabelText('Proposal');
  expect(checkbox).not.toBeChecked();

  userEvent.click(checkbox);
  expect(checkbox).toBeChecked();

  await waitFor(() =>
    expect(mockGetResearchOutputs).toHaveBeenLastCalledWith(expect.anything(), {
      searchQuery,
      userId,
      filters,
      currentPage: 0,
      pageSize: CARD_VIEW_PAGE_SIZE,
    }),
  );
});

it('triggers and export with the same parameters', async () => {
  const filters = new Set(['Proposal']);
  const searchQuery = 'Some Search';
  const userId = '12345';
  mockGetResearchOutputs.mockResolvedValue({
    ...createAlgoliaResearchOutputResponse(2),
  });
  const { getByRole, getByText, getByLabelText } = await renderOutputs(
    searchQuery,
    filters,
    userId,
  );
  userEvent.type(getByRole('searchbox'), searchQuery);
  userEvent.click(getByText('Filters'));
  userEvent.click(getByLabelText('Proposal'));
  await waitFor(() =>
    expect(mockGetResearchOutputs).toHaveBeenLastCalledWith(expect.anything(), {
      searchQuery,
      filters,
      userId,
      currentPage: 0,
      pageSize: CARD_VIEW_PAGE_SIZE,
    }),
  );

  userEvent.click(getByText(/export/i));
  expect(mockCreateCsvFileStream).toHaveBeenLastCalledWith(
    expect.anything(),
    expect.stringMatching(/SharedOutputs_\d+\.csv/),
  );
  await waitFor(() =>
    expect(mockGetResearchOutputs).toHaveBeenCalledWith(expect.anything(), {
      searchQuery,
      filters,
      userId,
      currentPage: 0,
      pageSize: MAX_ALGOLIA_RESULTS,
    }),
  );
});

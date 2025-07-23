import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createUserResponse } from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import { createCsvFileStream } from '@asap-hub/frontend-utils';
import { RecoilRoot } from 'recoil';

import { createResearchOutputListAlgoliaResponse } from '../../../__fixtures__/algolia';
import Outputs from '../Outputs';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getResearchOutputs } from '../../../shared-research/api';
import { researchOutputsState } from '../../../shared-research/state';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';
import { MAX_ALGOLIA_RESULTS } from '../../../shared-research/export';
import { getUser } from '../api';
import { refreshUserState } from '../state';

jest.mock('@asap-hub/frontend-utils', () => {
  const original = jest.requireActual('@asap-hub/frontend-utils');
  return {
    ...original,
    createCsvFileStream: jest
      .fn()
      .mockImplementation(() => ({ write: jest.fn(), end: jest.fn() })),
  };
});
jest.mock('../../../shared-research/api');

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;

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
      initializeState={({ reset, set }) => {
        set(refreshUserState(userId), Math.random());
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

it('renders search and filter', async () => {
  const { getByRole } = await renderOutputs();
  expect(getByRole('searchbox')).toHaveAttribute(
    'placeholder',
    'Enter a keyword, method, resource…',
  );
});

it('renders a list of research outputs', async () => {
  mockGetResearchOutputs.mockResolvedValue({
    ...createResearchOutputListAlgoliaResponse(2),
    hits: createResearchOutputListAlgoliaResponse(2).hits.map((hit, index) => ({
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
  const filters = new Set(['Grant Document']);
  mockGetResearchOutputs.mockResolvedValue({
    ...createResearchOutputListAlgoliaResponse(2),
  });
  const { getByRole, getByText, getByLabelText } = await renderOutputs(
    searchQuery,
    filters,
    userId,
  );
  await userEvent.type(getByRole('searchbox'), searchQuery);

  await userEvent.click(getByText('Filters'));
  const checkbox = getByLabelText('Grant Document');
  expect(checkbox).not.toBeChecked();

  await userEvent.click(checkbox);
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

it('triggers export with the same parameters and custom filename', async () => {
  mockGetUser.mockResolvedValue({
    ...createUserResponse(),
    firstName: 'John',
    lastName: 'Smith',
  });
  const filters = new Set(['Grant Document']);
  const searchQuery = 'Some Search';
  const userId = '12345';
  mockGetResearchOutputs.mockResolvedValue({
    ...createResearchOutputListAlgoliaResponse(2),
  });
  const { getByRole, getByText, getByLabelText } = await renderOutputs(
    searchQuery,
    filters,
    userId,
  );
  await userEvent.type(getByRole('searchbox'), searchQuery);
  await userEvent.click(getByText('Filters'));
  await userEvent.click(getByLabelText('Grant Document'));
  await waitFor(() =>
    expect(mockGetResearchOutputs).toHaveBeenLastCalledWith(expect.anything(), {
      searchQuery,
      filters,
      userId,
      currentPage: 0,
      pageSize: CARD_VIEW_PAGE_SIZE,
    }),
  );

  await userEvent.click(getByText(/csv/i));
  expect(mockCreateCsvFileStream).toHaveBeenLastCalledWith(
    expect.stringMatching(/SharedOutputs_JohnSmith_\d+\.csv/),
    expect.anything(),
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

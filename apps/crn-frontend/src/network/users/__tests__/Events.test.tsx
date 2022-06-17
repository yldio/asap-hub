import { network } from '@asap-hub/routing';
import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { eventsState } from '../../../events/state';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';
import Events from '../Events';
import { refreshUserState } from '../state';

jest.mock('../../../events/api');
jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const date = new Date('2021-12-28T14:00:00.000Z');
beforeEach(() => {
  jest.useFakeTimers('modern').setSystemTime(date);
});
afterEach(() => {
  jest.useRealTimers();
});
const renderEvents = async (
  searchQuery = '',
  filters = new Set<string>(),
  currentPage = 0,
  pageSize = CARD_VIEW_PAGE_SIZE,
  userId = '42',
) => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset, set }) => {
        set(refreshUserState(userId), Math.random());
        reset(
          eventsState({
            after: '2021-12-28T14:00:00.000Z',
            searchQuery,
            filters,
            // userId,
            currentPage,
            pageSize,
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
                  pathname: network({}).users({}).user({ userId }).upcoming({})
                    .$,
                },
              ]}
            >
              <Route
                path={network({}).users({}).user({ userId }).upcoming({}).$}
              >
                <Events
                  userId={userId}
                  currentTime={date}
                  searchQuery={searchQuery}
                />
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

it.only('renders search and filter', async () => {
  const { getByRole } = await renderEvents();
  expect(getByRole('searchbox')).toHaveAttribute(
    'placeholder',
    'Enter a keyword, method, resource…',
  );
});

// it('renders a list of research outputs', async () => {
//   mockUserEvents.mockResolvedValue({
//     ...createResearchOutputListAlgoliaResponse(2),
//     hits: createResearchOutputListAlgoliaResponse(2).hits.map((hit, index) => ({
//       ...hit,
//       title: `Test Output ${index}`,
//     })),
//   });
//   const { container } = await renderOutputs();
//   expect(container.textContent).toContain('Test Output 0');
//   expect(container.textContent).toContain('Test Output 1');
// });

// it('calls getResearchOutputs with the right arguments', async () => {
//   const searchQuery = 'searchterm';
//   const userId = '12345';
//   const filters = new Set(['Grant Document']);
//   mockGetResearchOutputs.mockResolvedValue({
//     ...createResearchOutputListAlgoliaResponse(2),
//   });
//   const { getByRole, getByText, getByLabelText } = await renderOutputs(
//     searchQuery,
//     filters,
//     userId,
//   );
//   userEvent.type(getByRole('searchbox'), searchQuery);

//   userEvent.click(getByText('Filters'));
//   const checkbox = getByLabelText('Grant Document');
//   expect(checkbox).not.toBeChecked();

//   userEvent.click(checkbox);
//   expect(checkbox).toBeChecked();

//   await waitFor(() =>
//     expect(mockGetResearchOutputs).toHaveBeenLastCalledWith(expect.anything(), {
//       searchQuery,
//       userId,
//       filters,
//       currentPage: 0,
//       pageSize: CARD_VIEW_PAGE_SIZE,
//     }),
//   );
// });

// it('triggers export with the same parameters and custom filename', async () => {
//   mockGetUser.mockResolvedValue({
//     ...createUserResponse(),
//     firstName: 'John',
//     lastName: 'Smith',
//   });
//   const filters = new Set(['Grant Document']);
//   const searchQuery = 'Some Search';
//   const userId = '12345';
//   mockGetResearchOutputs.mockResolvedValue({
//     ...createResearchOutputListAlgoliaResponse(2),
//   });
//   const { getByRole, getByText, getByLabelText } = await renderOutputs(
//     searchQuery,
//     filters,
//     userId,
//   );
//   userEvent.type(getByRole('searchbox'), searchQuery);
//   userEvent.click(getByText('Filters'));
//   userEvent.click(getByLabelText('Grant Document'));
//   await waitFor(() =>
//     expect(mockGetResearchOutputs).toHaveBeenLastCalledWith(expect.anything(), {
//       searchQuery,
//       filters,
//       userId,
//       currentPage: 0,
//       pageSize: CARD_VIEW_PAGE_SIZE,
//     }),
//   );

//   userEvent.click(getByText(/export/i));
//   expect(mockCreateCsvFileStream).toHaveBeenLastCalledWith(
//     expect.anything(),
//     expect.stringMatching(/SharedOutputs_JohnSmith_\d+\.csv/),
//   );
//   await waitFor(() =>
//     expect(mockGetResearchOutputs).toHaveBeenCalledWith(expect.anything(), {
//       searchQuery,
//       filters,
//       userId,
//       currentPage: 0,
//       pageSize: MAX_ALGOLIA_RESULTS,
//     }),
//   );
// });

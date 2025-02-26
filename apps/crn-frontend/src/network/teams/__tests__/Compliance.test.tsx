import { createAlgoliaResponse } from '@asap-hub/algolia';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import {
  createManuscriptResponse,
  createPartialManuscriptResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { Frame } from '@asap-hub/frontend-utils';
import { PartialManuscriptResponse } from '@asap-hub/model';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getOpenScienceMembers } from '../../users/api';
import { getManuscripts, updateManuscript } from '../api';
import Compliance from '../Compliance';
import { ManuscriptToastProvider } from '../ManuscriptToastProvider';
import { manuscriptsState } from '../state';

mockConsoleError();

jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  getOpenScienceMembers: jest.fn(),
  getManuscripts: jest.fn(),
  updateManuscript: jest.fn(),
}));

jest.mock('../../users/api', () => ({
  ...jest.requireActual('../api'),
  getOpenScienceMembers: jest.fn(),
}));

const mockGetManuscripts = getManuscripts as jest.MockedFunction<
  typeof getManuscripts
>;

const mockUpdateManuscript = updateManuscript as jest.MockedFunction<
  typeof updateManuscript
>;

const mockGetOpenScienceMembers = getOpenScienceMembers as jest.MockedFunction<
  typeof getOpenScienceMembers
>;

const user = createUserResponse({}, 1);
user.role = 'Staff';
user.openScienceTeamMember = true;

const renderCompliancePage = async () => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          manuscriptsState({
            currentPage: 0,
            pageSize: 10,
            requestedAPCCoverage: 'all',
            completedStatus: 'show',
            searchQuery: '',
            selectedStatuses: [],
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname: '/' }]}>
              <ManuscriptToastProvider>
                <Route path="/">
                  <Frame title={null}>
                    <Compliance />
                  </Frame>
                </Route>
              </ManuscriptToastProvider>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitFor(() => {
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument();
  });
  return result;
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

it('renders error message when the request is not a 2XX', async () => {
  mockGetManuscripts.mockRejectedValue(new Error('error'));

  await renderCompliancePage();
  expect(mockGetManuscripts).toHaveBeenCalled();
  expect(screen.getByText(/Something went wrong/i)).toBeVisible();
});

it('updates manuscript and refreshes data when handleUpdateManuscript is called and the status is changed', async () => {
  const manuscriptId = 'manuscript-id-1';
  const mockManuscript: PartialManuscriptResponse = {
    ...createPartialManuscriptResponse(),
    manuscriptId,
    status: 'Review Compliance Report',
  };

  mockGetManuscripts.mockResolvedValue({
    items: [mockManuscript],
    total: 1,
  });

  mockUpdateManuscript.mockResolvedValue({
    ...createManuscriptResponse(),
    id: manuscriptId,
    status: 'Manuscript Resubmitted',
  });

  await renderCompliancePage();

  await waitFor(() => {
    expect(screen.getByTestId('compliance-table-row')).toBeInTheDocument();
  });

  const statusButton = within(
    screen.getByTestId('compliance-table-row'),
  ).getByRole('button', {
    name: /Review Compliance Report/i,
  });
  userEvent.click(statusButton);

  const newStatusButton = within(
    screen.getByTestId('compliance-table-row'),
  ).getByRole('button', {
    name: /Manuscript Resubmitted/i,
  });
  userEvent.click(newStatusButton);

  const confirmButton = screen.getByRole('button', {
    name: /Update status and notify/i,
  });
  await waitFor(() => userEvent.click(confirmButton));

  await waitFor(() =>
    expect(mockUpdateManuscript).toHaveBeenCalledWith(
      manuscriptId,
      {
        status: 'Manuscript Resubmitted',
      },
      expect.any(String),
    ),
  );

  expect(
    within(screen.getByTestId('compliance-table-row')).getByRole('button', {
      name: /Manuscript Resubmitted/i,
    }),
  ).toBeInTheDocument();
});

it('manuscripts remain the same when there is not a match between the manuscript ids', async () => {
  const mockManuscript: PartialManuscriptResponse = {
    ...createPartialManuscriptResponse(),
    manuscriptId: 'manuscript-id-1',
    status: 'Review Compliance Report',
  };

  mockGetManuscripts.mockResolvedValue({
    items: [mockManuscript],
    total: 1,
  });

  mockUpdateManuscript.mockResolvedValue({
    ...createManuscriptResponse(),
    id: 'manuscript-id-2',
    status: 'Manuscript Resubmitted',
  });

  await renderCompliancePage();

  await waitFor(() => {
    expect(screen.getByTestId('compliance-table-row')).toBeInTheDocument();
  });

  const statusButton = within(
    screen.getByTestId('compliance-table-row'),
  ).getByRole('button', {
    name: /Review Compliance Report/i,
  });
  userEvent.click(statusButton);

  const newStatusButton = within(
    screen.getByTestId('compliance-table-row'),
  ).getByRole('button', {
    name: /Manuscript Resubmitted/i,
  });
  userEvent.click(newStatusButton);

  const confirmButton = screen.getByRole('button', {
    name: /Update status and notify/i,
  });
  await waitFor(() => userEvent.click(confirmButton));

  await waitFor(() =>
    expect(mockUpdateManuscript).toHaveBeenCalledWith(
      'manuscript-id-1',
      {
        status: 'Manuscript Resubmitted',
      },
      expect.any(String),
    ),
  );

  expect(
    within(screen.getByTestId('compliance-table-row')).queryByRole('button', {
      name: /Manuscript Resubmitted/i,
    }),
  ).not.toBeInTheDocument();
});

it('manuscripts remain the same when getting previous manuscripts fails', async () => {
  const mockManuscript: PartialManuscriptResponse = {
    ...createPartialManuscriptResponse(),
    manuscriptId: 'manuscript-id-1',
    status: 'Review Compliance Report',
  };

  mockGetManuscripts
    .mockResolvedValueOnce({
      items: [mockManuscript],
      total: 1,
    })
    .mockRejectedValueOnce(new Error('error'));

  mockUpdateManuscript.mockResolvedValue({
    ...createManuscriptResponse(),
    id: 'manuscript-id-2',
    status: 'Manuscript Resubmitted',
  });

  await renderCompliancePage();

  await waitFor(() => {
    expect(screen.getByTestId('compliance-table-row')).toBeInTheDocument();
  });

  const statusButton = within(
    screen.getByTestId('compliance-table-row'),
  ).getByRole('button', {
    name: /Review Compliance Report/i,
  });
  userEvent.click(statusButton);

  const newStatusButton = within(
    screen.getByTestId('compliance-table-row'),
  ).getByRole('button', {
    name: /Manuscript Resubmitted/i,
  });
  userEvent.click(newStatusButton);

  const confirmButton = screen.getByRole('button', {
    name: /Update status and notify/i,
  });
  await waitFor(() => userEvent.click(confirmButton));

  await waitFor(() =>
    expect(mockUpdateManuscript).toHaveBeenCalledWith(
      'manuscript-id-1',
      {
        status: 'Manuscript Resubmitted',
      },
      expect.any(String),
    ),
  );

  expect(
    within(screen.getByTestId('compliance-table-row')).queryByRole('button', {
      name: /Manuscript Resubmitted/i,
    }),
  ).not.toBeInTheDocument();
});

it('fetches assigned users suggestions and displays them properly', async () => {
  const mockManuscript: PartialManuscriptResponse = {
    ...createPartialManuscriptResponse(),
    manuscriptId: 'manuscript-id-1',
    status: 'Review Compliance Report',
  };

  mockGetManuscripts.mockResolvedValue({
    items: [mockManuscript],
    total: 1,
  });

  const userResponse = createUserResponse();

  const algoliaUsersResponse = createAlgoliaResponse<'crn', 'user'>([
    {
      ...userResponse,
      firstName: 'Billie',
      lastName: 'Eilish',
      displayName: 'Billie Eilish',
      objectID: userResponse.id,
      __meta: { type: 'user' },
      _tags: userResponse.tags?.map(({ name }) => name) || [],
    },
  ]);
  mockGetOpenScienceMembers.mockResolvedValue({
    items: algoliaUsersResponse.hits,
    total: algoliaUsersResponse.nbHits,
  });

  await renderCompliancePage();

  await waitFor(() => {
    expect(screen.getByTestId('compliance-table-row')).toBeInTheDocument();
  });

  expect(screen.queryByText(/Billie Eilish/i)).not.toBeInTheDocument();

  userEvent.click(screen.getByTitle(/Add user/i));

  userEvent.type(
    screen.getByRole('textbox', { name: /Assign User/i }),
    'Billie',
  );

  expect(mockGetOpenScienceMembers).toHaveBeenCalled();

  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  expect(screen.getAllByText(/Billie Eilish/i).length > 0).toBe(true);
});

it('displays success message when assigning users', async () => {
  const mockManuscript: PartialManuscriptResponse = {
    ...createPartialManuscriptResponse(),
    manuscriptId: 'manuscript-id-1',
    status: 'Review Compliance Report',
    assignedUsers: [
      {
        id: 'user-id-1',
        firstName: 'Taylor',
        lastName: 'Swift',
        avatarUrl: 'https://example.com',
      },
    ],
  };

  mockGetManuscripts.mockResolvedValue({
    items: [mockManuscript],
    total: 1,
  });

  mockUpdateManuscript.mockResolvedValue({
    ...createManuscriptResponse(),
    id: 'manuscript-id-1',
  });

  mockGetOpenScienceMembers.mockResolvedValue({
    items: [],
    total: 0,
  });

  await renderCompliancePage();

  await waitFor(() => {
    expect(screen.getByTestId('compliance-table-row')).toBeInTheDocument();
  });

  userEvent.click(screen.getByLabelText(/Edit Assigned Users/i));

  userEvent.click(screen.getByRole('button', { name: 'Assign' }));

  await waitFor(() => {
    expect(
      screen.getByText('User(s) assigned to a manuscript successfully.'),
    ).toBeInTheDocument();
  });
});

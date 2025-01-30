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
import { getManuscripts, updateManuscript } from '../api';
import { manuscriptsState } from '../state';

import Compliance from '../Compliance';

mockConsoleError();

jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  getManuscripts: jest.fn(),
  updateManuscript: jest.fn(),
}));

const mockGetManuscripts = getManuscripts as jest.MockedFunction<
  typeof getManuscripts
>;

const mockUpdateManuscript = updateManuscript as jest.MockedFunction<
  typeof updateManuscript
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
            filters: new Set(),
            searchQuery: '',
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname: '/' }]}>
              <Route path="/">
                <Frame title={null}>
                  <Compliance />
                </Frame>
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

  const statusButton = within(
    screen.getByTestId('compliance-table-row'),
  ).getByRole('button', {
    name: /Review Compliance Report/i,
  });
  userEvent.click(statusButton);

  const newStatusButton = screen.getByRole('button', {
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

  const statusButton = within(
    screen.getByTestId('compliance-table-row'),
  ).getByRole('button', {
    name: /Review Compliance Report/i,
  });
  userEvent.click(statusButton);

  const newStatusButton = screen.getByRole('button', {
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

  const statusButton = within(
    screen.getByTestId('compliance-table-row'),
  ).getByRole('button', {
    name: /Review Compliance Report/i,
  });
  userEvent.click(statusButton);

  const newStatusButton = screen.getByRole('button', {
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

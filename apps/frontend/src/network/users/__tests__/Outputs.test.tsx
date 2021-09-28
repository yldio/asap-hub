import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAlgoliaResearchOutputResponse } from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import { disable } from '@asap-hub/flags';

import { RecoilRoot } from 'recoil';
import Outputs from '../Outputs';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getResearchOutputs } from '../../../shared-research/api';
import { researchOutputsState } from '../../../shared-research/state';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';

jest.mock('../../../shared-research/api');

const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
  typeof getResearchOutputs
>;

const renderOutputs = async (searchQuery = '') => {
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
            <MemoryRouter
              initialEntries={[
                {
                  pathname: network({})
                    .users({})
                    .user({ userId: '12345' })
                    .outputs({}).$,
                },
              ]}
            >
              <Route
                path={
                  network({}).users({}).user({ userId: '12345' }).outputs({}).$
                }
              >
                <Outputs userId={'12345'} />
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
  disable('RESEARCH_OUTPUTS_ON_AUTHOR_PROFILE');
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
  mockGetResearchOutputs.mockResolvedValue({
    ...createAlgoliaResearchOutputResponse(2),
  });
  const { getByRole, getByText, getByLabelText } = await renderOutputs();
  userEvent.type(getByRole('searchbox'), 'searchterm');

  userEvent.click(getByText('Filters'));
  const checkbox = getByLabelText('Proposal');
  expect(checkbox).not.toBeChecked();

  userEvent.click(checkbox);
  expect(checkbox).toBeChecked();

  await waitFor(() =>
    expect(mockGetResearchOutputs).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({
        searchQuery: 'searchterm',
        userId: '12345',
        filters: new Set(['Proposal']),
      }),
    ),
  );
});

import { Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { createListResearchOutputResponse } from '@asap-hub/fixtures';
import { RecoilRoot } from 'recoil';

import ResearchOutputList from '../ResearchOutputList';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getResearchOutputs } from '../api';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';
import { researchOutputsState } from '../state';

jest.mock('../api');

const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
  typeof getResearchOutputs
>;
afterEach(() => {
  mockGetResearchOutputs
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

it('renders a list of research outputs', async () => {
  mockGetResearchOutputs.mockResolvedValue({
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

it('correctly generates research output link', async () => {
  mockGetResearchOutputs.mockResolvedValue({
    ...createListResearchOutputResponse(2),
    items: createListResearchOutputResponse(2).items.map((item, index) => ({
      ...item,
      title: `Test Output ${index}`,
      id: `test-output-id-${index}`,
    })),
  });

  const { getByText } = await renderResearchOutputList();
  const link = getByText('Test Output 0').closest('a');
  expect(link?.href).toEqual(
    'http://localhost/shared-research/test-output-id-0',
  );
});

it('correctly generates external research output link', async () => {
  mockGetResearchOutputs.mockResolvedValue({
    ...createListResearchOutputResponse(2),
    items: createListResearchOutputResponse(2).items.map((item, index) => ({
      ...item,
      link: index === 0 ? 'https://example.com' : undefined,
      title: `Test Output ${index}`,
      id: `test-output-id-${index}`,
    })),
  });
  const { getByTitle } = await renderResearchOutputList();
  const link = getByTitle(/external\slink/i).closest('a');
  expect(link).toHaveAttribute('href', 'https://example.com');
});

it('correctly generates team link', async () => {
  mockGetResearchOutputs.mockResolvedValue({
    ...createListResearchOutputResponse(2),
    items: createListResearchOutputResponse(2).items.map((item, index) => ({
      ...item,
      team: {
        displayName: `Test Team ${index}`,
        id: `test-team-${index}`,
      },
    })),
  });
  const { getByText } = await renderResearchOutputList();
  const link = getByText('Team Test Team 0').closest('a');
  expect(link?.href).toEqual('http://localhost/network/teams/test-team-0');
});

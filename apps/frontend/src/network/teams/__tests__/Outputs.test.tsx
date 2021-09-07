import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import {
  createAlgoliaResearchOutputResponse,
  createResearchOutputResponse,
} from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import { disable } from '@asap-hub/flags';
import { ResearchOutputResponse } from '@asap-hub/model';

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

const renderOutputs = async (
  teamOutputs: ResearchOutputResponse[],
  searchQuery = '',
) => {
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
                    .teams({})
                    .team({ teamId: '12345' })
                    .outputs({}).$,
                },
              ]}
            >
              <Route
                path={
                  network({}).teams({}).team({ teamId: '12345' }).outputs({}).$
                }
              >
                <Outputs teamOutputs={teamOutputs} teamId={'12345'} />
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

it('generates a link to the output (REGRESSION)', async () => {
  disable('ALGOLIA_RESEARCH_OUTPUTS');
  const { getByText } = await renderOutputs([
    { ...createResearchOutputResponse(), id: 'ro0', title: 'Some RO' },
  ]);
  expect(getByText(/Some RO/).closest('a')!.href).toMatch(/ro0$/);
});

it('generates a link back to the team (REGRESSION)', async () => {
  disable('ALGOLIA_RESEARCH_OUTPUTS');

  const { getByText } = await renderOutputs([
    {
      ...createResearchOutputResponse(),
      teams: [{ id: '42', displayName: 'Some Team' }],
    },
  ]);
  expect(getByText(/Some Team/).closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/42$/),
  );
});

it('renders search and filter', async () => {
  const { getByRole } = await renderOutputs([
    { ...createResearchOutputResponse(), id: 'ro0', title: 'Some RO' },
  ]);
  expect(
    (getByRole('searchbox') as HTMLInputElement).placeholder,
  ).toMatchInlineSnapshot(`"Enter a keyword, method, resource…"`);
});

it('renders a list of research outputs', async () => {
  mockGetResearchOutputs.mockResolvedValue({
    ...createAlgoliaResearchOutputResponse(2),
    hits: createAlgoliaResearchOutputResponse(2).hits.map((hit, index) => ({
      ...hit,
      title: `Test Output ${index}`,
    })),
  });
  const { container } = await renderOutputs([], '');
  expect(container.textContent).toContain('Test Output 0');
  expect(container.textContent).toContain('Test Output 1');
});

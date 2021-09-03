import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/react-components/build/auth-test-utils';
import { disable } from '@asap-hub/flags';
import { ResearchOutputResponse } from '@asap-hub/model';

import { RecoilRoot } from 'recoil';
import Outputs from '../Outputs';

const renderOutputs = async (teamOutputs: ResearchOutputResponse[]) => {
  const result = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                { pathname: network({}).teams({}).$, search: '' },
              ]}
            >
              <Outputs teamOutputs={teamOutputs} teamId={'12345'} />
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

it('renders search and filter when ALGOLIA_RESEARCH_OUTPUTS is enabled', async () => {
  const { getByRole } = await renderOutputs([
    { ...createResearchOutputResponse(), id: 'ro0', title: 'Some RO' },
  ]);
  expect(
    (getByRole('searchbox') as HTMLInputElement).placeholder,
  ).toMatchInlineSnapshot(`"Enter a keyword, method, resource…"`);
});

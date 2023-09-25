import { render, RenderResult } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { WhenReady, Auth0Provider } from '../../auth/test-utils';

import Tags from '../Tags';

const renderTags = async (): Promise<RenderResult> =>
  render(
    <RecoilRoot>
      <Auth0Provider user={{}}>
        <WhenReady>
          <Suspense fallback="Loading...">
            <MemoryRouter initialEntries={['/']}>
              <Route exact path="/" component={Tags} />
            </MemoryRouter>
          </Suspense>
        </WhenReady>
      </Auth0Provider>
    </RecoilRoot>,
  );

it('renders a headline', async () => {
  const { findByRole } = await renderTags();
  expect((await findByRole('heading', { level: 1 })).textContent).toMatch(
    /tags/i,
  );
});

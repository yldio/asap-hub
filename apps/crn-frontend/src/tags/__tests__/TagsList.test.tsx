import { CRNTagSearchEntitiesListArray } from '@asap-hub/algolia';
import { render, RenderResult } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { WhenReady, Auth0Provider } from '../../auth/test-utils';

import TagList from '../TagsList';

const renderTags = async (): Promise<RenderResult> =>
  render(
    <RecoilRoot>
      <Auth0Provider user={{}}>
        <WhenReady>
          <Suspense fallback="Loading...">
            <MemoryRouter initialEntries={['/']}>
              <Route path="/">
                <TagList entities={CRNTagSearchEntitiesListArray} />
              </Route>
            </MemoryRouter>
          </Suspense>
        </WhenReady>
      </Auth0Provider>
    </RecoilRoot>,
  );

it('renders a headline', async () => {
  const { findByRole } = await renderTags();
  expect((await findByRole('heading')).textContent).toMatch(
    /Explore any tags on the CRN Hub./i,
  );
});

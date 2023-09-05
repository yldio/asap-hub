import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { authTestUtils } from '@asap-hub/react-components';

import Tags from '../Tags';

const renderTags = async (): Promise<RenderResult> =>
  render(
    <authTestUtils.UserAuth0Provider>
      <MemoryRouter initialEntries={['/']}>
        <Route exact path="/" component={Tags} />
      </MemoryRouter>
    </authTestUtils.UserAuth0Provider>,
  );

it('renders a headline', async () => {
  const { findByRole } = await renderTags();
  expect((await findByRole('heading', { level: 1 })).textContent).toMatch(
    /tags/i,
  );
});

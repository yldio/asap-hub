import { render, waitFor, RenderResult } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import nock from 'nock';
import { authTestUtils } from '@asap-hub/react-components';
import { ToastContext } from '@asap-hub/react-context';

import Tags from '../Tags';

afterEach(async () => {
  await waitFor(() => expect(nock.isDone()).toBe(true));
});

// toast
let mockToast: jest.Mock;
beforeEach(() => {
  mockToast = jest.fn();
});

const renderTags = async (): Promise<RenderResult> =>
  render(
    <authTestUtils.UserAuth0Provider>
      <ToastContext.Provider value={mockToast}>
        <MemoryRouter initialEntries={['/']}>
          <Route exact path="/" component={Tags} />
        </MemoryRouter>
      </ToastContext.Provider>
    </authTestUtils.UserAuth0Provider>,
  );

it('renders a headline', async () => {
  const { findByRole } = await renderTags();
  expect((await findByRole('heading', { level: 1 })).textContent).toMatch(
    /tags/i,
  );
});

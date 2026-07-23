import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { createOutputListAlgoliaResponse } from '../../__fixtures__/algolia';
import { getOutputs } from '../api';
import OutputList from '../OutputList';

jest.mock('../api');

const mockGetOutputs = getOutputs as jest.MockedFunction<typeof getOutputs>;

const renderOutputList = async () => {
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/outputs']}>
              <Routes>
                <Route
                  path="/outputs"
                  element={<OutputList searchQuery={''} />}
                />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>,
  );
  await waitFor(
    () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    { timeout: 30_000 },
  );
};

beforeEach(jest.resetAllMocks);

it('renders a list of research outputs', async () => {
  mockGetOutputs.mockResolvedValue(createOutputListAlgoliaResponse(1));
  await renderOutputList();
  expect(screen.getByText(/1 result found/i)).toBeVisible();
  expect(screen.getByText('Output 1')).toBeVisible();
});

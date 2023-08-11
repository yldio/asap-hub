import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { createOutputListAlgoliaResponse } from '../../__fixtures__/algolia';
import { getOutputs } from '../api';
import Routes from '../Routes';

jest.mock('../api');
const mockGetOutputs = getOutputs as jest.MockedFunction<typeof getOutputs>;

beforeEach(() => {
  jest.clearAllMocks();
});

const renderRoutes = async () => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/outputs']}>
              <Route path="/outputs">
                <Routes />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  return waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};
beforeEach(() => {
  jest.resetAllMocks();
});

describe('Routes', () => {
  it('renders the title', async () => {
    mockGetOutputs.mockResolvedValue(createOutputListAlgoliaResponse(0));
    await renderRoutes();
    expect(
      screen.getByRole('heading', { name: 'Outputs' }),
    ).toBeInTheDocument();
  });

  it('renders a list of  outputs', async () => {
    mockGetOutputs.mockResolvedValue(createOutputListAlgoliaResponse(2));
    await renderRoutes();
    expect(screen.getByText('Output 1')).toBeVisible();
    expect(screen.getByText('Output 2')).toBeVisible();
  });
});

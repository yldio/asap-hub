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
import OutputList from '../OutputList';

jest.mock('../api');

const mockGetOutputs = getOutputs as jest.MockedFunction<typeof getOutputs>;

const renderOutputList = async (searchQuery = '') => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/outputs']}>
              <Route path="/outputs">
                <OutputList searchQuery={''} />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  return waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

beforeEach(jest.resetAllMocks);

it('renders a list of research outputs', async () => {
  mockGetOutputs.mockResolvedValue(createOutputListAlgoliaResponse(1));
  await renderOutputList();
  expect(screen.getByText(/1 result found/i)).toBeVisible();
  expect(screen.getByText('Output 1')).toBeVisible();
});

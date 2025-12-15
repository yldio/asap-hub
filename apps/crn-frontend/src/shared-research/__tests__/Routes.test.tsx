import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { getResearchOutputs } from '../api';
import SharedResearchRoutes from '../Routes';

jest.mock('../api');

const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
  typeof getResearchOutputs
>;
jest.setTimeout(30000);
beforeEach(() => jest.spyOn(console, 'warn').mockImplementation());
mockConsoleError();
const renderSharedResearchPage = async (pathname: string, query = '') => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname, search: query }]}>
              <Routes>
                <Route
                  path="/shared-research/*"
                  element={<SharedResearchRoutes />}
                />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  return waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

describe('the shared research listing page', () => {
  it('allows typing in search queries', async () => {
    await renderSharedResearchPage('/shared-research');
    const searchBox = screen.getByRole('searchbox') as HTMLInputElement;

    await userEvent.type(searchBox, 'test123');
    expect(searchBox.value).toEqual('test123');
  });

  it('allows selection of filters', async () => {
    await renderSharedResearchPage('/shared-research');

    await userEvent.click(screen.getByText('Filters'));
    const checkbox = screen.getByLabelText('Grant Document');
    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(mockGetResearchOutputs).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ filters: new Set(['Grant Document']) }),
    );
  });

  it('reads filters from url', async () => {
    await renderSharedResearchPage(
      '/shared-research',
      '?filter=Grant+Document',
    );

    await userEvent.click(screen.getByText('Filters'));
    const checkbox = screen.getByLabelText('Grant Document');
    expect(checkbox).toBeChecked();

    expect(mockGetResearchOutputs).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ filters: new Set(['Grant Document']) }),
    );
  });
  it('renders when when the request it not a 2XX', async () => {
    mockGetResearchOutputs.mockRejectedValue(new Error('error'));

    await renderSharedResearchPage('/shared-research');
    await waitFor(() => expect(mockGetResearchOutputs).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.getByText(/Something went wrong/i)).toBeVisible(),
    );
  });
});

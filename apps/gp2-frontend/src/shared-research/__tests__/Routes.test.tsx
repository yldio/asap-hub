import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/gp2-frontend/src/auth/test-utils';

import Routes from '../Routes';
import { getResearchOutputs } from '../api';

jest.mock('../api');

const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
  typeof getResearchOutputs
>;

const renderSharedResearchPage = async (pathname: string, query = '') => {
  const result = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname, search: query }]}>
              <Route path={'/shared-research'}>
                <Routes />
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

describe('the shared research listing page', () => {
  it('allows typing in search queries', async () => {
    const { getByRole } = await renderSharedResearchPage('/shared-research');
    const searchBox = getByRole('searchbox') as HTMLInputElement;

    userEvent.type(searchBox, 'test123');
    expect(searchBox.value).toEqual('test123');
  });

  it('allows selection of filters', async () => {
    const { getByText, getByLabelText } = await renderSharedResearchPage(
      '/shared-research',
    );

    userEvent.click(getByText('Filters'));
    const checkbox = getByLabelText('Grant Document');
    expect(checkbox).not.toBeChecked();

    userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    await waitFor(() => {
      expect(mockGetResearchOutputs).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ filters: new Set(['Grant Document']) }),
      );
    });
  });

  it('reads filters from url', async () => {
    const { getByText, getByLabelText } = await renderSharedResearchPage(
      '/shared-research',
      '?filter=Grant+Document',
    );

    userEvent.click(getByText('Filters'));
    const checkbox = getByLabelText('Grant Document');
    expect(checkbox).toBeChecked();

    expect(mockGetResearchOutputs).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ filters: new Set(['Grant Document']) }),
    );
  });
});

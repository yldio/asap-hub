import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';
import { useFlags } from '@asap-hub/react-context';
import { renderHook } from '@testing-library/react-hooks';

import Routes from '../Routes';
import { getResearchOutputsLegacy, getResearchOutputs } from '../api';

jest.mock('../api');
const mockGetResearchOutputsLegacy =
  getResearchOutputsLegacy as jest.MockedFunction<
    typeof getResearchOutputsLegacy
  >;

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

describe('the shared research listing page (REGRESSION)', () => {
  it('allows typing in search queries (REGRESSION)', async () => {
    const {
      result: { current },
    } = renderHook(useFlags);
    current.disable('ALGOLIA_RESEARCH_OUTPUTS');
    const { getByRole } = await renderSharedResearchPage('/shared-research');
    const searchBox = getByRole('searchbox') as HTMLInputElement;

    userEvent.type(searchBox, 'test123');
    expect(searchBox.value).toEqual('test123');
  });

  it('allows selection of filters (REGRESSION)', async () => {
    const {
      result: { current },
    } = renderHook(useFlags);
    current.disable('ALGOLIA_RESEARCH_OUTPUTS');

    const { getByText, getByLabelText } = await renderSharedResearchPage(
      '/shared-research',
    );

    userEvent.click(getByText('Filters'));
    const checkbox = getByLabelText('Proposal');
    expect(checkbox).not.toBeChecked();

    userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    await waitFor(() => {
      expect(mockGetResearchOutputsLegacy).toHaveBeenLastCalledWith(
        expect.objectContaining({ filters: new Set(['Proposal']) }),
        expect.anything(),
      );
    });
  });

  it('reads filters from url (REGRESSION)', async () => {
    const {
      result: { current },
    } = renderHook(useFlags);
    current.disable('ALGOLIA_RESEARCH_OUTPUTS');
    const { getByText, getByLabelText } = await renderSharedResearchPage(
      '/shared-research',
      '?filter=Proposal',
    );

    userEvent.click(getByText('Filters'));
    const checkbox = getByLabelText('Proposal');
    expect(checkbox).toBeChecked();

    expect(mockGetResearchOutputsLegacy).toHaveBeenLastCalledWith(
      expect.objectContaining({ filters: new Set(['Proposal']) }),
      expect.anything(),
    );
  });
});

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
    const checkbox = getByLabelText('Proposal');
    expect(checkbox).not.toBeChecked();

    userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    await waitFor(() => {
      expect(mockGetResearchOutputs).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ filters: new Set(['Proposal']) }),
      );
    });
  });

  it('reads filters from url', async () => {
    const { getByText, getByLabelText } = await renderSharedResearchPage(
      '/shared-research',
      '?filter=Proposal',
    );

    userEvent.click(getByText('Filters'));
    const checkbox = getByLabelText('Proposal');
    expect(checkbox).toBeChecked();

    expect(mockGetResearchOutputs).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ filters: new Set(['Proposal']) }),
    );
  });
});

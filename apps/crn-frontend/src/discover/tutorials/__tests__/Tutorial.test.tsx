import { RecoilRoot } from 'recoil';
import { Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { TutorialsResponse } from '@asap-hub/model';
import { tutorials } from '@asap-hub/routing';

import Tutorial from '../Tutorial';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { refreshTutorialItemState } from '../state';
import { getTutorialById } from '../api';

jest.mock('../api');

const tutorial: TutorialsResponse = {
  id: '55724942-3408-4ad6-9a73-14b92226ffb6',
  created: '2020-09-07T17:36:54Z',
  title: 'Tutorial Title',
};

const mockGetTutorialById = getTutorialById as jest.MockedFunction<
  typeof getTutorialById
>;

const renderPage = async () => {
  const result = render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshTutorialItemState(tutorial.id), Math.random())
      }
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                tutorials({}).article({ articleId: tutorial.id }).$,
              ]}
            >
              <Route path={tutorials.template + tutorials({}).article.template}>
                <Tutorial />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitFor(() =>
    expect(result.queryByText(/auth0/i)).not.toBeInTheDocument(),
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

describe('news detail page', () => {
  beforeEach(() => {
    mockGetTutorialById.mockClear();
  });

  it('renders not found when the request doesnt return a TutorialResponse Object', async () => {
    mockGetTutorialById.mockResolvedValue(undefined);

    const { getByRole } = await renderPage();
    expect(getByRole('heading').textContent).toContain(
      'Sorry! We can’t seem to find that page.',
    );
  });

  it('renders title', async () => {
    mockGetTutorialById.mockResolvedValue(tutorial);

    const { getByRole } = await renderPage();
    expect(getByRole('heading').textContent).toContain('Tutorial Title');
  });
});

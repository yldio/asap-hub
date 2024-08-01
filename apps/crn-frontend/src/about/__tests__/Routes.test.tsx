import { Suspense } from 'react';
import {
  render,
  waitForElementToBeRemoved,
  screen,
  waitFor,
} from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createUserResponse } from '@asap-hub/fixtures';
import { DiscoverResponse } from '@asap-hub/model';
import { aboutRoutes } from '@asap-hub/routing';

import About from '../Routes';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getDiscover } from '../api';

jest.mock('../api');
mockConsoleError();
afterEach(() => {
  jest.clearAllMocks();
});

const mockGetDiscover = getDiscover as jest.MockedFunction<typeof getDiscover>;

const props: DiscoverResponse = {
  aboutUs: '',
  members: [],
  scientificAdvisoryBoard: [],
};

const renderPage = async () => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/about']}>
              <Routes>
                <Route path={aboutRoutes.path} element={<About />} />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(screen.queryByText(/loading/i));
};

describe('the About page', () => {
  it('renders the About Page successfully', async () => {
    mockGetDiscover.mockResolvedValue({
      ...props,
      members: [
        {
          ...createUserResponse(),
          id: 'uuid',
          displayName: 'John Doe',
          jobTitle: 'CEO',
          institution: 'ASAP',
        },
      ],
      scientificAdvisoryBoard: [],
    });

    await renderPage();
    expect(
      await screen.findByText(/About ASAP/i, {
        selector: 'h1',
      }),
    ).toBeVisible();
  });

  it('renders error message when the response is not a 2XX', async () => {
    mockGetDiscover.mockRejectedValue(new Error('error'));

    await renderPage();
    waitFor(() => {
      expect(mockGetDiscover).toHaveBeenCalled();
      expect(screen.getByText(/Something went wrong/i)).toBeVisible();
    });
  });
});

import { gp2 } from '@asap-hub/fixtures';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getWorkingGroupNetwork } from '../api';
import Routes from '../Routes';

const renderRoutes = async () => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/working-groups']}>
              <Route path="/working-groups">
                <Routes setBannerMessage={jest.fn()} />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  return waitForElementToBeRemoved(() => screen.queryByText(/loading/i), {
    timeout: 30_000,
  });
};

jest.mock('../api');
describe('Routes', () => {
  beforeEach(jest.resetAllMocks);
  it('renders a list of working groups', async () => {
    const mockGetWorkingGroups = getWorkingGroupNetwork as jest.MockedFunction<
      typeof getWorkingGroupNetwork
    >;
    const firstGroup = gp2.createWorkingGroupResponse({
      id: '42',
      title: 'Working Group 42',
    });
    const secondGroup = gp2.createWorkingGroupResponse({
      id: '11',
      title: 'Working Group 11',
    });
    mockGetWorkingGroups.mockResolvedValue({
      total: 1,
      items: [
        {
          role: 'support',
          workingGroups: [firstGroup, secondGroup],
        },
      ],
    });
    await renderRoutes();
    expect(
      screen.getByRole('heading', { name: 'Working Group 42' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Working Group 11' }),
    ).toBeInTheDocument();
  }, 30_000);
});

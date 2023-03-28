import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter } from 'react-router-dom';
import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { RecoilRoot } from 'recoil';
import { gp2 } from '@asap-hub/routing';

import { getUser } from '../../users/api';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { stepToHref, useOnboarding } from '../onboarding';

jest.mock('../../users/api');

const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
const emptyUser: gp2Model.UserResponse = {
  ...gp2Fixtures.createUserResponse(),
  onboarded: false,
  biography: undefined,
  positions: [],
  city: undefined,
  keywords: [],
  degrees: [],
  questions: [],
};

const wrapper =
  (
    { user }: { user?: gp2Model.UserResponse },
    step: string = gp2.onboarding({}).coreDetails({}).$,
  ): React.FC =>
  ({ children }) =>
    (
      <RecoilRoot>
        <Auth0Provider user={{ id: user?.id, onboarded: user?.onboarded }}>
          <WhenReady>
            <MemoryRouter initialEntries={[step]}>{children}</MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>
    );

describe('useOnboarding', () => {
  beforeEach(() => mockGetUser.mockClear());

  it('handles when a user is not logged in', async () => {
    mockGetUser.mockResolvedValueOnce(undefined);

    const { result, waitForNextUpdate } = renderHook(() => useOnboarding(''), {
      wrapper: wrapper({ user: undefined }),
    });

    await waitForNextUpdate();
    expect(result.current).toEqual(undefined);
  });

  it('returns all steps required to complete the profile', async () => {
    const user = { ...emptyUser };
    mockGetUser.mockResolvedValueOnce(user);

    const { result, waitForNextUpdate } = renderHook(
      () => useOnboarding(user.id),
      {
        wrapper: wrapper({ user }),
      },
    );
    await waitForNextUpdate();
    expect((result.current?.steps ?? []).map(({ name }) => name)).toEqual([
      'Core Details',
      'Background',
      'GP2 Groups',
      'Additional Details',
      'Preview',
    ]);
  });
  it('returns the steps as completed and isOnboardable as true when the required fields are filled', async () => {
    const user: gp2Model.UserResponse = {
      ...emptyUser,
      biography: 'bio',
      positions: [
        { institution: 'institution', role: 'cto', department: 'dept' },
      ],
      city: 'home',
      keywords: ['Administrative Support'],
      degrees: ['AA'],
    };
    mockGetUser.mockResolvedValueOnce(user);
    const { result, waitForNextUpdate } = renderHook(
      () => useOnboarding(user.id),
      {
        wrapper: wrapper({ user }),
      },
    );
    await waitForNextUpdate();
    expect(
      (result.current?.steps ?? []).map(({ completed }) => completed),
    ).toEqual([true, true, true, true, true]);
    expect(result.current?.isOnboardable).toBeTruthy();
  });
  it('returns the steps that are not completed with completed as false', async () => {
    mockGetUser.mockResolvedValueOnce(emptyUser);
    const { result, waitForNextUpdate } = renderHook(
      () => useOnboarding(emptyUser.id),
      {
        wrapper: wrapper({ user: emptyUser }),
      },
    );
    await waitForNextUpdate();
    expect(
      (result.current?.steps ?? []).map(({ completed }) => completed),
    ).toEqual([false, false, true, true, true]);
  });
  describe('if on the first step', () => {
    it('should return no previous step href and the next step href', async () => {
      const user: gp2Model.UserResponse = {
        ...emptyUser,
        biography: 'bio',
        positions: [
          { institution: 'institution', role: 'cto', department: 'dept' },
        ],
        city: 'home',
        keywords: ['Administrative Support'],
        degrees: ['AA'],
      };
      mockGetUser.mockResolvedValueOnce(user);
      const { result, waitForNextUpdate } = renderHook(
        () => useOnboarding(user.id),
        {
          wrapper: wrapper({ user }, stepToHref['Core Details']),
        },
      );
      await waitForNextUpdate();
      expect(result.current?.previousStep).toBeFalsy();
      expect(result.current?.nextStep).toBe(stepToHref.Background);
    });
  });
});
describe('if on the last step', () => {
  it('should return the previous step href and no next step href', async () => {
    const user: gp2Model.UserResponse = {
      ...emptyUser,
      biography: 'bio',
      positions: [
        { institution: 'institution', role: 'cto', department: 'dept' },
      ],
      city: 'home',
      keywords: ['Administrative Support'],
      degrees: ['AA'],
    };
    mockGetUser.mockResolvedValueOnce(user);
    const { result, waitForNextUpdate } = renderHook(
      () => useOnboarding(user.id),
      {
        wrapper: wrapper({ user }, stepToHref.Preview),
      },
    );
    await waitForNextUpdate();
    expect(result.current?.previousStep).toBe(stepToHref['Additional Details']);
    expect(result.current?.nextStep).toBeFalsy();
  });
});

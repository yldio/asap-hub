import { renderHook } from '@testing-library/react-hooks';
import { RecoilRoot } from 'recoil';
import React from 'react';
import { gp2 } from '@asap-hub/fixtures';
import { getExternalUsers, getUsers } from '../../users/api';
import { useAuthorSuggestions } from '../state';
import { refreshUsersState } from '../../users/state';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';

jest.mock('../../users/api');

const mockGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;
const mockGetExternalUsers = getExternalUsers as jest.MockedFunction<
  typeof getExternalUsers
>;

const wrapper: React.FC = ({ children }) => (
  <RecoilRoot
    initializeState={({ set }) => {
      set(refreshUsersState, Math.random());
    }}
  >
    <Auth0Provider user={{}}>
      <WhenReady>{children}</WhenReady>
    </Auth0Provider>
  </RecoilRoot>
);

beforeEach(jest.resetAllMocks);
describe('useAuthorSuggestions', () => {
  it('should return a list of Users and External Users', async () => {
    mockGetUsers.mockResolvedValueOnce({
      total: 2,
      items: [
        gp2.createUserResponse({ displayName: 'Tony Stark', id: '1' }),
        gp2.createUserResponse({ displayName: 'Bruce Banner' }),
      ],
    });
    mockGetExternalUsers.mockResolvedValueOnce({
      total: 1,
      items: [{ displayName: 'Steve Rogers', id: '2' }],
    });
    const { result, waitForNextUpdate } = renderHook(
      () => useAuthorSuggestions(),
      { wrapper },
    );
    await waitForNextUpdate();

    const authors = await result.current('');

    expect(authors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Bruce Banner' }),
        expect.objectContaining({ label: 'Steve Rogers' }),
        expect.objectContaining({ label: 'Tony Stark' }),
      ]),
    );
  });
});

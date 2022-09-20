import { gp2 } from '@asap-hub/model';

const mockedUser = {
  id: 'user-id-1',
  createdDate: '2020-09-23T20:45:22.000Z',
  displayName: 'Tom Hardy',
  email: 'H@rdy.io',
  firstName: 'Tom',
  lastName: 'Hardy',
  region: 'Europe' as const,
  degrees: ['PhD' as const],
  role: 'Trainee' as const,
};

export const createUserResponse = (
  overrides: Partial<gp2.UserResponse> = {},
): gp2.UserResponse => ({
  ...mockedUser,
  ...overrides,
});

export const createUsersResponse = (
  items = [createUserResponse()],
): gp2.ListUserResponse => ({
  items,
  total: items.length,
});

import { gp2 } from '@asap-hub/model';

const mockedUser = {
  id: 'user-id-1',
  createdDate: '2020-09-23T20:45:22.000Z',
  displayName: 'Tony Stark',
  email: 'T@ark.io',
  firstName: 'Tony',
  lastName: 'Stark',
  region: 'Europe' as const,
  degrees: ['PhD' as const],
  role: 'Trainee' as const,
  country: 'Spain',
  positions: [
    {
      role: 'CEO',
      department: 'Research',
      institution: 'Stark Industries',
    },
  ],
};

export const createUserResponse = (
  overrides: Partial<gp2.UserResponse> = {},
): gp2.UserResponse => ({
  ...mockedUser,
  ...overrides,
});

export const createUsersResponse = (items = 1): gp2.ListUserResponse => ({
  items: Array.from({ length: items }, (_, id) =>
    createUserResponse({ id: String(id) }),
  ),
  total: items,
});

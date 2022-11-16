import { gp2 } from '@asap-hub/auth';

export const createAuthUser = (): gp2.User => ({
  id: 'test-id-7',
  onboarded: true,
  displayName: 'Peter Parker',
  email: 'peter.parket@example.com',
  firstName: 'Peter',
  lastName: 'Parker',
  role: 'Trainee',
});

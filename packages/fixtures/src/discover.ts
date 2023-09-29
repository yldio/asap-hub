import { DiscoverResponse } from '@asap-hub/model';
import { createPageResponse } from './pages';
import { createUserResponse } from './users';

export const createDiscoverResponse = (): DiscoverResponse => ({
  aboutUs: '<h1>About us</h1>',
  pages: [createPageResponse('demo page')],
  members: [createUserResponse()],
  scientificAdvisoryBoard: [createUserResponse()],
});

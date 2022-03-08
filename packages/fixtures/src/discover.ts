import { DiscoverResponse } from '@asap-hub/model';
import { createPageResponse } from './pages';
import { createNewsResponse } from './news';
import { createUserResponse } from './users';

export const createDiscoverResponse = (): DiscoverResponse => ({
  aboutUs: '<h1>About us</h1>',
  training: [createNewsResponse(`demo workshop`, 'Training')],
  pages: [createPageResponse('demo page')],
  members: [createUserResponse()],
  scientificAdvisoryBoard: [createUserResponse()],
});

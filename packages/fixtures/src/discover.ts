import { DiscoverResponse } from '@asap-hub/model';
import { createPageResponse } from './pages';
import { createTutorialsResponse } from './tutorials';
import { createUserResponse } from './users';

export const createDiscoverResponse = (): DiscoverResponse => ({
  aboutUs: '<h1>About us</h1>',
  training: [createTutorialsResponse({ key: 'demo workshop' })],
  pages: [createPageResponse('demo page')],
  members: [createUserResponse()],
  scientificAdvisoryBoard: [createUserResponse()],
});

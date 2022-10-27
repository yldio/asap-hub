import { DiscoverResponse } from '@asap-hub/model';
import { createPageResponse } from './pages';
import { createNewsResponse } from './news';
import { createUserResponse } from './users';
import { createWorkingGroupResponse } from './working-groups';

export const createDiscoverResponse = (): DiscoverResponse => ({
  aboutUs: '<h1>About us</h1>',
  training: [createNewsResponse({ key: 'demo workshop', type: 'Tutorial' })],
  pages: [createPageResponse('demo page')],
  members: [createUserResponse()],
  scientificAdvisoryBoard: [createUserResponse()],
  workingGroups: [createWorkingGroupResponse()],
});

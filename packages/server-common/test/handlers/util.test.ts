import {
  createProcessingFunction,
  eventFilter,
  userFilter,
} from '../../src/handlers/utils';
import { getAlgoliaSearchClientMock } from '../mocks/algolia-client.mock';
import { loggerMock as logger } from '../mocks/logger.mock';
import { getEventResponse } from './calendar/fixtures/events.fixtures';
import { getListUserResponse, getUserResponse } from './calendar/fixtures/user';
describe('utils', () => {
  describe('createProcessingFunction', () => {
    test('records are saved into Algolia', () => {
      const algoliaClient = getAlgoliaSearchClientMock();
      const users = getListUserResponse();
      const processingFunction = createProcessingFunction(
        algoliaClient,
        'user',
        logger,
      );
      processingFunction(users);
      expect(
        algoliaClient.saveMany([
          {
            data: users.items[0],
            type: 'user' as const,
          },
        ]),
      );
    });
    test('the filters are applied', () => {
      const algoliaClient = getAlgoliaSearchClientMock();
      const users = getListUserResponse();
      const filter = jest.fn().mockReturnValue(true);
      const processingFunction = createProcessingFunction(
        algoliaClient,
        'user',
        logger,
        filter,
      );
      processingFunction(users);
      expect(filter).toBeCalled();
    });
  });
  describe('userFilter', () => {
    test('returns true when the user is onboarded and not hidden', () => {
      const user = getUserResponse({ onboarded: true, role: 'Grantee' });
      expect(userFilter(user)).toBe(true);
    });
    test('returns false when the user is not onboarded and not hidden', () => {
      const user = getUserResponse({ onboarded: false, role: 'Grantee' });
      expect(userFilter(user)).toBe(false);
    });
    test('returns false when the user is  onboarded and  hidden', () => {
      const user = getUserResponse({ onboarded: true, role: 'Hidden' });
      expect(userFilter(user)).toBe(false);
    });
  });
  describe('eventFilter', () => {
    test('returns true when the event is not hidden', () => {
      const event = getEventResponse({ hidden: false });
      expect(eventFilter(event)).toBe(true);
    });
    test('returns false when event is hidden', () => {
      const event = getEventResponse({ hidden: true });
      expect(eventFilter(event)).toBe(false);
    });
  });
});

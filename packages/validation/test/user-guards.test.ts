import { ExternalAuthorResponse } from '@asap-hub/model';
import {
  createUserResponse,
  createSpeakerUserResponse,
} from '@asap-hub/fixtures';
import { isInternalUser, isInternalEventUser } from '../src/user-guards';
describe('isInternalAuthor', () => {
  it('should return true when author is internal', () => {
    expect(isInternalUser(createUserResponse())).toEqual(true);
  });

  it('should return false when author is external', () => {
    expect(
      isInternalUser({
        displayName: 'user name',
      } as ExternalAuthorResponse),
    ).toEqual(false);
  });
});

describe('isInternalEventSpeaker', () => {
  it('should return true when event user is internal', () => {
    const user = createSpeakerUserResponse();
    expect(isInternalEventUser(user)).toEqual(true);
  });

  it('should return false when event user is external', () => {
    const user = undefined;
    expect(isInternalEventUser(user)).toEqual(false);
  });
});

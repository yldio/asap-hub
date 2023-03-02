import { ExternalAuthorResponse } from '@asap-hub/model';
import {
  createUserResponse,
  createSpeakerUserResponse,
} from '@asap-hub/fixtures';
import { isExternalUser, isInternalUser } from '../src/user-guards';
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
describe('isExternalUser', () => {
  it('should return true when User is External', () => {
    expect(
      isExternalUser({
        displayName: 'user name',
      } as ExternalAuthorResponse),
    ).toEqual(true);
  });

  it('should return false when User is internal', () => {
    expect(isExternalUser(createUserResponse())).toEqual(false);
  });
});

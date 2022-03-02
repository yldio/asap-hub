import { ExternalAuthorResponse } from '@asap-hub/model';
import { createUserResponse } from '@asap-hub/fixtures';

import { isInternalUser } from '../src/user-guards';

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

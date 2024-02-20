import { parseUserDisplayName } from '../src/user-common';

describe('User display name parser', () => {
  test('Should put any nickname in brackets', async () => {
    const firstName = 'John';
    const nickname = 'R2 D2';
    const lastName = 'Smith';

    const displayName = parseUserDisplayName(
      'short',
      firstName,
      lastName,
      undefined,
      nickname,
    );

    expect(displayName).toEqual('John (R2 D2) Smith');
  });
  describe('full display name', () => {
    test('Should use all middle name initials', async () => {
      const firstName = 'John';
      const lastName = 'Smith';
      const middleName = 'Wilbur Thomas Geofrey';

      const displayName = parseUserDisplayName(
        'full',
        firstName,
        lastName,
        middleName,
      );

      expect(displayName).toEqual('John W. T. G. Smith');
    });
    test('Should drop nickname and middle name when not available', async () => {
      const firstName = 'John';
      const lastName = 'Smith';

      const displayName = parseUserDisplayName('full', firstName, lastName);

      expect(displayName).toEqual('John Smith');
    });
  });
});

import { parseUserDisplayName } from '../../src';

describe('User display name parser', () => {
  test('Should drop nickname and middle name when not available', async () => {
    const firstName = 'John';
    const lastName = 'Smith';

    const displayName = parseUserDisplayName(firstName, lastName);

    expect(displayName).toEqual('John Smith');
  });

  test('Should use all middle name initials', async () => {
    const firstName = 'John';
    const lastName = 'Smith';
    const middleName = 'Wilbur Thomas Geofrey';

    const displayName = parseUserDisplayName(firstName, lastName, middleName);

    expect(displayName).toEqual('John W. T. G. Smith');
  });

  test('Should put any nickname in brackets', async () => {
    const firstName = 'John';
    const nickname = 'R2 D2';
    const lastName = 'Smith';

    const displayName = parseUserDisplayName(
      firstName,
      lastName,
      undefined,
      nickname,
    );

    expect(displayName).toEqual('John (R2 D2) Smith');
  });
});

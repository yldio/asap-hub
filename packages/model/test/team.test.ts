import {
  countActiveUniqueMembers,
  isActiveTeamMember,
  isPIRole,
} from '../src/team';

describe('isPIRole', () => {
  test.each([
    'Lead PI (Core Leadership)',
    'Co-PI (Core Leadership)',
    'Collaborating PI',
  ] as const)('should return true for "%s"', (role) => {
    expect(isPIRole(role)).toBe(true);
  });

  test.each([
    'Project Manager',
    'Data Manager',
    'Key Personnel',
    'Scientific Advisory Board',
    'ASAP Staff',
    'Trainee',
  ] as const)('should return false for "%s"', (role) => {
    expect(isPIRole(role)).toBe(false);
  });

  test('should return false for non-string values', () => {
    expect(isPIRole(undefined)).toBe(false);
    expect(isPIRole(null)).toBe(false);
    expect(isPIRole(42)).toBe(false);
  });
});

describe('isActiveTeamMember', () => {
  test('should return true when neither alumni nor inactive date is set', () => {
    expect(isActiveTeamMember({})).toBe(true);
  });

  test('should return false when the member is a hub alumni', () => {
    expect(
      isActiveTeamMember({ alumniSinceDate: '2020-01-01T00:00:00Z' }),
    ).toBe(false);
  });

  test('should return false when the member is inactive on the team', () => {
    expect(
      isActiveTeamMember({ inactiveSinceDate: '2020-01-01T00:00:00Z' }),
    ).toBe(false);
  });

  test('should return false when both dates are set', () => {
    expect(
      isActiveTeamMember({
        alumniSinceDate: '2020-01-01T00:00:00Z',
        inactiveSinceDate: '2021-01-01T00:00:00Z',
      }),
    ).toBe(false);
  });
});

describe('countActiveUniqueMembers', () => {
  test('should return 0 for an empty list', () => {
    expect(countActiveUniqueMembers([])).toBe(0);
  });

  test('should count only active members, excluding alumni and inactive', () => {
    expect(
      countActiveUniqueMembers([
        { id: 'active' },
        { id: 'alumni', alumniSinceDate: '2020-01-01T00:00:00Z' },
        { id: 'inactive', inactiveSinceDate: '2020-01-01T00:00:00Z' },
      ]),
    ).toBe(1);
  });

  test('should count a user with multiple active memberships only once', () => {
    expect(countActiveUniqueMembers([{ id: 'user-1' }, { id: 'user-1' }])).toBe(
      1,
    );
  });

  test('should count a user as active when they have an active and a past membership', () => {
    expect(
      countActiveUniqueMembers([
        { id: 'user-1' },
        { id: 'user-1', inactiveSinceDate: '2020-01-01T00:00:00Z' },
      ]),
    ).toBe(1);
  });
});

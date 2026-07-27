import { isActiveTeamMember, isPIRole } from '../src/team';

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

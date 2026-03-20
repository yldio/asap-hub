import { isPIRole } from '../src/team';

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

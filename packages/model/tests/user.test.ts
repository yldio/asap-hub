import { isUserDegree, isUserRole, userDegree, userRole } from '../src';

describe('User', () => {
  describe('Role', () => {
    it.each(userRole)('should recognize correct role - %s', (role) => {
      expect(isUserRole(role)).toEqual(true);
    });

    it('should not recognize incorrect role', () => {
      expect(isUserRole('not-a-role')).toEqual(false);
    });
  });

  describe('User degree', () => {
    it.each(userDegree)('should recognize correct degree - %s', (degree) => {
      expect(isUserDegree(degree)).toEqual(true);
    });

    it('should not recognize incorrect degree', () => {
      expect(isUserDegree('not-a-degree')).toEqual(false);
    });
  });
});

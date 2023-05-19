import { isUserDegree, isUserRole, userDegree, userRole } from '../src';

describe('User', () => {
  describe('Role', () => {
    it.each(userRole)('should recognise correct role - %s', (role) => {
      expect(isUserRole(role)).toEqual(true);
    });

    it('should not recognise incorrect role', () => {
      expect(isUserRole('not-a-role')).toEqual(false);
    });
  });

  describe('User degree', () => {
    it.each(userDegree)('should recognise correct degree - %s', (degree) => {
      expect(isUserDegree(degree)).toEqual(true);
    });

    it('should not recognise incorrect degree', () => {
      expect(isUserDegree('not-a-degree')).toEqual(false);
    });
  });
});

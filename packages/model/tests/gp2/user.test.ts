import {
  isUserRegion,
  isUserRole,
  userRegions,
  userRoles,
} from '../../src/gp2';

describe('User', () => {
  describe('Role', () => {
    it.each(userRoles)('should recognize correct role - %s', (role) => {
      expect(isUserRole(role)).toEqual(true);
    });

    it('should not recognize incorrect role', () => {
      expect(isUserRole('not-a-role')).toEqual(false);
    });
  });

  describe('User Regions', () => {
    it.each(userRegions)('should recognize correct region - %s', (region) => {
      expect(isUserRegion(region)).toEqual(true);
    });

    it('should not recognize incorrect region', () => {
      expect(isUserRegion('not-a-region')).toEqual(false);
    });
  });
});

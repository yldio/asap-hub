import {
  isUserContributingCohortRole,
  isUserDegree,
  isUserRegion,
  isUserRole,
  userContributingCohortRole,
  userDegrees,
  userRegions,
  userRoles,
} from '../../src/gp2';

describe('user', () => {
  describe('isUserRole', () => {
    it.each(userRoles)('should recognise correct value %s', (value) => {
      expect(isUserRole(value)).toEqual(true);
    });

    it('should not recognise incorrect value', () => {
      expect(isUserRole('not-valid')).toEqual(false);
    });
  });
  describe('isUserDegree', () => {
    it.each(userDegrees)('should recognise correct value %s', (value) => {
      expect(isUserDegree(value)).toEqual(true);
    });

    it('should not recognise incorrect value', () => {
      expect(isUserDegree('not-valid')).toEqual(false);
    });
  });
  describe('isUserRegion', () => {
    it.each(userRegions)('should recognise correct value %s', (value) => {
      expect(isUserRegion(value)).toEqual(true);
    });

    it('should not recognise incorrect value', () => {
      expect(isUserRegion('not-valid')).toEqual(false);
    });
  });
  describe('isUserContributingCohortRole', () => {
    it.each(userContributingCohortRole)(
      'should recognise correct value %s',
      (value) => {
        expect(isUserContributingCohortRole(value)).toEqual(true);
      },
    );

    it('should not recognise incorrect value', () => {
      expect(isUserContributingCohortRole('not-valid')).toEqual(false);
    });
  });
});

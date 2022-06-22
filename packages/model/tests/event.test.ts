import { isUserConstraint } from '@asap-hub/model';

describe('Event Model', () => {
  describe('isUserConstraint', () => {
    it('should return true for user type', () => {
      expect(isUserConstraint('user')).toEqual(true);
    });

    it('should return false for team type', () => {
      expect(isUserConstraint('team')).toEqual(false);
    });
  });
});

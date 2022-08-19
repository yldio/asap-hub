import { isWorkingGroupMemberRole } from '../../src/gp2';
describe('Research Tag Model', () => {
  describe('WorkingGroupMemberRole', () => {
    it('should recognize correct category', () => {
      expect(isWorkingGroupMemberRole('Chair')).toEqual(true);
    });

    it('should not recognize incorrect category', () => {
      expect(isWorkingGroupMemberRole('not-a-role')).toEqual(false);
    });
  });
});

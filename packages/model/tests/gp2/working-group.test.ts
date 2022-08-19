import { isWorkingGroupMemberRole } from '../../src/gp2';
describe('Working Group Model', () => {
  describe('WorkingGroupMemberRole', () => {
    it('should recognise correct role', () => {
      expect(isWorkingGroupMemberRole('Lead')).toEqual(true);
    });

    it('should not recognise incorrect role', () => {
      expect(isWorkingGroupMemberRole('not-a-role')).toEqual(false);
    });
  });
});

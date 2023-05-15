import {
  isWorkingGroupMemberRole,
  workingGroupMemberRole,
} from '../../src/gp2';

describe('working group', () => {
  describe('isWorkingGroupMemberRole', () => {
    it.each(workingGroupMemberRole)(
      'should recognise correct value %s',
      (value) => {
        expect(isWorkingGroupMemberRole(value)).toEqual(true);
      },
    );

    it('should not recognise incorrect value', () => {
      expect(isWorkingGroupMemberRole('not-valid')).toEqual(false);
    });
  });
});
